import dotenv from "dotenv";
import { z } from "zod";

const environments = ["development", "production", "test"] as const;

const envSchema = z.object({
	NODE_ENV: z.enum(environments),
	PORT: z.coerce.number().int().positive(),
	HOST: z.string().min(1),
	BASE_PATH: z.string(),
	CORS_ORIGIN: z.string().url(),
	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),
	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
	FRONTEND_DIR: z.string(),
});

dotenv.config();

if (process.env.NODE_ENV === "production")
	dotenv.config({ path: ".env.production", override: true });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", parsedEnv.error.format());
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === "development",
	isProduction: parsedEnv.data.NODE_ENV === "production",
	isTest: parsedEnv.data.NODE_ENV === "test",
};
