/**
 * webRTCConnection.js
 *
 * Manages WebRTC peer-to-peer connections for video calling functionality.
 * Handles the creation and management of RTCPeerConnection objects, signaling between peers,
 * and coordination of media streams. Contains the core WebRTC logic for establishing
 * and maintaining video call connections between multiple participants.
 *
 * - Manages peer connections and ICE candidates
 * - Handles SDP offer/answer exchange
 * - Coordinates media stream sharing between peers
 */

import { createBlackSilence } from "@/utils/mediaUtils";


export const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const connections = {};

export const gotMessageFromServer = (
  fromId,
  message,
  socketIdRef,
  socketRef
) => {
  var signal = JSON.parse(message);
  console.log("signal recived from signal", signal);

  if (fromId !== socketIdRef.current) {
    if (signal.sdp) {
      connections[fromId]
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          if (signal.sdp.type === "offer") {
            connections[fromId]
              .createAnswer()
              .then((description) => {
                connections[fromId]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      fromId,
                      JSON.stringify({
                        sdp: connections[fromId].localDescription,
                      })
                    );
                  })
                  .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));
          }
        })
        .catch((e) => console.log(e));
    }

    if (signal.ice) {
      connections[fromId]
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch((e) => console.log(e));
    }
  }
};

export const createPeerConnection = (
  socketListId,
  socketRef,
  videoRef,
  setVideos
) => {
  if (connections[socketListId]) {
    console.warn(`PeerConnection for ${socketListId} already exists.`);
    return;
  }

  connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

  // Wait for their ice candidate
  connections[socketListId].onicecandidate = function (event) {
    if (event.candidate != null) {
      socketRef.current.emit(
        "signal",
        socketListId,
        JSON.stringify({ ice: event.candidate })
      );
    }
  };

  // Wait for their video stream
  connections[socketListId].onaddstream = (event) => {
    console.log("BEFORE:", videoRef.current);
    console.log("FINDING ID: ", socketListId);

    let videoExists = videoRef.current.find(
      (video) => video.socketId === socketListId
    );

    if (videoExists) {
      console.log("VIDEO FOUND EXISTING");

      // Update the stream of the existing video
      setVideos((videos) => {
        const updatedVideos = videos.map((video) =>
          video.socketId === socketListId
            ? { ...video, stream: event.stream }
            : video
        );
        videoRef.current = updatedVideos;
        return updatedVideos;
      });
    } else {
      // Create a new video
      console.log("CREATING NEW");
      let newVideo = {
        socketId: socketListId,
        stream: event.stream,
        autoplay: true,
        playsinline: true,
      };

      setVideos((videos) => {
        const updatedVideos = [...videos, newVideo];
        videoRef.current = updatedVideos;
        return updatedVideos;
      });
    }
  };

  // Add the local video stream
  if (window.localStream !== undefined && window.localStream !== null) {
    connections[socketListId].addStream(window.localStream);
  } else {
    window.localStream = createBlackSilence();
    connections[socketListId].addStream(window.localStream);
  }
};

export const createOfferForConnection = (connectionId, socketRef) => {
  connections[connectionId].createOffer().then((description) => {
    connections[connectionId]
      .setLocalDescription(description)
      .then(() => {
        socketRef.current.emit(
          "signal",
          connectionId,
          JSON.stringify({ sdp: connections[connectionId].localDescription })
        );
      })
      .catch((e) => console.log(e));
  });
};
