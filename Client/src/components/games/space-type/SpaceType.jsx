import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bomb, Pause, Play, RefreshCw, ArrowLeft } from "lucide-react";

import wordList from "./wordList";

const SpaceType = () => {
  const [enemies, setEnemies] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [shields, setShields] = useState(3);
  const [bombs, setBombs] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [startTime] = useState(Date.now());
  const [lasers, setLasers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [gameContainerSize, setGameContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const [shipPosition, setShipPosition] = useState({ x: 0, y: 0 });
  const [currentTarget, setCurrentTarget] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const shipRef = useRef(null);
  const gameContainerRef = useRef(null);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("spacetype-highscore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("spacetype-highscore", score.toString());
    }
  }, [score, highScore]);

  // Initialize ship position in center
  useEffect(() => {
    const updateContainerSize = () => {
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        const newSize = {
          width: rect.width,
          height: rect.height,
        };
        setGameContainerSize(newSize);
        setShipPosition({
          x: newSize.width / 2 - 32, // Center ship (32px is half ship width)
          y: newSize.height - 80, // 80px from bottom
        });
      }
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  const createParticles = (x, y) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x,
      y,
      angle: (Math.PI * 2 * i) / 8,
      speed: 0.2 + Math.random() * 0.2 * level,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 500);
  };

  const fireLaser = (targetEnemy) => {
    if (!targetEnemy || gameContainerSize.width === 0) return;

    // Ship position (center of ship)
    const shipX = shipPosition.x + 32; // 32 is half ship width
    const shipY = shipPosition.y;

    // Target position (center of enemy bubble)
    const targetX = targetEnemy.position.x + 40; // 40 is half bubble width
    const targetY = targetEnemy.position.y + 40; // 40 is half bubble height

    // Calculate distance for laser travel time
    const distance = Math.sqrt(
      Math.pow(targetX - shipX, 2) + Math.pow(targetY - shipY, 2)
    );
    const travelTime = distance / 800; // Adjust speed as needed

    const newLaser = {
      id: Date.now(),
      startX: shipX,
      startY: shipY,
      targetX,
      targetY,
      targetEnemyId: targetEnemy.id,
      travelTime: travelTime * 1000, // Convert to milliseconds
    };

    setLasers((prev) => [...prev, newLaser]);

    // Move ship towards target
    setShipPosition((prev) => {
      const newX = Math.max(
        32,
        Math.min(gameContainerSize.width - 64, targetX - 32)
      );
      return {
        ...prev,
        x: newX,
      };
    });

    // Remove laser after travel time and create explosion
    setTimeout(() => {
      setLasers((prev) => prev.filter((l) => l.id !== newLaser.id));
      createParticles(targetX, targetY);
    }, newLaser.travelTime);
  };

  const getWordForLevel = useCallback(() => {
    const levelWords = wordList.filter((word) => {
      if (level <= 2) return word.length <= 4;
      if (level <= 4) return word.length <= 6;
      if (level <= 6) return word.length <= 8;
      return true;
    });
    return levelWords[Math.floor(Math.random() * levelWords.length)];
  }, [level]);

  const spawnEnemy = useCallback(() => {
    if (
      enemies.length < 5 &&
      !isPaused &&
      !gameOver &&
      gameContainerSize.width > 0
    ) {
      const word = getWordForLevel();
      const newEnemy = {
        id: Date.now(),
        word,
        position: {
          x: Math.random() * (gameContainerSize.width - 80) + 40,
          y: -80,
        },
        speed: 1 + level * 0.3,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }
  }, [
    enemies.length,
    isPaused,
    gameOver,
    level,
    gameContainerSize,
    getWordForLevel,
  ]);

  // get the previous highscore
  useEffect(() => {
    const prevScore = localStorage.getItem("spaceTypeHighScore");
    if (prevScore) {
      setHighScore(parseInt(prevScore));
    }
  }, []);

  // when game ends highscore is saved.
  useEffect(() => {
    if (gameOver) {
      setHighScore((prevHighScore) => {
        if (score > prevHighScore) {
          localStorage.setItem("spaceTypeHighScore", score);
          return score;
        }
        return prevHighScore;
      });
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameContainerSize.width === 0) return;
    const spawnInterval = setInterval(
      spawnEnemy,
      Math.max(1000, 2500 - level * 150)
    );
    return () => clearInterval(spawnInterval);
  }, [spawnEnemy, level, gameContainerSize]);

  useEffect(() => {
    if (isPaused || gameOver || gameContainerSize.height === 0) return;

    const gameLoop = setInterval(() => {
      setEnemies((prev) => {
        const updated = prev.map((enemy) => ({
          ...enemy,
          position: {
            ...enemy.position,
            y: enemy.position.y + enemy.speed,
          },
        }));

        // Check for enemies reaching bottom
        const reachedBottom = updated.some(
          (enemy) => enemy.position.y > gameContainerSize.height - 120
        );
        if (reachedBottom) {
          setHealth((h) => {
            const newHealth = h - 15;
            if (newHealth <= 0) {
              setGameOver(true);
            }
            return Math.max(0, newHealth);
          });
        }

        return updated.filter(
          (enemy) => enemy.position.y <= gameContainerSize.height - 120
        );
      });

      // Calculate WPM
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds > 0) {
        const wordsTyped = score / 5; // Adjusted scoring
        const wordsPerMinute = (wordsTyped / elapsedSeconds) * 60;
        setWpm(Math.round(wordsPerMinute));
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [isPaused, gameOver, score, startTime, gameContainerSize]);

  const handleKeyPress = useCallback(
    (e) => {
      if (gameOver || isPaused) return;

      if (e.key === "Enter") {
        triggerBomb();
        return;
      }

      const char = e.key.toLowerCase();
      if (!/^[a-z]$/.test(char)) return;

      const targetEnemy = enemies.find((enemy) =>
        enemy.word.toLowerCase().startsWith(currentWord + char)
      );

      if (targetEnemy) {
        setCurrentWord((prev) => prev + char);
        setCurrentTarget(targetEnemy);
        fireLaser(targetEnemy);

        if (targetEnemy.word.toLowerCase() === currentWord + char) {
          setTimeout(() => {
            setEnemies((prev) => prev.filter((e) => e.id !== targetEnemy.id));
            setCurrentWord("");
            setCurrentTarget(null);
            setScore((s) => s + targetEnemy.word.length * 3);

            // Level progression
            const scoreForNextLevel = level * 50;
            if (score >= scoreForNextLevel) {
              setLevel((prev) => prev + 1);
            }
          }, 100); // Small delay for visual effect
        }
      } else {
        // Wrong key pressed, reset current word
        setCurrentWord("");
        setCurrentTarget(null);
      }
    },
    [enemies, currentWord, gameOver, isPaused, score, level]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const triggerBomb = () => {
    if (bombs > 0) {
      setBombs((b) => b - 1);
      // Create explosion effects for all enemies
      enemies.forEach((enemy) => {
        createParticles(enemy.position.x + 40, enemy.position.y + 40);
      });
      setEnemies([]);
      setCurrentWord("");
      setCurrentTarget(null);
    }
  };

  const useShield = () => {
    if (shields > 0) {
      setShields((s) => s - 1);
      setHealth(100);
    }
  };

  const resetGame = () => {
    setEnemies([]);
    setCurrentWord("");
    setScore(0);
    setLevel(1);
    setHealth(100);
    setShields(3);
    setBombs(2);
    setGameOver(false);
    setIsPaused(false);
    setWpm(0);
    setLasers([]);
    setParticles([]);
    setCurrentTarget(null);
    if (gameContainerSize.width > 0) {
      setShipPosition({
        x: gameContainerSize.width / 2 - 32,
        y: gameContainerSize.height - 80,
      });
    }
  };

  return (
    <div
      ref={gameContainerRef}
      className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 overflow-hidden"
      style={{ fontFamily: "monospace" }}
    >
      {/* Simple Starry background */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')] 
                      bg-cover bg-center opacity-20"
      />
      i h{/* UI Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-30 bg-black bg-opacity-50">
        <div className="flex gap-6 text-lg font-bold">
          <div className="text-yellow-400">Score: {score}</div>
          <div className="text-green-400">Level: {level}</div>
          <div className="text-blue-400">WPM: {wpm}</div>
          <div className="text-purple-400">Hi-Score: {highScore}</div>
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-sm">Type words to destroy enemies</p>
          <p className="text-gray-400 text-xs">Press ENTER for bomb</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
            title="Keyboard shortcuts"
          >
            <span className="text-white font-bold text-sm">i</span>
          </button>
          <button
            onClick={useShield}
            disabled={shields === 0}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            <Shield size={20} className="text-blue-400" /> {shields}
          </button>
          <button
            onClick={triggerBomb}
            disabled={bombs === 0}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            <Bomb size={20} className="text-red-400" /> {bombs}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
      </div>
      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-24 right-4 z-40 bg-black bg-opacity-90 p-6 rounded-lg border border-purple-400 max-w-xs">
          <h3 className="text-purple-400 font-bold mb-4 text-lg">
            Keyboard Shortcuts
          </h3>
          <div className="text-white text-sm space-y-2">
            <div>
              <span className="text-yellow-400">A-Z Keys:</span> Type to destroy
              enemies
            </div>
            <div>
              <span className="text-red-400">ENTER:</span> Use bomb (destroys
              all enemies)
            </div>
            <div>
              <span className="text-blue-400">Shield Button:</span> Restore
              health to 100%
            </div>
            <div>
              <span className="text-gray-400">Pause Button:</span> Pause/Resume
              game
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="text-xs text-gray-400">
              <div>• Type complete words to destroy enemies</div>
              <div>• Ship auto-aims at your target</div>
              <div>• Higher levels = longer words</div>
            </div>
          </div>
        </div>
      )}
      {/* Health Bar */}
      <div className="absolute top-20 left-4 right-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600 z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
          initial={{ width: "100%" }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
          Health: {health}%
        </div>
      </div>
      {/* Enemy Bubbles */}
      <AnimatePresence>
        {enemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            className="absolute z-20"
            initial={{ x: enemy.position.x, y: -80, scale: 0 }}
            animate={{
              x: enemy.position.x,
              y: enemy.position.y,
              scale: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.016,
            }}
          >
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${
                    currentTarget?.id === enemy.id
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-yellow-300 shadow-lg shadow-yellow-400/50"
                      : "bg-gradient-to-br from-purple-500 to-pink-500"
                  } 
                  border-2 border-white shadow-lg`}
              >
                <span className="drop-shadow-lg">{enemy.word}</span>
              </div>
              {/* Highlight typed portion */}
              {currentTarget?.id === enemy.id && currentWord && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-bold text-sm drop-shadow-lg">
                    {currentWord}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Laser Beams */}
      <AnimatePresence>
        {lasers.map((laser) => {
          const distance = Math.sqrt(
            Math.pow(laser.targetX - laser.startX, 2) +
              Math.pow(laser.targetY - laser.startY, 2)
          );
          const angle = Math.atan2(
            laser.targetY - laser.startY,
            laser.targetX - laser.startX
          );

          return (
            <motion.div
              key={laser.id}
              className="absolute z-25"
              style={{
                left: laser.startX,
                top: laser.startY,
                transformOrigin: "0 50%",
                transform: `rotate(${angle}rad)`,
              }}
            >
              <motion.div
                className="h-1 bg-cyan-400 rounded-full"
                style={{
                  boxShadow: "0 0 5px #00bfff",
                }}
                initial={{ width: 0, opacity: 1 }}
                animate={{
                  width: distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: laser.travelTime / 1000,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* Explosion Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-4 h-4 bg-white rounded-full z-25"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * 50,
              y: particle.y + Math.sin(particle.angle) * 50,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>
      {/* Player Ship */}
      <motion.div
        ref={shipRef}
        className="absolute z-30"
        animate={{
          x: shipPosition.x,
          y: shipPosition.y,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 bg-gradient-to-t from-cyan-400 via-blue-500 to-purple-600 shadow-xl"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))",
            }}
          />
          {/* Engine glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <div className="w-8 h-12 bg-gradient-to-t from-orange-500 to-transparent rounded-full opacity-80 animate-pulse" />
          </div>
        </div>
      </motion.div>
      {/* Current Word Display */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-black bg-opacity-70 px-6 py-3 rounded-lg border border-purple-400">
          <div className="text-center">
            <div className="text-gray-400 text-sm">Current Word:</div>
            <div className="text-purple-300 text-xl font-bold tracking-wider">
              {currentWord || "_"}
            </div>
          </div>
        </div>
      </div>
      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center text-white bg-gray-900 p-10 rounded-xl border-2 border-purple-500 shadow-2xl">
            <h2 className="text-5xl mb-6 text-red-400 font-bold">Game Over</h2>
            <div className="space-y-3 mb-8 text-xl">
              <p>
                Final Score:{" "}
                <span className="text-yellow-400 font-bold">{score}</span>
              </p>
              <p>
                High Score:{" "}
                <span className="text-green-400 font-bold">{highScore}</span>
              </p>
              <p>
                Level Reached:{" "}
                <span className="text-blue-400 font-bold">{level}</span>
              </p>
              <p>
                Words Per Minute:{" "}
                <span className="text-purple-400 font-bold">{wpm}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg transition-colors text-lg font-bold"
              >
                <RefreshCw size={24} /> Play Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-lg transition-colors text-lg font-bold"
              >
                <ArrowLeft size={24} /> Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceType;
