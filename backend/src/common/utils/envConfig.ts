import dotenv from "dotenv";
import fs from "fs";
import { z } from "zod";
import { LOG_LEVEL_VALUES, NODE_ENV_VALUES } from "@/types/global.types";

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const envSchema = z.object({
	NODE_ENV: z.enum(NODE_ENV_VALUES).default("development"),

	HOST: z.string().min(1),
	PORT: z.coerce.number().int().positive(),
	BASE_PATH: z.string(),
	FRONTEND_DIR: isProd ? z.string() : z.string().optional(),

	LOG_LEVEL: z.enum(LOG_LEVEL_VALUES).default("info"),
	LOG_DIR: z.string().default("logs"),
	FILE_LOGGING_ENABLED: z.coerce.boolean().default(true),

	CORS_ORIGIN: z.string(),

	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),
	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
});

dotenv.config({ path: ".env", debug: isDev });
dotenv.config({ path: ".env.local", override: true, debug: isDev });

if (isProd) {
	if (!fs.existsSync(".env.production")) {
		console.warn("(production) .env.production file not found");
	}
	dotenv.config({ path: ".env.production", override: true, debug: false });
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", parsedEnv.error.format());
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDev,
	isProd,
	isTest,
};
