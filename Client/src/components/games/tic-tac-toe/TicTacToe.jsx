// 🎵 Load sounds
const moveSound = new Audio("/sounds/move.mp3");
const winSound = new Audio("/sounds/win.mp3");
const tieSound = new Audio("/sounds/tie.mp3");

import { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Game logic functions
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  if (squares.every((square) => square)) {
    return { winner: "tie", line: null };
  }

  return { winner: null, line: null };
};

const getBotMove = (squares, difficulty) => {
  switch (difficulty) {
    case "easy":
      return getRandomMove(squares);
    case "medium":
      return getMediumMove(squares);
    case "hard":
      return getMinimaxMove(squares);
    default:
      return getRandomMove(squares);
  }
};

const getRandomMove = (squares) => {
  const availableMoves = squares
    .map((square, index) => (!square ? index : null))
    .filter((move) => move !== null);

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getMediumMove = (squares) => {
  const winMove = findWinningMove(squares, "O");
  if (winMove !== null) return winMove;

  const blockMove = findWinningMove(squares, "X");
  if (blockMove !== null) return blockMove;

  if (!squares[4]) return 4;

  return getRandomMove(squares);
};

const findWinningMove = (squares, player) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    const squaresCopy = [...squares];
    if (
      !squaresCopy[a] &&
      squaresCopy[b] === player &&
      squaresCopy[c] === player
    )
      return a;
    if (
      squaresCopy[a] === player &&
      !squaresCopy[b] &&
      squaresCopy[c] === player
    )
      return b;
    if (
      squaresCopy[a] === player &&
      squaresCopy[b] === player &&
      !squaresCopy[c]
    )
      return c;
  }

  return null;
};

const getMinimaxMove = (squares) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = "O";
      let score = minimax(squares, 0, false);
      squares[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const minimax = (squares, depth, isMaximizing) => {
  const result = calculateWinner(squares);

  if (result.winner === "O") return 10 - depth;
  if (result.winner === "X") return depth - 10;
  if (result.winner === "tie") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "O";
        bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "X";
        bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return bestScore;
  }
};

