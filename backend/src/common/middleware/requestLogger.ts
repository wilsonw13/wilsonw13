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

// Internal modules
import { env } from "@/common/utils/envConfig";

// 1. Define the transport targets in an array
const transportTargets: pino.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: { colorize: true },
    level: env.LOG_LEVEL,
  },
];

// 2. Conditionally add the file transport if enabled
if (env.FILE_LOGGING_ENABLED) {
  const logsDir = path.resolve(process.cwd(), env.LOG_DIR);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const logFile = path.join(logsDir, dayjs().format("YY-MM-DDTHH-mm-ss") + ".log");

  transportTargets.push({
    target: "pino/file",
    options: { destination: logFile },
    level: env.LOG_LEVEL,
  });
}

// 3. Create a single, unified logger instance
const logger = pino({
  level: env.LOG_LEVEL,
  transport: {
    targets: transportTargets,
  },
});

// Helper to determine log level from status code
const getLogLevel = (status: number) => {
  if (status >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
  if (status >= StatusCodes.BAD_REQUEST) return "warn";
  return "info";
};

// 4. Create a single, unified request logger middleware
const requestLogger = pinoHttp({
  logger, // Use the unified logger
  genReqId: (req, res) => {
    const existingId = req.headers["x-request-id"] as string;
    // Reuse an existing header or generate a new one
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
  // genReqId from pinoHttp already adds the header, this makes it available on req.id
  // Note: pino-http v9+ adds req.id by default, this is for compatibility
  if (!req.id) {
    const headerId = req.headers["x-request-id"];
    req.id = typeof headerId === "string" ? headerId : Array.isArray(headerId) ? headerId[0] : "";
  }
  next();
};

export { logger, requestLogger, addRequestId };
