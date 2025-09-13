import express from "express";
import { createServer } from "http";
import fetch, { Headers, Request, Response } from "node-fetch";
import { PORT } from "./Config/envConfig.js";
import { applyCommonMiddleware } from "./Config/commonMiddlewareConfig.js";
import { ConnectDB } from "./Database/Db.js";
import { mountRoutes } from "./Routes/routes.js";
import { mountHealthRoutes } from "./Routes/HealthRoutes.js";
import { applySecurity } from "./security/securityMiddleware.js";
import { createSocket, initSocketHandlers } from "./config/socketConfig.js";
import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";
import { setupGracefulShutdown } from "./Config/shutdownConfig.js";

// Polyfill fetch for Node (if needed)
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const app = express();

// Apply project-specific security middleware (keep this)
applySecurity(app);

applyCommonMiddleware(app);

mountHealthRoutes(app);

mountRoutes(app);

// 404 + error middleware
app.use(notFound);
app.use(errorHandler);

const server = createServer(app);

// Create socket.io instance; we will initialize handlers after DB connect
const io = createSocket(server);

setupGracefulShutdown(server);

async function start() {
  try {
    console.log("🚀 Starting server...");
    await ConnectDB();

    initSocketHandlers(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    // Run defensive graceful shutdown so the same cleanup path runs
    // This will attempt DB cleanup (noop if not connected) then exit.
    doGracefulShutdown("startupFailure");
  }
}

start();

// export for tests / external tooling
export { app, server, io };
