import express from "express";
import { ConnectDB } from "../Database/Db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import UserRoutes from "../Routes/UserRoutes.js";
import TodoRoutes from "../Routes/ToDoRoutes.js";
import EventRoutes from "../Routes/EventRoutes.js";
import authRoutes from "../Routes/OAuthRoute.js";
import NotesRoutes from "../Routes/NotesRoutes.js";
import TimerSessionRoutes from "../Routes/TimerSessionsRoutes.js";
import FriendsRoutes from "../Routes/FriendsRoutes.js";
import SessionRoutes from "../Routes/SessionRoutes.js";

import { initializeSocket } from "../Socket/socket.js";
import fetch, { Headers, Request, Response } from 'node-fetch';
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // only once
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes 
app.get("/", (req, res) => res.send("Hello, World!"));
app.use("/users", UserRoutes);          // mounted only once
app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/timer-sessions", TimerSessionRoutes);
app.use("/session-room", SessionRoutes);
app.use("/friends", FriendsRoutes);

// Socket.io
initializeSocket(io);

//  Connect DB and Start Server 
ConnectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("DB connection failed:", err));
