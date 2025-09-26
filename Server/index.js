import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import readline from "readline";

import { ConnectDB } from "./Database/Db.js";

import authRoutes from "./Routes/AuthRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import StudySessionRoutes from "./Routes/StudySessionRoutes.js";
import SessionRoomRoutes from "./Routes/SessionRoomRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";

import { applySecurity } from "./security/securityMiddleware.js";
import { initializeSocket } from "./Socket/socket.js";

import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";
import {
  doGracefulShutdown,
  setupGracefulShutdown,
} from "./Config/shutdownConfig.js";

dotenv.config();

const app = express();
export const PORT = Number(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// ---- Middlewares ----
app.use(compression());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

applySecurity(app);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// CORS (centralized)
const corsConfig = {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsConfig));
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

// Error handling
app.use(notFound);
app.use(errorHandler);

// ---- HTTP + Socket ----
const server = createServer(app);
const io = new initializeSocket(server, { cors: corsConfig });
setupGracefulShutdown(server);

// -------------------- Start Server --------------------
async function start() {
  try {
    console.log("🚀 Starting server...");
    await ConnectDB();
    initializeSocket(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    doGracefulShutdown("startupFailure");
  }
}

start();

export { app, server, io };
