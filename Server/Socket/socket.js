import jwt from "jsonwebtoken";
import { handleRoomOperations } from "./roomHandlers.js";
import { handleMessageOperations } from "./messageHandlers.js";
// import { handleVoiceOperations } from "./voiceHandlers.js";

const onlineUsers = new Map();
const userSockets = new Map();
let connections = {};
let timeOnline = {};

const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.name = `${decoded?.FirstName ?? "unknown user"} ${
      decoded?.LastName ?? ""
    }`.trim();

    socket.profileImage = decoded.profileImage || null;

    next();
  } catch (err) {
    console.log("Socket authentication error:", err.message);
    next(new Error("Authentication error"));
  }
};

const initializeSocket = (io) => {
  io.use(authenticateSocket);

  const broadcastOnlineList = () => {
    const users = Array.from(onlineUsers.entries()).map(
      ([userId, socketId]) => {
        const user = userSockets.get(socketId) || {};
        return {
          id: userId,
          name: user.name || "Unknown",
          profileImage: user.profileImage || null,
        };
      }
    );
    io.emit("online_users_updated", users);
  };

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.name} (${socket.userId})`);

    // Store user connection
    onlineUsers.set(socket.userId, socket.id);
    userSockets.set(socket.id, {
      userId: socket.userId,
      name: socket.name,
      profileImage: socket.profileImage,
    });

    broadcastOnlineList();

    handleRoomOperations(socket, io, onlineUsers);
    handleMessageOperations(socket, io);
    // handleVoiceOperations(socket, io);

    // webrtc handlers:----------------------------------------------
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }
    });
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.name}`);

      onlineUsers.delete(socket.userId);
      userSockets.delete(socket.id);

      broadcastOnlineList();
      // webrtc handlers:----------------------------------------------
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
      //----------------------------------------------

      // Leave all rooms and notify
      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("user_left_room", {
            userId: socket.userId,
            name: socket.name,
          });
        }
      });
    });

    // Handle manual online status (clients to set their online staus in settings);
    // socket.on("set_online_status", (status) => {
    //   if (status === "offline") {
    //     onlineUsers.delete(socket.userId);
    //   } else {
    //     onlineUsers.set(socket.userId, socket.id);
    //   }
    //   broadcastOnlineList()
    // });

    // // Handle getting online friends
    // socket.on("get_online_friends", () => {
    //   // You can integrate this with your existing friends system
    //   socket.emit("online_friends_list", Array.from(onlineUsers.keys()));
    // });
  });

  console.log("Socket.IO initialized successfully");
};

export { initializeSocket, onlineUsers, userSockets };
