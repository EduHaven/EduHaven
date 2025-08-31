import React from "react";

interface ControlsProps {
  status: string;
  resetGame: () => void;
  nextLevel: () => void;
  manualOpen: boolean;
  setManualOpen: (open: boolean) => void;
  isMaxLevel: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  status,
  resetGame,
  nextLevel,
  manualOpen,
  setManualOpen,
  isMaxLevel,
}) => (
  <div className="flex gap-4">
    <button
      onClick={resetGame}
      className="btn btn-blue px-6 py-3 text-lg rounded hover:shadow-lg hover:scale-105 transition-transform duration-200"
      aria-label="Reset game"
    >
      Reset
    </button>
    <button
      onClick={() => setManualOpen(true)}
      className="btn btn-green px-6 py-3 text-lg rounded hover:shadow-lg hover:scale-105 transition-transform duration-200"
      aria-label="Show manual"
    >
      Manual
    </button>
    {status === "win" && !isMaxLevel && (
      <button
        onClick={nextLevel}
        className="btn btn-purple px-6 py-3 text-lg rounded hover:shadow-lg hover:scale-105 transition-transform duration-200"
        aria-label="Next level"
      >
        Next Level
      </button>
    )}
  </div>
);

export default Controls;
