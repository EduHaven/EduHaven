// Server/index.js (improved)
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fetch, { Headers, Request, Response } from "node-fetch";
import compression from "compression";
import morgan from "morgan";

import { ConnectDB } from "./Database/Db.js";

import authRoutes from "./Routes/AuthRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import StudySessionRoutes from "./Routes/StudySessionRoutes.js";
import SessionRoomRoutes from "./Routes/SessionRoomRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";

// Security Middleware
import { applySecurity } from "./security/securityMiddleware.js";

import { initializeSocket } from "./Socket/socket.js";
import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";

dotenv.config();

// Polyfill fetch for Node (if needed)
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// ---- Middlewares (safe defaults) ----
app.use(compression()); // optional, small perf boost

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply project-specific security middleware (keep this)
applySecurity(app);

// body parsing with limits to avoid huge payloads
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// CORS: prefer explicit origin check rather than open wildcard
app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools (no origin)
      if (!origin) return cb(null, true);
      if (origin === CORS_ORIGIN) return cb(null, true);
      cb(new Error("CORS blocked by server"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());

// ---- Health + basic routes ----
app.get("/uptime", (req, res) =>
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  })
);

app.get("/", (req, res) => res.send(`Hello, World! (${NODE_ENV})`));

// ---- API routes ----
app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/study-sessions", StudySessionRoutes);
app.use("/session-room", SessionRoomRoutes);
app.use("/friends", FriendsRoutes);
app.use("/user", UserRoutes);

// 404 + error middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server (but do not listen yet)
const server = createServer(app);

// Create socket.io instance; we will initialize handlers after DB connect
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
});

// -------------------- Interactive graceful shutdown --------------------
import readline from "readline";

let shuttingDown = false;

// helper to read a single key from stdin (works cross-platform)
function waitForKeypress(promptText = "Press Y to confirm, N to cancel: ") {
  return new Promise((resolve) => {
    // ensure stdin is flowing
    if (!process.stdin.isTTY) {
      // non-interactive shell - resolve as yes to not hang
      return resolve("y");
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer ? answer.trim().toLowerCase() : "");
    });
  });
}

async function shutdownDB() {
  try {
    if (typeof globalThis.dbClose === "function") {
      await globalThis.dbClose();
    }
  } catch (err) {
    console.warn("⚠️ Error while closing DB:", err);
  }
}

const doGracefulShutdown = async (signal) => {
  // prevent re-entry
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  // If server is listening, close it first then clean up DB
  if (server && server.listening) {
    server.close(async (err) => {
      if (err) {
        console.error("❌ Error while closing server:", err);
        await shutdownDB(); // attempt DB cleanup even on error
        process.exit(1);
      }
      // server closed successfully -> cleanup DB then exit
      await shutdownDB();
      console.log("✅ Graceful shutdown complete.");
      process.exit(0);
    });
  } else {
    // server not listening (never started) -> just cleanup DB and exit
    await shutdownDB();
    console.log("✅ Graceful shutdown complete.");
    process.exit(0);
  }

  // Force exit after 10s if something hangs
  setTimeout(() => {
    console.error("⚠️ Forcing shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
};

// interactive SIGINT handler: ask for confirmation before shutdown
let sigintPromptActive = false;
process.on("SIGINT", async () => {
  // If shutdown is already in progress, ignore additional SIGINTs
  if (shuttingDown) return;

  // If a prompt is already active, ignore duplicate SIGINTs
  if (sigintPromptActive) return;
  sigintPromptActive = true;

  try {
    // Ask user to confirm exit. Customize the message if you want.
    const answer = await waitForKeypress(
      "\nAre you sure you want to exit? (Y/N): "
    );

    sigintPromptActive = false;

    if (answer === "y" || answer === "yes") {
      // proceed with graceful shutdown (logs and exit will follow)
      await doGracefulShutdown("SIGINT");
    } else {
      console.log("Shutdown cancelled. Continuing to run.");
      // allow further SIGINTs to prompt again
      sigintPromptActive = false;
    }
  } catch (err) {
    sigintPromptActive = false;
    console.error("Error reading confirmation input:", err);
    // fallback: do immediate graceful shutdown to avoid hanging
    await doGracefulShutdown("SIGINT");
  }
});

// immediate shutdown for SIGTERM and fatal errors (no confirmation)
process.on("SIGTERM", () => {
  if (!shuttingDown) doGracefulShutdown("SIGTERM");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  if (!shuttingDown) doGracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  if (!shuttingDown) doGracefulShutdown("unhandledRejection");
});
// ---------------------------------------------------------------------

// Start: ensure DB connected first, then start server and initialize sockets
async function start() {
  try {
    console.log("🚀 Starting server...");
    await ConnectDB(); // ensure ConnectDB throws on failure

    // Initialize your socket handlers after DB ready
    initializeSocket(io);

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
