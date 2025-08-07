import { useCallback, useEffect, useState } from "react";

const useSessionRoom = (socket, roomId) => {
  const [participants, setParticipants] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState([]);

  const joinRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit("join_room", { roomId });
    }
  }, [socket, roomId]);

  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit("leave_room", { roomId });
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("room_joined", (data) => {
      setRoomInfo(data);
      setIsInRoom(true);
      if (Array.isArray(data.participants)) {
        setParticipants(data.participants);
      }
    });

    socket.on("room_left", () => {
      setIsInRoom(false);
      setMessages([]);
      setParticipants([]);
    });

    socket.on("user_joined_room", (data) => {
      setParticipants((prev) => {
        const alreadyExists = prev.some((p) => p.userId === data.userId);
        if (alreadyExists) return prev;
        const updated = [...prev, { userId: data.userId, name: data.name }];
        return updated;
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `system_${Date.now()}`,
          messageType: "system",
          message: `${data.name} joined the room`,
          timestamp: new Date(),
        },
      ]);
    });

    socket.on("user_left_room", (data) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));

      setMessages((prev) => [
        ...prev,
        {
          id: `system_${Date.now()}`,
          messageType: "system",
          message: `${data.name} left the room`,
          timestamp: new Date(),
        },
      ]);
    });

    joinRoom();

    return () => {
      socket.off("room_joined");
      socket.off("room_left");
      socket.off("user_joined_room");
      socket.off("user_left_room");
    };
  }, [socket, joinRoom]);

  return {
    participants,
    roomInfo,
    isInRoom,
    joinRoom,
    leaveRoom,
    messages,
  };
};

export default useSessionRoom;
