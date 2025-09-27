import { env } from "@/common/utils/envConfig";
import { app } from "@/server";
import { multiLogger } from "@/common/middleware/requestLogger";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT, BASE_PATH } = env;
  if (NODE_ENV === "production") {
    multiLogger.info(`(production) Ensure you have nginx reverse proxying configured.`);
    multiLogger.info(`(production) Server listening on ${HOST}`);
  } else {
    multiLogger.info(`(${NODE_ENV}) Server listening on ${HOST}:${PORT}`);
  }
  multiLogger.info(`(${NODE_ENV}) Base Path: ${BASE_PATH}`);
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
