import { messageRateLimit, typingRateLimit } from "./rateLimiter.js";

const handleMessageOperations = (socket, io) => {
  socket.on("send_message", async (data) => {
    try {
      // Apply rate limiting
      const allowed = await messageRateLimit(socket, data);
      if (!allowed) return;

      const { roomId, message, messageType = "text" } = data;

      if (!message || !message.trim()) {
        socket.emit("error", { message: "Message cannot be empty" });
        return;
      }

      const messageData = {
        id: `msg_${Date.now()}_${socket.userId}}`,
        roomId,
        userId: socket.userId,
        username: socket.name,
        profileImage: socket.profileImage,
        message: message.trim(),
        messageType,
        timestamp: new Date(),
        edited: false,
      };

      io.to(roomId).emit("new_message", messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("get_messages", async (data) => {
    try {
      const { roomId, limit = 50, offset = 0 } = data;

      // TODO: Fetch messages from database
      const messages = [
        {
          id: 1,
          message: "initial message download test. todo: fetch from DB.",
        },
      ];

      socket.emit("messages_history", {
        roomId,
        messages,
        hasMore: messages.length === limit, // Simple pagination check
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error", { message: "Failed to fetch messages" });
    }
  });

  socket.on("typing_start", async (data) => {
    // Apply rate limiting
    const allowed = await typingRateLimit(socket, data);
    if (!allowed) return;

    const { roomId } = data;
    socket.to(roomId).emit("user_typing", {
      userId: socket.userId,
      username: socket.username,
      isTyping: true,
    });
  });

  socket.on("typing_stop", async (data) => {
    // Apply rate limiting
    const allowed = await typingRateLimit(socket, data);
    if (!allowed) return;

    const { roomId } = data;
    socket.to(roomId).emit("user_typing", {
      userId: socket.userId,
      username: socket.username,
      isTyping: false,
    });
  });
};
export { handleMessageOperations };
