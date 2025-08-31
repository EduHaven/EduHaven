import React from "react";

interface ScoreBarProps {
  score: number;
  level: number;
  status: string;
  tries: number;
  queensPlaced: number;
  maxQueens: number;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  level,
  status,
  tries,
  queensPlaced,
  maxQueens,
}) => (
  <div className="flex flex-wrap gap-5 items-center text-lg select-none justify-center">
    <span>
      Level: <b>{level} × {level}</b>
    </span>
    <span>
      Queens: <b>{queensPlaced} / {maxQueens}</b>
    </span>
    <span>
      Score: <b>{score}</b>
    </span>
    <span>
      Status:{" "}
      <b
        className={
          status === "win"
            ? "text-green-600"
            : status === "lose"
            ? "text-red-600"
            : "text-blue-600"
        }
      >
        {status.toUpperCase()}
      </b>
    </span>
    {tries > 0 && (
      <span>
        Try: <b>{tries + 1}</b>
      </span>
    )}
  </div>
);

export default ScoreBar;
