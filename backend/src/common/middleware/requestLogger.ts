// built-in modules
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";

// third-party packages
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import pinoHttp from "pino-http";
import dayjs from "dayjs";

// internal modules
import { env } from "@/common/utils/envConfig";

const transportTargets: pino.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      ignore: "req,res,responseTime,headers,remoteAddress,remotePort",
    },
    level: "info",
  },
];

// File logging: log everything at info level
if (env.FILE_LOGGING_ENABLED) {
  const logsDir = path.resolve(process.cwd(), env.LOG_DIR);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const logFile = path.join(logsDir, dayjs().format("YY-MM-DDTHH-mm-ss") + ".log");

  // Keep only the 5 most recent log files
  const MAX_LOGS = 5;
  try {
    const files = fs
      .readdirSync(logsDir)
      .filter((f) => f.endsWith(".log"))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(logsDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length >= MAX_LOGS - 1) {
      const toDelete = files.slice(MAX_LOGS - 1);
      toDelete.forEach((f) => {
        fs.unlinkSync(path.join(logsDir, f.name));
      });
    }
  } catch (err) {
    // Don't crash if unable to clean up logs
    console.error("Error cleaning up log files:", err);
  }

  transportTargets.push({
    target: "pino/file",
    options: { destination: logFile },
    level: "info",
  });
}

// Create a single, unified logger instance
const logger = pino({
  level: "info", // Always log everything to file
  transport: {
    targets: transportTargets,
  },
});

// Usage note:
// Use logger.info(), logger.warn(), logger.error(), etc. for system messages.
// These will be written to both file and console (if not filtered by level).

// Helper to determine log level from status code
const getLogLevel = (status: number) => {
  if (status >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
  if (status >= StatusCodes.BAD_REQUEST) return "warn";
  return "info";
};

// Console logger: log minimal
const requestConsoleLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const responseTime = Number(end - start) / 1e6; // ms
    const logObj = {
      path: req.originalUrl || req.url,
      params: req.params as object,
      body: req.body as object,
      response: res.locals.responseBody ?? res.statusCode,
      responseTime: `${responseTime.toFixed(2)}ms`,
    };
    console.log(JSON.stringify(logObj, null, 2));
  });
  next();
};

// File logger: log everything
const requestFileLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const existingId = req.headers["x-request-id"] as string;
    const id = existingId || randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },
  customLogLevel: (_req, res) => getLogLevel(res.statusCode),
  customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
  customErrorMessage: (_req, res) => `Request failed with status code: ${res.statusCode}`,
});

// Middleware to add request ID to the request object for easy access
const addRequestId = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.id) {
    const headerId = req.headers["x-request-id"];
    req.id = typeof headerId === "string" ? headerId : Array.isArray(headerId) ? headerId[0] : "";
  }
  next();
};

// Middleware to automatically capture response body
const captureResponseBody = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  const originalSend = res.send;

  res.json = function (body: unknown) {
    res.locals.responseBody = body;
    return originalJson.call(this, body);
  };

  res.send = function (body: unknown) {
    if (res.locals.responseBody === undefined) {
      res.locals.responseBody = body;
    }
    return originalSend.call(this, body);
  };

  next();
};

export { logger, requestFileLogger, requestConsoleLogger, captureResponseBody, addRequestId };
