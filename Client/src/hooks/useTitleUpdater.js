import { useEffect } from "react";

export const useTitleUpdater = ({ timeLeft, isPaused, isBreakMode }) => {
  useEffect(() => {
    if (timeLeft === 0 && isPaused) {
      document.title = "EduHaven - Premium Study Platform";
      return;
    }
    const mode = isBreakMode ? "🟣 Break" : "🧘‍♂️ Focus";
    const status = isPaused ? "(Paused)" : "";

    document.title = `${formatTime(timeLeft)} ${mode} ${status}`;

    return () => {
      document.title = "EduHaven - Premium Study Platform";
    };
  }, [timeLeft, isPaused, isBreakMode]);
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
