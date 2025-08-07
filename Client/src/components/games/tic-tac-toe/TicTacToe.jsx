import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Board from './Board';
import GameMode from './GameMode';
import DifficultySelector from './DifficultySelector';
import GameStatus from './GameStatus';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';
import { calculateWinner, getBotMove } from './utils/gameLogic';
import { playSound } from './utils/audio';

function TicTacToe() {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const { winner, line } = calculateWinner(squares);

  useEffect(() => {
    if (!xIsNext && gameMode === 'bot' && !winner) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(squares, difficulty);
        handleMove(botMove);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares, gameMode, difficulty]);

  const handleMove = (i) => {
    if (squares[i] || winner) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
    playSound('move', isSoundEnabled);

    const result = calculateWinner(newSquares);
    if (result.winner) {
      playSound('win', isSoundEnabled);
      if (result.winner !== 'tie') {
        setScores(prev => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1
        }));
      }
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetAll = () => {
    resetGame();
    setGameMode(null);
    setDifficulty(null);
    setScores({ X: 0, O: 0 });
  };

  const handleBack = () => {
    if (difficulty) {
      setDifficulty(null);
    } else {
      resetAll();
    }
  };

  if (!gameMode) {
    return <GameMode onSelectMode={setGameMode} onBack={() => window.history.back()} />;
  }

  if (gameMode === 'bot' && !difficulty) {
    return <DifficultySelector onSelectDifficulty={setDifficulty} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-purple-100 mb-8"
        >
          <ArrowLeft size={24} />
          Back
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-purple-300">Tic Tac Toe</h2>
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="p-2 rounded-full hover:bg-gray-800 text-purple-300"
        >
          {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      <GameStatus winner={winner} xIsNext={xIsNext} />
      <ScoreBoard scores={scores} />
      <Board squares={squares} onClick={handleMove} winningLine={line} />
      <GameControls onNewGame={resetGame} onMainMenu={resetAll} />
    </div>
  );
}

export default TicTacToe;