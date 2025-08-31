import React, { useState, useEffect, useCallback } from "react";
import useSound from "use-sound";
import Board from "./Board";
import Controls from "./Controls";
import ScoreBar from "./ScoreBar";
import ManualModal from "./ManualModal";
import {
  isValidBoard,
  getInitialBoard,
  getMaxQueens,
  getInvalidPositions,
} from "./utils";

const LEVELS = [4, 5, 6, 7, 8];

// Utility to count number of queens placed on board
function countQueens(board: number[][]): number {
  return board.flat().filter((cell) => cell === 1).length;
}

const NQueensGame: React.FC = () => {
  const [level, setLevel] = useState(LEVELS[0]);
  const [board, setBoard] = useState<number[][]>(getInitialBoard(level));
  const [gameStatus, setGameStatus] = useState<"playing" | "win" | "lose">(
    "playing"
  );
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [manualOpen, setManualOpen] = useState(false);

  // Sounds
  const [playPlace] = useSound("/sounds/place.mp3");
  const [playWin] = useSound("/sounds/win.mp3");
  const [playLose] = useSound("/sounds/lose.mp3");
  const [playInvalid] = useSound("/sounds/invalid.mp3");

  // Sync queensPlaced from board every render
  const queensPlaced = countQueens(board);

  useEffect(() => {
    setBoard(getInitialBoard(level));
    setInvalidCells(new Set());
    setGameStatus("playing");
    setScore(0);
    setTries(0);
    // no need for queensPlaced state
  }, [level]);

  const toggleQueen = useCallback(
    (row: number, col: number) => {
      if (gameStatus === "win") return;

      const newBoard = board.map((r) => [...r]);
      if (newBoard[row][col] === 1) {
        // Remove queen
        newBoard[row][col] = 0;
        setBoard(newBoard);
        setInvalidCells(new Set());
        setGameStatus("playing");
        setScore((s) => Math.max(0, s - 10));
        return;
      }

      if (gameStatus !== "playing") return;

      // Add queen
      newBoard[row][col] = 1;
      if (!isValidBoard(newBoard)) {
        playInvalid();
        playLose();
        setBoard(newBoard);
        setInvalidCells(getInvalidPositions(newBoard));
        setGameStatus("lose");
        return;
      }

      playPlace();
      setBoard(newBoard);
      setInvalidCells(new Set());
      setScore((s) => s + 10);

      // Count queens after placement
      const placed = countQueens(newBoard);
      if (placed === getMaxQueens(level)) {
        playWin();
        setGameStatus("win");
        setScore((s) => s + 50);
      }
    },
    [board, gameStatus, level, playInvalid, playLose, playPlace, playWin]
  );

  const resetGame = () => {
    setBoard(getInitialBoard(level));
    setScore(0);
    setGameStatus("playing");
    setInvalidCells(new Set());
    setTries((t) => t + 1);
  };

  const nextLevel = () => {
    const currentIndex = LEVELS.indexOf(level);
    if (currentIndex < LEVELS.length - 1) {
      setLevel(LEVELS[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 select-none">
      <ScoreBar
        score={score}
        level={level}
        status={gameStatus}
        tries={tries}
        queensPlaced={queensPlaced}
        maxQueens={getMaxQueens(level)}
      />

      <Board
        board={board}
        placeQueen={toggleQueen}
        status={gameStatus}
        invalidCells={invalidCells}
      />

      <Controls
        status={gameStatus}
        resetGame={resetGame}
        nextLevel={nextLevel}
        manualOpen={manualOpen}
        setManualOpen={setManualOpen}
        isMaxLevel={level === LEVELS[LEVELS.length - 1]}
      />

      {manualOpen && <ManualModal close={() => setManualOpen(false)} />}
    </div>
  );
};

export default NQueensGame;
