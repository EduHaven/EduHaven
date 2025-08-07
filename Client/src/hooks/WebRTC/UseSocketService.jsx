import { useEffect } from "react";
import {
  gotMessageFromServer,
  createPeerConnection,
  connections,
  createOfferForConnection,
} from "./WebRTCConnection.jsx";

const UseConnectToSocketServer = (
  socket,
  socketIdRef,
  roomId,
  videoRef,
  setVideos
) => {
  useEffect(() => {
    if (!socket) return;

    // incoming WebRTC signals
    socket.on("signal", (fromId, message) => {
      console.log("sending signal");
      gotMessageFromServer(fromId, message, socketIdRef, { current: socket });
    });

    // when socket connects or reconnects
    socket.emit("join-call", roomId);
    console.log("trying to join the call");
    socketIdRef.current = socket.id;

    socket.on("user-left", (id) => {
      console.log("a user left the call");

      setVideos((vs) => vs.filter((v) => v.socketId !== id));
    });

    socket.on("user-joined", (newId, clientList) => {
      clientList.forEach((peerId) => {
        createPeerConnection(peerId, { current: socket }, videoRef, setVideos);
      });
      console.log("new user call join recieved", newId, clientList);
      if (newId === socketIdRef.current) {
        Object.keys(connections).forEach((peerId) => {
          if (peerId === socketIdRef.current) return;
          connections[peerId].addStream(window.localStream);
          createOfferForConnection(peerId, { current: socket });
        });
      }
    });
    return () => {
      socket.off("signal");
      // socket.off("connect");
      socket.off("user-left");
      socket.off("user-joined");
    };
  }, [socket]);
};
export default UseConnectToSocketServer;