// Cell Component
const Cell = ({ value, onClick, isWinning, index }) => {
  return (
    <div
      className={`w-[90px] h-[90px] border border-[rgba(var(--shadow-rgb),0.1)] rounded-[calc(var(--radius)-0.125rem)] flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out relative overflow-hidden h hover:border-[rgba(var(--shadow-rgb),0.2)] hover:scale-102 active:scale-98 ${
        isWinning
          ? "bg-[var(--btn)] !border-[var(--btn)]"
          : "bg-[var(--bg-sec)] over:bg-[var(--bg-primary)]"
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {value && (
        <span
          className={`text-3xl font-bold animate-[scaleIn_0.3s_cubic-bezier(0.68,-0.55,0.265,1.55)] ${
            isWinning ? "text-white animate-pulse" : "text-[var(--btn)]"
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
};

// Board Component
const Board = ({ squares, onClick, winningLine }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-8 opacity-0 animate-[fadeInUp_0.6s_ease_0.2s_forwards]">
      {squares.map((square, i) => (
        <Cell
          key={i}
          value={square}
          onClick={() => onClick(i)}
          isWinning={winningLine?.includes(i)}
          index={i}
        />
      ))}
    </div>
  );
};

// Main Game Component
function TicTacToe() {
  const [gameMode, setGameMode] = useState("computer");
  const [difficulty, setDifficulty] = useState("medium");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const { winner, line } = calculateWinner(squares);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleModeChange = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    resetGame();
  };

  // Bot move logic
  useEffect(() => {
    if (
      !xIsNext &&
      gameMode === "computer" &&
      !winner &&
      squares.some((square) => square !== null)
    ) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(squares, difficulty);
        if (botMove !== null && botMove !== undefined) {
          handleMove(botMove);
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares, gameMode, difficulty, winner, handleMove]);

  const handleMove = (i) => {
    if (squares[i] || winner) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    // 🎵 Play move sound
    if (isSoundEnabled) moveSound.play();

    const result = calculateWinner(newSquares);
    if (result.winner && result.winner !== "tie") {
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));

      // 🎵 Play win sound
      if (isSoundEnabled) winSound.play();
    } else if (result.winner === "tie") {
      // 🎵 Play tie sound
      if (isSoundEnabled) tieSound.play();
    }
  };

  const renderStatus = () => {
    if (winner === "tie") return "It's a tie!";
    if (winner) return `${winner} wins!`;
    if (gameMode === "computer") {
      return xIsNext ? "Your turn" : "Computer's turn";
    }
    return `${xIsNext ? "X" : "O"}'s turn`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--txt)] font-sans flex flex-col">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>

      {/* Navbar */}
      <nav className="px-8 pt-4">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.history.back()}
              variant="secondary"
              className="flex items-center gap-2 px-4 py-1 text-[var(--txt-dim)] bg-sec rounded-lg text-sm font-medium hover:bg-ter"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-2xl font-semibold txt">Tic Tac Toe</h1>
          </div>

          <div className="flex items-center gap-8">
            {/* Game Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[var(--bg-sec)] rounded-[var(--radius)] p-0.5 border border-[rgba(var(--shadow-rgb),0.1)]">
                <Button
                  onClick={() => handleModeChange("computer")}
                  variant={gameMode === "computer" ? "default" : "transparent"}
                  className={`px-4 py-2 rounded-[calc(var(--radius)-0.125rem)] border-none text-sm font-medium ${
                    gameMode === "computer"
                      ? ""
                      : "text-[var(--txt-dim)] hover:text-[var(--txt)] hover:bg-[rgba(var(--shadow-rgb),0.05)]"
                  }`}
                >
                  Computer
                </Button>
                <Button
                  onClick={() => handleModeChange("human")}
                  variant={gameMode === "human" ? "default" : "transparent"}
                  className={`px-4 py-2 rounded-[calc(var(--radius)-0.125rem)] text-sm font-medium ${
                    gameMode === "human"
                      ? ""
                      : "text-[var(--txt-dim)] hover:text-[var(--txt)] hover:bg-[rgba(var(--shadow-rgb),0.05)]"
                  }`}
                >
                  Human
                </Button>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div
              className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
                gameMode === "computer"
                  ? "opacity-100 max-w-xs"
                  : "opacity-0 max-w-0 m-0 p-0"
              }`}
            >
              <span className="text-[var(--txt-dim)] text-sm font-medium text-nowrap">
                Difficulty :
              </span>
              <div className="flex bg-[var(--bg-sec)] rounded-[var(--radius)] p-0.5 border border-[rgba(var(--shadow-rgb),0.1)]">
                {["easy", "medium", "hard"].map((diff) => (
                  <Button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    variant={difficulty === diff ? "default" : "transparent"}
                    className={`px-4 py-2 rounded-[calc(var(--radius)-0.125rem)] border-none text-sm font-medium capitalize ${
                      difficulty === diff
                        ? ""
                        : "text-[var(--txt-dim)] hover:text-[var(--txt)] hover:bg-[rgba(var(--shadow-rgb),0.05)]"
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {/* Sound Toggle */}
          <Button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            variant="transparent"
            size="icon"
            className="p-2 rounded-[var(--radius)] border border-[var(--bg-ter)] text-[var(--txt-dim)] hover:text-[var(--txt)] hover:bg-[var(--bg-ter)] hover:border-[rgba(var(--shadow-rgb),0.2)] ml-28"
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
        </div>
      </nav>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto px-8 py-12 flex flex-col items-center flex-1">
        <div className="flex gap-10 items-center my-auto pb-20">
          {/* left secton */}
          <div className="flex-col flex items-center">
            {/* Game Status */}
            <div className="text-xl font-semibold text-[var(--txt)] mb-4 text-center opacity-0 animate-[fadeInDown_0.6s_ease_forwards]">
              {renderStatus()}
            </div>
            <Board squares={squares} onClick={handleMove} winningLine={line} />
            {/* Game Controls */}
            <div className="flex gap-4 opacity-0 animate-[fadeInUp_0.6s_ease_0.3s_forwards]">
              <Button
                onClick={resetGame}
                variant="default"
                className="flex items-center gap-2 px-6 py-3 rounded-[var(--radius)] font-medium text-sm hover:-translate-y-0.5"
              >
                <RotateCcw size={16} />
                New Game
              </Button>

              <Button
                onClick={() => {
                  resetGame();
                  setScores({ X: 0, O: 0 });
                }}
                variant="secondary"
                className="px-6 py-3 border border-[rgba(var(--shadow-rgb),0.1)] rounded-[var(--radius)] font-medium text-sm hover:bg-[var(--bg-ter)] hover:border-[rgba(var(--shadow-rgb),0.2)] hover:-translate-y-0.5"
              >
                Reset Scores
              </Button>
            </div>
          </div>
          {/* Score Board */}
          <div className="opacity-0 animate-[fadeInUp_0.6s_ease_0.1s_forwards] space-y-4">
            <div className="transition-transform duration-200">
              <div className="text-[var(--txt-disabled)] text-sm font-medium mb-1">
                {gameMode === "computer" ? "You" : "Player X"}
              </div>
              <div className="text-4xl font-extralight txt">{scores.X}</div>
            </div>
            <div className="transition-transform duration-200">
              <div className="text-[var(--txt-disabled)] text-sm font-medium mb-1">
                {gameMode === "computer" ? "Computer" : "Player O"}
              </div>
              <div className="text-4xl font-extralight txt">{scores.O}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicTacToe;
