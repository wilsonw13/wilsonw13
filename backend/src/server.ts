import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import path from "path";

import { healthRouter } from "@/router/health.router";
import { userRouter } from "@/router/user.router";
import errorHandler from "@/common/middleware/errorHandler";
import { addRequestId, captureResponseBody, requestFileLogger, requestConsoleLogger } from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

const app: Express = express();
app.use(cors({ origin: '*', credentials: false })); // trust all domains for now (*)
app.set("trust proxy", true); // trust nginx reverse proxy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Request logging: minimal to console, full to file
app.use(...
  [
    requestFileLogger,
    requestConsoleLogger,
    addRequestId,
    captureResponseBody
  ]
);

// Routes
app.use(env.BASE_PATH + "/health", healthRouter);
app.use(env.BASE_PATH + "/users", userRouter);

// API catch all route
app.all(env.BASE_PATH + "/*splish", (req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Serve frontend static files in production
if (env.NODE_ENV === "production") {
  const distPath = path.resolve(process.cwd(), env.FRONTEND_DIR!);
  app.use(express.static(distPath));
  app.get('/*splash', (req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// must be put after all middlewares / routers
app.use(errorHandler());

export { app };