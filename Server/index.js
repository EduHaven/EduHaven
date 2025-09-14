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

// ---- Middlewares ----
app.use(compression());

if (NODE_ENV === "development") {
    app.use(morgan("dev"));
}

applySecurity(app);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// CORS 
app.use(
    cors({
        origin: CORS_ORIGIN,
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

app.use(notFound);
app.use(errorHandler);

// ---- HTTP + Socket ----
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingTimeout: 60000,
});

// -------------------- Graceful Shutdown --------------------
import readline from "readline";

let shuttingDown = false;

function waitForKeypress(promptText = "Press Y to confirm, N to cancel: ") {
    return new Promise((resolve) => {
        if (!process.stdin.isTTY) return resolve("y");
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

const doGracefulShutdown = async(signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    if (server && server.listening) {
        server.close(async(err) => {
            if (err) {
                console.error("❌ Error while closing server:", err);
                await shutdownDB();
                process.exit(1);
            }
            await shutdownDB();
            console.log("✅ Graceful shutdown complete.");
            process.exit(0);
        });
    } else {
        await shutdownDB();
        console.log("✅ Graceful shutdown complete.");
        process.exit(0);
    }

    setTimeout(() => {
        console.error("⚠️ Forcing shutdown (timeout).");
        process.exit(1);
    }, 10000).unref();
};

let sigintPromptActive = false;
process.on("SIGINT", async() => {
    if (shuttingDown || sigintPromptActive) return;
    sigintPromptActive = true;
    try {
        const answer = await waitForKeypress(
            "\nAre you sure you want to exit? (Y/N): "
        );
        sigintPromptActive = false;
        if (answer === "y" || answer === "yes") {
            await doGracefulShutdown("SIGINT");
        } else {
            console.log("Shutdown cancelled. Continuing to run.");
        }
    } catch (err) {
        sigintPromptActive = false;
        console.error("Error reading confirmation input:", err);
        await doGracefulShutdown("SIGINT");
    }
});

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