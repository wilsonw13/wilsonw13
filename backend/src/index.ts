import { env } from "@/common/utils/envConfig";
import { app } from "@/server";
import { multiLogger } from "@/common/middleware/requestLogger";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  multiLogger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  multiLogger.info("sigint received, shutting down");
  server.close(() => {
    multiLogger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
