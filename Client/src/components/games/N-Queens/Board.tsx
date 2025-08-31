import React from "react";

interface BoardProps {
  board: number[][];
  placeQueen: (r: number, c: number) => void;
  status: string;
  invalidCells: Set<string>;
}

const cellSize = 72;

const Board: React.FC<BoardProps> = ({
  board,
  placeQueen,
  status,
  invalidCells,
}) => {
  const size = board.length;

  return (
    <div
      className="rounded-lg border shadow-lg mx-auto"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        gap: "6px",
        background: "#a3b18a",
        padding: "8px",
      }}
      role="grid"
      aria-label="N Queens chessboard"
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isInvalid = invalidCells.has(`${r}-${c}`);
          const lightSquare = (r + c) % 2 === 0;

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => placeQueen(r, c)}
              disabled={status !== "playing" && cell === 0}
              className={`flex items-center justify-center border rounded font-bold select-none transition-colors duration-300 
                ${
                  lightSquare ? "bg-gray-100" : "bg-gray-300"
                } ${cell === 1 ? (isInvalid ? "text-red-600" : "text-purple-700") : "text-transparent"}
                focus:outline-none focus:ring-2 focus:ring-purple-400`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                cursor: status === "playing" ? "pointer" : "default",
              }}
              aria-pressed={cell === 1}
              aria-label={cell === 1 ? "Queen placed" : "Empty square"}
              role="gridcell"
            >
              {cell === 1 ? "♛" : ""}
            </button>
          );
        })
      )}
    </div>
  );
};

export default Board;
