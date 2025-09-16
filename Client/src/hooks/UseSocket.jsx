import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const UseSocket = (user) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const backendUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!user || !user.token) return;
    const newSocket = io(backendUrl, {
      auth: {
        token: user.token,
      },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("disconnected form server");
      setIsConnected(false);
    });

    newSocket.on("online_users_updated", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      setSocket(null);
      setIsConnected(false);
    };
  }, [user, backendUrl]);

  return {
    socket,
    isConnected,
    onlineUsers,
  };
};

export default UseSocket;
