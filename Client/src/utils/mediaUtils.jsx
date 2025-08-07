/**
 * mediaUtils.js
 * 
 * Utility functions for creating dummy media tracks when actual media is not available.
 * Provides functions to create silent audio tracks and black video tracks for WebRTC connections.
 * Used as fallback when user has disabled their camera/microphone or when media access fails.
 * 
 * - silence(): Creates a muted audio track
 * - black(): Creates a black video track
 * - createBlackSilence(): Creates a MediaStream with both black video and silent audio
 */

export const silence = () => {
  let ctx = new AudioContext();
  let oscillator = ctx.createOscillator();
  let dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  ctx.resume();
  return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
};

export const black = ({ width = 640, height = 480 } = {}) => {
  let canvas = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);
  let stream = canvas.captureStream();
  return Object.assign(stream.getVideoTracks()[0], { enabled: false });
};

export const createBlackSilence = (...args) => {
  return new MediaStream([black(...args), silence()]);
};