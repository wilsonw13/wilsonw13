// Third-party packages
import cors from "cors";
import express, { type Express, Router } from "express";
import helmet from "helmet";
import path from "path";

// Internal modules
import { healthRouter } from "@/router/health.router";
import { userRouter } from "@/router/user.router";
import { openAPIRouter } from "@/router/openAPI.router";
import errorHandler from "@/common/middleware/errorHandler";
import {
  logger,
  requestFileLogger,
  requestConsoleLogger,
  captureResponseBody,
  addRequestId,
} from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

const app: Express = express();

// --- Core Middleware ---
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet()); // Apply security headers
app.set("trust proxy", true); // Trust reverse proxy (Nginx)

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging Middleware ---
app.use([captureResponseBody, requestFileLogger, requestConsoleLogger, addRequestId]);

// --- API Routes ---
const apiRouter = Router();
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/", openAPIRouter);

app.use(env.BASE_PATH, apiRouter);

// --- Production Static File Serving ---
if (env.isProd) {
  const staticFilesPath = path.resolve(process.cwd(), env.FRONTEND_DIR!);
  app.use(express.static(staticFilesPath));

  // SPA Catch-All: Redirect all non-API requests to the React app
  app.get("/*splish", (_req, res) => {
    res.sendFile(path.join(staticFilesPath, "index.html"));
  });
}

// --- Final Error Handler ---
// This must be the LAST middleware registered.
app.use(errorHandler());

const server = app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
  logger.info(`(${env.NODE_ENV}) Base Path: ${env.BASE_PATH}`);
});

export { app, server };
