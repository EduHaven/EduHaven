const moveSound = new Audio('/move.mp3');
const winSound = new Audio('/win.mp3');

export const playSound = (sound, enabled = true) => {
  if (!enabled) return;
  
  const audio = sound === 'move' ? moveSound : winSound;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Ignore errors from browsers blocking autoplay
  });
};