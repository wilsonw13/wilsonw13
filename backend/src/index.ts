import { logger } from "@/common/middleware/requestLogger";
import { server } from "@/server";

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info(`Received signal: ${signal}, shutting down...`);

    server.close(() => {
      logger.info("Server has been closed gracefully.");
      process.exit(0);
    });

    // Force shutdown after a timeout
    setTimeout(() => {
      logger.warn("Forcing shutdown after 10s timeout.");
      process.exit(1);
    }, 10000).unref();
  });
}

for (const signal of signals) {
  gracefulShutdown(signal);
}
