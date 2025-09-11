import express from "express";
import { ConnectDB } from "./Database/Db.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import UserRoutes from "./Routes/UserRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import authRoutes from "./Routes/OAuthRoute.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import { TimerSessionRoutes } from "./Routes/TimerSessionsRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import SessionRoutes from "./Routes/SessionRoutes.js";
import { checkAndResetStreaks } from "./utils/streakUpdater.js";

import { initializeSocket } from "./Socket/socket.js";

const app = express();
const port = 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello, World!"));
app.use("/", UserRoutes);
app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/", TimerSessionRoutes);
app.use("/session-room", SessionRoutes);
app.use("/friends", FriendsRoutes);
app.use("/users", UserRoutes);

initializeSocket(io);

server.listen(port, () => {
  ConnectDB();
  console.log(`Server running at http://localhost:${port}`);
  
  // Start streak checking interval - runs every hour
  setInterval(async () => {
    console.log('Running streak check...');
    await checkAndResetStreaks();
  }, 60 * 60 * 1000); // Every hour
  
  // Run streak check immediately on startup
  setTimeout(async () => {
    console.log('Initial streak check on startup...');
    await checkAndResetStreaks();
  }, 5000); // Wait 5 seconds after startup
});
