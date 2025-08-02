import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Enemy {
  id: number;
  text: string;
  position: { x: number; y: number };
  speed: { x: number; y: number };
  health: number;
  size: number;
  cluster?: number;
}

interface Projectile {
  id: number;
  position: { x: number; y: number };
  targetEnemy: number;
  direction: { x: number; y: number };
}

interface PowerUp {
  type: "shield" | "bomb";
  duration: number;
  active: boolean;
}

export default function TypingGame() {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [wpm, setWpm] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { type: "shield", duration: 5000, active: false },
    { type: "bomb", duration: 3000, active: false },
  ]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const lastSpawnTime = useRef(0);
  const startTime = useRef(Date.now());
  const totalCharactersTyped = useRef(0);

  const wordList = [
    // Short words for early levels
    "aim",
    "hit",
    "run",
    "fly",
    "zap",
    "beam",
    "shot",
    // Medium words
    "laser",
    "space",
    "alien",
    "pilot",
    "orbit",
    "comet",
    // Long words for higher levels
    "asteroid",
    "starship",
    "nebula",
    "galaxy",
    "quantum",
    "supernova",
    "interstellar",
    "constellation",
  ];

  const getWordForLevel = useCallback(() => {
    const levelWords = wordList.filter((word) => {
      if (level <= 3) return word.length <= 4;
      if (level <= 5) return word.length <= 6;
      return true;
    });
    return levelWords[Math.floor(Math.random() * levelWords.length)];
  }, [level]);

  const spawnEnemy = useCallback(() => {
    if (!gameAreaRef.current) return;

    const width = gameAreaRef.current.clientWidth;
    const word = getWordForLevel();
    const x = Math.random() * (width - 100);
    const cluster =
      Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : undefined;

    const newEnemy: Enemy = {
      id: Date.now(),
      text: word,
      position: { x, y: -20 },
      speed: {
        x: (Math.random() - 0.5) * 0.5,
        y: 0.2 + Math.random() * 0.2 * level,
      },
      health: word.length,
      size: 40 + word.length * 5,
      cluster,
    };

    setEnemies((prev) => [...prev, newEnemy]);
  }, [level, getWordForLevel]);

  const updateGame = useCallback(() => {
    if (!isPlaying) return;

    // Update WPM
    const timeElapsed = (Date.now() - startTime.current) / 1000 / 60;
    const newWpm = Math.round(totalCharactersTyped.current / 5 / timeElapsed);
    setWpm(newWpm);

    // Update enemies
    setEnemies((prevEnemies) => {
      const updatedEnemies = prevEnemies.map((enemy) => ({
        ...enemy,
        position: {
          x: enemy.position.x + enemy.speed.x,
          y: enemy.position.y + enemy.speed.y,
        },
      }));

      // Check collisions with player
      const bottomHit = updatedEnemies.some((enemy) => enemy.position.y > 450);
      if (bottomHit && !powerUps[0].active) {
        setPlayerHealth((prev) => {
          const newHealth = prev - 10;
          if (newHealth <= 0) {
            setGameOver(true);
            setIsPlaying(false);
          }
          return newHealth;
        });
      }

      return updatedEnemies;
    });

    // Update projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles
        .map((projectile) => ({
          ...projectile,
          position: {
            ...projectile.position,
            y: projectile.position.y - 5,
          },
        }))
        .filter((projectile) => projectile.position.y > 0);
    });

    // Spawn new enemies
    const now = Date.now();
    if (now - lastSpawnTime.current > Math.max(2000 - level * 200, 800)) {
      spawnEnemy();
      lastSpawnTime.current = now;
    }

    frameRef.current = requestAnimationFrame(updateGame);
  }, [isPlaying, level, powerUps, spawnEnemy]);

  useEffect(() => {
    if (isPlaying) {
      frameRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, updateGame]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    // Check if the input matches any enemy's text
    const isValidInput = enemies.some((enemy) =>
      enemy.text.toLowerCase().startsWith(value)
    );

    // Only update input if it's valid or empty
    if (isValidInput || value === "") {
      setCurrentInput(value);

      if (isValidInput) {
        const matchedEnemy = enemies.find((enemy) =>
          enemy.text.toLowerCase().startsWith(value)
        );

        if (matchedEnemy) {
          // Create projectile for each correct character
          const newProjectile: Projectile = {
            id: Date.now(),
            position: { x: window.innerWidth / 2, y: 480 },
            targetEnemy: matchedEnemy.id,
            direction: {
              x: 0,
              y: 0
            }
          };
          setProjectiles((prev) => [...prev, newProjectile]);

          // If word is complete
          if (value === matchedEnemy.text.toLowerCase()) {
            totalCharactersTyped.current += value.length;

            // Handle cluster destruction
            if (matchedEnemy.cluster) {
              setEnemies((prev) =>
                prev.filter((e) => e.cluster !== matchedEnemy.cluster)
              );
              setScore((prev) => prev + 50); // Bonus for cluster
            } else {
              setEnemies((prev) =>
                prev.filter((e) => e.id !== matchedEnemy.id)
              );
              setScore((prev) => prev + matchedEnemy.text.length * 10);
            }

            // Level up every 500 points
            if (score > level * 500) {
              setLevel((prev) => prev + 1);
            }

            setCurrentInput("");
          }
        }
      }
    }
  };

  const activatePowerUp = (type: "shield" | "bomb") => {
    setPowerUps((prev) =>
      prev.map((p) => (p.type === type ? { ...p, active: true } : p))
    );

    if (type === "bomb") {
      setEnemies([]);
      setScore((prev) => prev + 100);
    }

    setTimeout(
      () => {
        setPowerUps((prev) =>
          prev.map((p) => (p.type === type ? { ...p, active: false } : p))
        );
      },
      type === "shield" ? 5000 : 3000
    );
  };

  const startGame = () => {
    setEnemies([]);
    setProjectiles([]);
    setScore(0);
    setLevel(1);
    setWpm(0);
    setPlayerHealth(100);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentInput("");
    startTime.current = Date.now();
    totalCharactersTyped.current = 0;
    lastSpawnTime.current = Date.now();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.5,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative">
        <Link
          to={"/games"}
          className="mb-8 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-4">
            Space Type
          </h1>
          <p className="text-purple-300 mb-4">
            Defend Earth from the word invasion!
          </p>

          {!isPlaying && !gameOver && (
            <button
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Mission
            </button>
          )}

          {gameOver && (
            <div className="space-y-4">
              <p className="text-2xl font-bold">Mission Failed!</p>
              <div className="space-y-2">
                <p>Final Score: {score}</p>
                <p>Words Per Minute: {wpm}</p>
                <p>Level Reached: {level}</p>
              </div>
              <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {isPlaying && (
          <>
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl">
                Level:{" "}
                <span className="text-purple-400 font-bold">{level}</span>
              </div>
              <div className="text-xl">
                Score:{" "}
                <span className="text-purple-400 font-bold">{score}</span>
              </div>
              <div className="text-xl">
                WPM: <span className="text-purple-400 font-bold">{wpm}</span>
              </div>
            </div>

            {/* Power-ups */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => activatePowerUp("shield")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  powerUps[0].active
                    ? "bg-purple-500 text-white"
                    : "bg-purple-900 text-purple-300 hover:bg-purple-800"
                }`}
                disabled={powerUps[0].active}
              >
                <Shield size={16} />
                Shield
              </button>
              <button
                onClick={() => activatePowerUp("bomb")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  powerUps[1].active
                    ? "bg-purple-500 text-white"
                    : "bg-purple-900 text-purple-300 hover:bg-purple-800"
                }`}
                disabled={powerUps[1].active}
              >
                <Zap size={16} />
                Bomb
              </button>
            </div>

            {/* Health Bar */}
            <div className="mb-4">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
                  style={{ width: `${playerHealth}%` }}
                />
              </div>
            </div>

            {/* Game Area */}
            <div
              ref={gameAreaRef}
              className="relative h-[500px] bg-gray-800/50 rounded-lg overflow-hidden border-2 border-purple-500/30 mb-4"
            >
              {/* Player Ship */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, rgb(168, 85, 247), transparent)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-purple-400" />
              </div>

              {/* Enemies */}
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className={`absolute transition-all duration-16 ${
                    enemy.cluster ? "bg-purple-600/20" : "bg-purple-500/20"
                  } rounded-full flex items-center justify-center`}
                  style={{
                    left: `${enemy.position.x}px`,
                    top: `${enemy.position.y}px`,
                    width: `${enemy.size}px`,
                    height: `${enemy.size}px`,
                  }}
                >
                  <span className="text-purple-300 font-mono">
                    {enemy.text}
                  </span>
                </div>
              ))}

              {/* Projectiles */}
              {projectiles.map((projectile) => (
                <div
                  key={projectile.id}
                  className="absolute w-1 h-4 bg-purple-400"
                  style={{
                    left: `${projectile.position.x}px`,
                    top: `${projectile.position.y}px`,
                    transform: "translateX(-50%)",
                  }}
                />
              ))}
            </div>

            {/* Input Area */}
            <div className="flex justify-center">
              <input
                type="text"
                value={currentInput}
                onChange={handleInput}
                className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border-2 border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                placeholder="Type to shoot..."
                autoFocus
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
