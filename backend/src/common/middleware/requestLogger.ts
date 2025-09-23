import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import pinoHttp from "pino-http";
import dayjs from "dayjs";

const logsDir = path.resolve(process.cwd(), "./logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}
const logFile = path.join(logsDir, dayjs().format('YY-MM-DDTHH-mm-ss') + '.log');

const fileLogger = pino({
	level: "info",
	transport: {
		targets: [
			{ target: "pino/file", options: { destination: logFile }, level: "info" },
		],
	},
});

const consoleLogger = pino({
	level: "info",
	transport: {
		targets: [
			{ target: "pino-pretty", options: { colorize: true }, level: "info" },
		],
	},
});

// Multi logger utility: logs to both file and console, with full pino.LogFn types
type LoggerMethods = keyof typeof fileLogger;
const _multiLogger: any = {};

(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as LoggerMethods[]).forEach(level => {
	_multiLogger[level] = (...args: any[]) => {
		((fileLogger as pino.Logger)[level] as (...args: any[]) => void)(...args);
		((consoleLogger as pino.Logger)[level] as (...args: any[]) => void)(...args);
		// add more loggers here as needed
	};
});

export const multiLogger = _multiLogger as typeof fileLogger;

const getLogLevel = (status: number) => {
	if (status >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
	if (status >= StatusCodes.BAD_REQUEST) return "warn";
	return "info";
};

export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
	const existingId = req.headers["x-request-id"] as string;
	const requestId = existingId || randomUUID();
	req.headers["x-request-id"] = requestId;
	res.setHeader("X-Request-Id", requestId);
	next();
};

// Capture response body for console logging
export const captureResponseBody = (_req: Request, res: Response, next: NextFunction) => {
	const originalSend = res.send;
	res.send = function (body) {
		res.locals.responseBody = body;
		return originalSend.call(this, body);
	};
	next();
};

export const requestFileLogger = pinoHttp({
	logger: fileLogger,
	genReqId: (req) => req.headers["x-request-id"] as string,
	customLogLevel: (_req, res) => getLogLevel(res.statusCode),
	customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
	customErrorMessage: (_req, res) => `Request failed with status code: ${res.statusCode}`,
	serializers: {
		req: (req) => ({
			method: req.method,
			url: req.url,
			id: req.id,
		}),
	},
});

export const requestConsoleLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = process.hrtime.bigint();
	const done = () => {
		res.removeListener('finish', done);
		res.removeListener('close', done);
		const end = process.hrtime.bigint();
		const responseTimeMs = Number(end - start) / 1e6;
		consoleLogger.info({
			request: {
				method: req.method,
				url: req.url,
				id: req.headers["x-request-id"] || undefined,
			},
			response: {
				statusCode: res.statusCode,
				json: res.locals.responseBody,
			},
			responseTimeMs: Math.round(responseTimeMs),
		});
	};
	res.on('finish', done);
	res.on('close', done);
	next();
};