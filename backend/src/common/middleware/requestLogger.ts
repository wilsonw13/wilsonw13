// Node.js built-in modules
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";

// Third-party packages
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import pinoHttp from "pino-http";
import type { HttpLogger } from "pino-http";
import dayjs from "dayjs";

// Internal modules
import { env } from "@/common/utils/envConfig";

type LogFn = (...args: unknown[]) => void;
type MultiLogger = {
	fatal: LogFn;
	error: LogFn;
	warn: LogFn;
	info: LogFn;
	debug: LogFn;
	trace: LogFn;
};
let multiLogger: MultiLogger;
let requestFileLogger: HttpLogger<Request, Response, never>;

const consoleLogger = pino({
	level: "info",
	transport: {
		targets: [
			{ target: "pino-pretty", options: { colorize: true }, level: "info" },
		],
	},
});

if (env.FILE_LOGGING_ENABLED) {
	// Log to both file and console when file logging is enabled
	const logsDir = path.resolve(process.cwd(), env.LOG_DIR);
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
	const logFile = path.join(
		logsDir,
		dayjs().format("YY-MM-DDTHH-mm-ss") + ".log"
	);
	const fileLogger = pino({
		level: "info",
		transport: {
			targets: [
				{ target: "pino/file", options: { destination: logFile }, level: "info" },
			],
		},
	});
	multiLogger = {
		fatal: (arg) => { fileLogger.fatal(arg); consoleLogger.fatal(arg); },
		error: (arg) => { fileLogger.error(arg); consoleLogger.error(arg); },
		warn: (arg) => { fileLogger.warn(arg); consoleLogger.warn(arg); },
		info: (arg) => { fileLogger.info(arg); consoleLogger.info(arg); },
		debug: (arg) => { fileLogger.debug(arg); consoleLogger.debug(arg); },
		trace: (arg) => { fileLogger.trace(arg); consoleLogger.trace(arg); },
	};
	requestFileLogger = pinoHttp({
		logger: fileLogger,
		genReqId: (req: Request) => req.headers["x-request-id"] as string,
		customLogLevel: (_req: Request, res: Response) => getLogLevel(res.statusCode),
		customSuccessMessage: (req: Request) => `${req.method} ${req.url} completed`,
		customErrorMessage: (_req: Request, res: Response) =>
			`Request failed with status code: ${res.statusCode}`,
		serializers: {
			req: (req: Request) => ({
				method: req.method,
				url: req.url,
				id: (req as any).id,
			}),
		},
	});
} else {
	// Only log to console when file logging is disabled
	multiLogger = {
		fatal: (arg) => consoleLogger.fatal(arg),
		error: (arg) => consoleLogger.error(arg),
		warn: (arg) => consoleLogger.warn(arg),
		info: (arg) => consoleLogger.info(arg),
		debug: (arg) => consoleLogger.debug(arg),
		trace: (arg) => consoleLogger.trace(arg),
	};
	requestFileLogger = pinoHttp({
		logger: consoleLogger,
		genReqId: (req: Request) => req.headers["x-request-id"] as string,
		customLogLevel: (_req: Request, res: Response) => getLogLevel(res.statusCode),
		customSuccessMessage: (req: Request) => `${req.method} ${req.url} completed`,
		customErrorMessage: (_req: Request, res: Response) =>
			`Request failed with status code: ${res.statusCode}`,
		serializers: {
			req: (req: Request) => ({
				method: req.method,
				url: req.url,
				id: (req as any).id,
			}),
		},
	});
}

const getLogLevel = (status: number) => {
	if (status >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
	if (status >= StatusCodes.BAD_REQUEST) return "warn";
	return "info";
};

const addRequestId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const existingId = req.headers["x-request-id"] as string;
	const requestId = existingId || randomUUID();
	req.headers["x-request-id"] = requestId;
	res.setHeader("X-Request-Id", requestId);
	next();
};

// Capture response body for console logging
const captureResponseBody = (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	const originalSend = res.send;
	res.send = function (body) {
		res.locals.responseBody = body;
		return originalSend.call(this, body);
	};
	next();
};

const requestConsoleLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = process.hrtime.bigint();
	const done = () => {
		res.removeListener("finish", done);
		res.removeListener("close", done);
		const end = process.hrtime.bigint();
		const responseTimeMs = Number(end - start) / 1e6;
		consoleLogger.info({
			request: {
				method: req.method,
				url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
				id: req.headers["x-request-id"] || undefined,
			},
			response: {
				statusCode: res.statusCode,
				json: res.locals.responseBody,
			},
			responseTimeMs: Math.round(responseTimeMs),
		});
	};
	res.on("finish", done);
	res.on("close", done);
	next();
};

// Exports
export {
	// Loggers
	multiLogger,
	requestFileLogger,
	requestConsoleLogger,

	// Middleware
	addRequestId,
	captureResponseBody,
};