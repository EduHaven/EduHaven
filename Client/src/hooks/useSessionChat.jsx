import { useState, useEffect, useCallback } from "react";

const useSessionChat = (socket, roomId) => {
  const [messages, setMessages] = useState([]);

  const [typingUsers, setTypingUsers] = useState([]);

  // these are emitters -----------------------------------------------

  const sendMessage = useCallback(
    (message) => {
      if (socket && roomId && message.trim()) {
        socket.emit("send_message", {
          roomId,
          message: message.trim(),
        });
      }
    },
    [socket, roomId]
  );

  const getMessages = useCallback(() => {
    if (socket && roomId) {
      socket.emit("get_messages", { roomId });
    }
  }, [socket, roomId]);

  const startTyping = useCallback(() => {
    if (socket && roomId) {
      socket.emit("typing_start", { roomId });
    }
  }, [socket, roomId]);

  const stopTyping = useCallback(() => {
    if (socket && roomId) {
      socket.emit("typing_stop", { roomId });
    }
  }, [socket, roomId]);

  // these are listeners ----------------------------------------------
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (messageData) => {
      console.log(messageData)
      setMessages((prev) => [...prev, messageData]);
    });

    socket.on("messages_history", (data) => {
      setMessages(data.messages);
    });

    socket.on("user_typing", (data) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(data.username) ? prev : [...prev, data.username];
        } else {
          return prev.filter((user) => user !== data.username);
        }
      });
    });

    // socket.on("room_deleted", () => {
    //   setIsInRoom(false);
    //   setMessages([]);
    //   setParticipants([]);
    //   // You might want to redirect user or show a notification
    // });

    getMessages();

    return () => {
      socket.off("new_message");
      socket.off("messages_history");
      socket.off("user_typing");
    };
  }, [socket, getMessages]);

  return {
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  };
};

export default useSessionChat;
