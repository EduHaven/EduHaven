// Whacamole.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { RefreshCw, ArrowLeft, Info } from "lucide-react"; // Added Info icon
import { Link } from "react-router-dom";
import useSound from "use-sound";
import bonkSfx from "./assets/Miss.wav";
import missSfx from "./assets/Bonk.wav";
import gameBackground from "./assets/gameBackground.jpg";
import teddyMole from "./assets/Mole.png";
import evilPlant from "./assets/Plant.png";
import burrowHole from "./assets/BurrowHole.png";

const NUM_HOLES = 9;
const GAME_DURATION = 30; // seconds
const MIN_UP = 800;
const MAX_UP = 1200;

const Whacamole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameItems, setGameItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [hiScore, setHiScore] = useState(0);
  const [showRules, setShowRules] = useState(false); // <-- new state for rules
 


  const [playBonk] = useSound(bonkSfx, { volume: 0.5, interrupt: true, html5: true });
  const [playMiss] = useSound(missSfx, { volume: 0.5, interrupt: true, html5: true });

  const timerRef = useRef(null);
  const spawnRef = useRef(null);

  // End game logic
  const endGame = useCallback(() => {
    setGameOver(true);
    clearInterval(timerRef.current);
    clearTimeout(spawnRef.current);

    setHiScore(prevHighScore => {
      if (score > prevHighScore) {
        localStorage.setItem("whacHiScore", score);
        return score;
      }
      return prevHighScore;
    });
  }, [score]);

  useEffect(() => {
    const prevScore = localStorage.getItem("whacHiScore");
    if (prevScore) {
      setHiScore(parseInt(prevScore));
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [endGame]);

  // Get a free hole index
  const getFreePosition = (items) => {
    const occupied = items.map(item => item.position);
    const freePositions = Array.from({ length: NUM_HOLES }, (_, i) => i).filter(pos => !occupied.includes(pos));
    if (freePositions.length === 0) return null;
    return freePositions[Math.floor(Math.random() * freePositions.length)];
  };

  // Spawn item logic
  const spawnItem = useCallback(() => {
    setGameItems(currentItems => {
      const position = getFreePosition(currentItems);
      if (position === null) return currentItems;

      const type = Math.random() < 0.7 ? 'mole' : 'plant';
      const id = Date.now() + Math.random();

      const upTime = Math.random() * (MAX_UP - MIN_UP) + MIN_UP;
      setTimeout(() => {
        setGameItems(items => {
          const itemStillThere = items.find(i => i.id === id);
          if (itemStillThere && itemStillThere.type === 'mole') {
            setScore(s => Math.max(0, s - 5));
          }
          return items.filter(i => i.id !== id);
        });
      }, upTime);

      return [...currentItems, { id, type, position }];
    });

    spawnRef.current = setTimeout(spawnItem, 900);
  }, []);

  useEffect(() => {
    spawnItem();
    return () => clearTimeout(spawnRef.current);
  }, [spawnItem]);

  // Handle click
  const handleClick = index => {
    if (gameOver) return;
    const item = gameItems.find(i => i.position === index);
    if (item) {
      if (item.type === 'mole') {
        playBonk();
        setScore(s => s + 10);
      } else {
        playMiss();
        endGame();
      }
      setGameItems(items => items.filter(i => i.id !== item.id));
    }
  };

  const btnClass = "px-10 py-2 rounded-full text-white font-semibold hover:opacity-90 transition";

  return (
    <div
      className={`min-h-screen relative overflow-hidden`}
      style={{
        backgroundImage: `url(${gameBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">WHAC-A-MOLE</h1>
          <div className="flex justify-center gap-12 text-2xl font-bold text-white drop-shadow-lg">
            <div>SCORE: {score}</div>
            <div>TIME: {timeLeft}</div>
            <div>HIGH SCORE: {hiScore}</div>
          </div>

          {/* How to Play Button */}
          <button
            onClick={() => setShowRules(true)}
            className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-full font-semibold flex items-center gap-2 mx-auto hover:opacity-90 transition"
          >
            <Info size={20} /> How to Play
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 mx-auto max-w-md">
          {Array.from({ length: NUM_HOLES }).map((_, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className="relative w-28 h-28 cursor-pointer flex items-center justify-center rounded-full overflow-hidden"
              style={{
                backgroundImage: `url(${burrowHole})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {gameItems.map(item =>
                item.position === i && (
                  <img
                    key={item.id}
                    src={item.type === 'mole' ? teddyMole : evilPlant}
                    alt={item.type}
                    className="absolute w-20 h-20 object-contain animate-bounce"
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">GAME OVER!</h2>
            <h4 className="text-xl text-white mb-6">Final Score: {score}</h4>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => window.location.reload()}
                className={`${btnClass} bg-green-500 flex items-center gap-2 justify-center`}
              >
                <RefreshCw size={20} /> Play Again
              </button>
              <Link to="/games" className={`${btnClass} bg-red-500 flex items-center gap-2 justify-center`}>
                <ArrowLeft size={20} /> Exit
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Rules Overlay */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">How to Play</h2>
            <ul className="text-white text-lg mb-6 list-disc list-inside text-left">
              <li>Whack the <span className="text-yellow-300 font-bold">moles</span> to earn +10 points.</li>
              <li>Missing a mole costs <span className="text-red-400 font-bold">-5 points</span>.</li>
              <li>Don’t hit the <span className="text-green-400 font-bold">plants</span> — hitting one ends the game!</li>
              <li>You have <span className="text-blue-300 font-bold">{GAME_DURATION} seconds</span> to score as much as you can.</li>
              <li>Try to beat your High Score!</li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="px-6 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whacamole;
