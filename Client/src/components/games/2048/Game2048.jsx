import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import styles from "./Game2048.module.css";
import { Button } from "@/components/ui/button";

const Game2048 = () => {
  const [board, setBoard] = useState(getInitialBoard());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("hiScore-2048");
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  function getInitialBoard() {
    const board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    addNewTile(board);
    addNewTile(board);
    return board;
  }

  function addNewTile(board) {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function moveBoard(direction) {
    if (gameOver) return;
    let moved = false;
    let newScore = score;

    // Helper to move and merge a single row left
    function moveRowLeft(row) {
      let arr = row.filter((cell) => cell !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          newScore += arr[i];
          arr[i + 1] = 0;
          moved = true;
        }
      }
      arr = arr.filter((cell) => cell !== 0);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    // Correct direction mapping
    // left: 0, up: 3, right: 2, down: 1
    const directionMap = { left: 0, up: 3, right: 2, down: 1 };
    let times = directionMap[direction];
    let rotated = board;
    for (let t = 0; t < times; t++) {
      rotated = rotate(rotated);
    }
    let result = rotated.map(moveRowLeft);
    // Rotate back
    for (let t = 0; t < (4 - times) % 4; t++) {
      result = rotate(result);
    }
    let finalBoard = result;

    // Check if board changed
    if (JSON.stringify(finalBoard) !== JSON.stringify(board)) {
      moved = true;
    }

    if (moved) {
      addNewTile(finalBoard);
      setBoard(finalBoard);
      setScore(newScore);
      checkGameOver(finalBoard);
    }
  }

  // Rotate 90 degrees clockwise
  function rotate(board) {
    return board[0].map((_, i) => board.map((row) => row[i]).reverse());
  }

  function checkGameOver(board) {
    // Check if board is full
    let isFull = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          isFull = false;
          break;
        }
      }
    }

    if (!isFull) return;

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return;
        }
      }
    }

    setGameOver(true);
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("hiScore-2048", score);
    }
  }

  const handleKeyDown = useCallback(
    (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // ✅ stops page scrolling
      }
      switch (e.key) {
        case "ArrowUp":
          moveBoard("up");
          break;
        case "ArrowDown":
          moveBoard("down");
          break;
        case "ArrowLeft":
          moveBoard("left");
          break;
        case "ArrowRight":
          moveBoard("right");
          break;
        default:
          break;
      }
    },
    [moveBoard]
  );

  function resetGame() {
    setBoard(getInitialBoard());
    setScore(0);
    setGameOver(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameOver, handleKeyDown]);

  // Save high score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hiScore-2048", highScore);
  }, [highScore]);

  return (
    <div className="h-screen flex flex-col">
      <nav className="px-8 pt-4 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            className="flex items-center gap-2 px-4 py-1 text-[var(--txt-dim)] bg-sec rounded-lg text-sm font-medium hover:bg-ter"
          >
            <ArrowLeft size={24} />
          </Button>

          <h1 className="text-2xl font-semibold txt">2048</h1>
        </div>

        <div className="flex items-center gap-10">
          <div className="font-semibold text-lg">Score: {score}</div>
          <div className="font-semibold text-lg text-[var(--txt)]">
            High Score: {highScore}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={resetGame}
            variant="default"
            className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium"
          >
            New Game
          </Button>
          <Button
            onClick={() => setShowHowToPlay(true)}
            variant="secondary"
            className="px-3 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-ter hover:text-[var(--txt)]"
          >
            How to Play
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="">
          {/* Board */}
          <div className="grid grid-rows-4 gap-1 2xl:gap-2 aspect-square w-[400px] 2xl:w-[480px]">
            {board.map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-1 2xl:gap-2">
                {row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`${styles.cell} ${
                      cell ? styles["tile" + cell] : ""
                    }`}
                    style={{
                      boxShadow: cell ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                      border: cell ? "2px solid #edc22e" : "2px solid #eee4da",
                      color: cell >= 8 ? "#f9f6f2" : "#776e65",
                      fontWeight: cell >= 128 ? "bold" : "normal",
                      fontSize: cell >= 1024 ? "1.1rem" : "1.3rem",
                      background: cell ? undefined : "#faf8ef",
                      transition: "all 0.2s",
                    }}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className={styles.gameOver}>
              <div className={styles.gameOverContent}>
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>High Score: {highScore}</p>
                <Button onClick={resetGame} variant="default">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[var(--bg-primary)] rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <Button
              onClick={() => setShowHowToPlay(false)}
              variant="secondary"
              className="absolute top-2 right-2 px-2 py-1 text-[var(--txt-dim)] bg-sec rounded-lg hover:bg-ter"
            >
              Close
            </Button>
            <h2 className="text-xl font-bold mb-2">How to Play 2048</h2>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>Use your arrow keys to move the tiles.</li>
              <li>
                When two tiles with the same number touch, they merge into one.
              </li>
              <li>
                Each merge increases your score by the value of the new tile.
              </li>
              <li>Try to reach the 2048 tile!</li>
              <li>The game ends when no moves are possible.</li>
              <li>Your highest score is saved automatically.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;
