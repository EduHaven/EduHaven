import { Server } from "socket.io";
import { CORS_ORIGIN } from "../index.js";
import { initializeSocket } from "../Socket/socket.js";

export function createSocket(server) {
  return new Server(server, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });
}

export function initSocketHandlers(io) {
  initializeSocket(io);
}
