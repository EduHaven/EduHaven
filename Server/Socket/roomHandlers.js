import { roomRateLimit } from "./rateLimiter.js";

const handleRoomOperations = (socket, io, onlineUsers) => {
  // Join an existing room
  socket.on("join_room", async (data) => {
    try {
      // Apply rate limiting
      const allowed = await roomRateLimit(socket, data);
      if (!allowed) return;

      const { roomId } = data;

      // TODO: Validate room exists in database

      socket.join(roomId);
      const socketsInRoom = await io.in(roomId).fetchSockets();
      const existingParticipants = socketsInRoom.map((s) => ({
        userId: s.userId,
        name: s.name,
        profileImage: s.profileImage,
      }));

      // Notify others in room
      socket.to(roomId).emit("user_joined_room", {
        userId: socket.userId,
        name: socket.name,
        profileImage: socket.profileImage,
        joinedAt: new Date(),
      });

      // TODO: Fetch from database

      // Get room info and send to user
      const roomInfo = {
        roomId,
        joinedAt: new Date(),
        participants: existingParticipants,
      };

      socket.emit("room_joined", roomInfo);

      // Update participant count for all users
      io.emit("room_participant_update", {
        roomId,
        participantCount: socketsInRoom.length,
      });

      console.log(`${socket.name} joined room: ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Leave room
  socket.on("leave_room", async (data) => {
    try {
      // Apply rate limiting
      const allowed = await roomRateLimit(socket, data);
      if (!allowed) return;

      const { roomId } = data;

      socket.leave(roomId);

      // Notify others in room
      socket.to(roomId).emit("user_left_room", {
        userId: socket.userId,
        name: socket.name,
        leftAt: new Date(),
      });

      socket.emit("room_left", { roomId });

      // Update participant count
      const socketsInRoom = await io.in(roomId).fetchSockets();
      io.emit("room_participant_update", {
        roomId,
        participantCount: socketsInRoom.length,
      });

      console.log(`${socket.name} left room: ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  // Get room participants
  socket.on("get_room_participants", async (data) => {
    try {
      const { roomId } = data;
      const socketsInRoom = await io.in(roomId).fetchSockets();

      const participants = socketsInRoom.map((s) => ({
        userId: s.userId,
        name: s.name,
      }));

      socket.emit("room_participants", { roomId, participants });
    } catch (error) {
      console.error("Error getting room participants:", error);
      socket.emit("error", { message: "Failed to get room participants" });
    }
  });
};

export { handleRoomOperations };
