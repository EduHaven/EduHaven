/**
 * UseMediaHandlers.js
 *
 * Custom hook that manages media stream handling and user media controls.
 * Handles getUserMedia and getDisplayMedia operations, manages video/audio/screen sharing states,
 * and provides toggle functions for media controls. Coordinates with WebRTC connections
 * to update media streams across all peer connections when media settings change.
 *
 * - Manages media stream acquisition (camera, microphone, screen)
 * - Handles media stream updates and replacements
 * - Provides toggle functions for media controls
 */

import { useState, useEffect, useRef } from "react";
import { connections, createOfferForConnection } from "./WebRTCConnection.jsx";
import { createBlackSilence } from "@/utils/mediaUtils.jsx";

export const UseMediaHandlers = (
  localVideoref,
  socketIdRef,
  socket,
  setScreenAvailable
) => {
  const [videoToggle, setVideo] = useState(false);
  const [audioToggle, setAudio] = useState(false);
  const [screen, setScreen] = useState();

  const socketRef = useRef();
  useEffect(() => {
    if (!socket) return;
    socketRef.current = socket;
  }, [socket]);

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      createOfferForConnection(id, socketRef);
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          window.localStream = createBlackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);
            createOfferForConnection(id, socketRef);
          }
        })
    );
  };

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (stream) {
        window.localStream = stream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = stream;
        }
      }

      setScreenAvailable(
        typeof navigator.mediaDevices.getDisplayMedia === "function"
      );
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setScreenAvailable(
        typeof navigator.mediaDevices.getDisplayMedia === "function"
      );
    }

    if (videoToggle || audioToggle) {
      navigator.mediaDevices
        .getUserMedia({ video: videoToggle, audio: audioToggle })
        .then(getUserMediaSuccess)
        .then(() => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      createOfferForConnection(id, socketRef);
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          window.localStream = createBlackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  const getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ videoToggle: true, audio: true })
          .then(getDislayMediaSuccess)
          .then(() => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (videoToggle !== undefined && audioToggle !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", videoToggle, audioToggle);
    }
  }, [videoToggle, audioToggle, getUserMedia]);

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen, getDislayMedia]);

  const handleVideo = () => setVideo(!videoToggle);
  const handleAudio = () => setAudio(!audioToggle);
  const handleScreen = () => setScreen(!screen);

  return {
    videoToggle,
    audioToggle,
    screen,
    setVideo,
    setAudio,
    handleVideo,
    handleAudio,
    handleScreen,
    getUserMedia,
  };
};
