import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bomb, Pause, Play, RefreshCw, ArrowLeft } from "lucide-react";
import useSound from "use-sound";
import "./spaceType.css";
import { Link } from "react-router-dom";
const wordList = [
  // Entry Level: Short Words (3 characters)
  "bat",
  "cat",
  "dog",
  "red",
  "box",
  "top",
  "sun",
  "car",
  "bag",
  "pen",
  "cap",
  "fun",
  "hat",
  "log",
  "man",
  "map",
  "pop",
  "run",
  "row",
  "wet",
  "pig",
  "ice",
  "jam",
  "key",
  "lip",
  "mix",
  "new",
  "old",
  "pit",
  "rag",
  "sea",
  "tin",
  "van",
  "yes",
  "zip",
  "arc",
  "bud",
  "cut",
  "dry",
  "egg",
  "fan",
  "gem",
  "hut",
  "ivy",
  "job",
  "kit",
  "low",
  "nap",
  "owl",
  "pan",
  "web",
  "sip",
  "dot",
  "lot",
  "tap",
  "tap",
  "rip",
  "bag",
  "bit",
  "bot",
  "sip",
  "map",
  "cap",
  "jam",
  "dot",
  "vat",
  "git",
  "raw",
  "sad",
  "tag",
  "tip",
  "bun",
  "pet",
  "run",
  "sit",
  "sub",
  "ten",
  "bus",
  "bug",
  "van",
  "pit",
  "pet",
  "bat",
  "top",
  "tab",
  "rot",
  "tar",
  "jar",
  "lit",
  "tip",

  // Medium Words: (4 characters)
  "blue",
  "tree",
  "game",
  "fire",
  "wolf",
  "zoom",
  "jump",
  "rock",
  "star",
  "cold",
  "dark",
  "lamp",
  "rain",
  "ship",
  "time",
  "wave",
  "gift",
  "good",
  "grow",
  "high",
  "land",
  "moon",
  "open",
  "peak",
  "road",
  "safe",
  "slow",
  "wind",
  "wood",
  "year",
  "zone",
  "calm",
  "clap",
  "dust",
  "ever",
  "fear",
  "glow",
  "gold",
  "grip",
  "heat",
  "hill",
  "iron",
  "kind",
  "life",
  "note",
  "path",
  "rise",
  "sing",
  "snow",
  "stop",
  "talk",
  "view",
  "walk",
  "wild",
  "data",
  "code",
  "test",
  "read",
  "study",
  "mark",
  "quiz",
  "home",
  "idea",
  "time",
  "read",
  "work",
  "note",
  "edit",
  "list",
  "file",
  "plan",
  "goal",
  "task",
  "copy",
  "pass",
  "goal",
  "find",
  "task",
  "race",
  "match",
  "link",
  "show",
  "read",
  "pick",
  "work",
  "write",
  "mail",
  "edit",
  "rich",
  "kind",
  "fast",
  "slow",
  "rest",
  "vote",
  "zoom",
  "chat",
  "gift",
  "plan",

  // Long Words: (5 characters)
  "apple",
  "beach",
  "cloud",
  "dance",
  "flame",
  "grass",
  "heart",
  "jelly",
  "light",
  "movie",
  "night",
  "ocean",
  "party",
  "queen",
  "river",
  "shine",
  "smile",
  "space",
  "storm",
  "sugar",
  "table",
  "thing",
  "tiger",
  "torch",
  "trust",
  "voice",
  "world",
  "youth",
  "zebra",
  "angle",
  "armor",
  "brave",
  "chase",
  "clear",
  "creek",
  "dress",
  "faith",
  "glide",
  "grave",
  "hover",
  "knife",
  "level",
  "lucky",
  "peace",
  "plate",
  "polar",
  "scope",
  "sleep",
  "solid",
  "sweet",
  "tower",
  "trace",
  "track",
  "value",
  "water",
  "wheel",
  "study",
  "learn",
  "topic",
  "pupil",
  "class",
  "room",
  "grade",
  "test",
  "task",
  "skill",
  "memo",
  "research",
  "library",
  "study",
  "block",
  "debug",
  "class",
  "index",
  "align",
  "array",
  "loops",
  "bytes",
  "print",
  "compile",
  "logic",
  "value",
  "input",
  "stack",
  "button",
  "coding",
  "class",
  "stage",
  "input",
  "shift",
  "scope",
  "value",

  // Very Long Words: (6 characters)
  "banana",
  "bridge",
  "castle",
  "charge",
  "circle",
  "dragon",
  "flight",
  "flower",
  "forest",
  "future",
  "hunger",
  "island",
  "jungle",
  "market",
  "motion",
  "oyster",
  "planet",
  "prince",
  "prison",
  "rescue",
  "rocket",
  "school",
  "shadow",
  "shield",
  "silver",
  "source",
  "strike",
  "stream",
  "symbol",
  "talent",
  "tunnel",
  "vision",
  "volume",
  "window",
  "winter",
  "absorb",
  "artist",
  "beyond",
  "camera",
  "candle",
  "dinner",
  "dreams",
  "empire",
  "fusion",
  "growth",
  "honest",
  "impact",
  "intent",
  "lovers",
  "master",
  "moment",
  "nation",
  "nature",
  "nobody",
  "parlor",
  "resist",
  "program",
  "error",
  "syntax",
  "output",
  "code",
  "compile",
  "matrix",
  "logic",
  "debug",
  "stack",
  "style",
  "class",
  "button",
  "editor",
  "public",
  "inner",
  "system",
  "inputs",
  "print",
  "scan",
  "index",
  "loop",
  "value",
  "search",
  "update",
  "switch",
  "input",
  "print",
  "target",
  "query",
  "array",
  "align",
  "enter",
  "record",
  "learn",
  "result",
  "study",

  // Advanced Level: Words with 7 characters
  "android",
  "captain",
  "control",
  "crystal",
  "decline",
  "density",
  "diamond",
  "discuss",
  "element",
  "fiction",
  "fortune",
  "general",
  "gravity",
  "history",
  "imagery",
  "journey",
  "justice",
  "kitchen",
  "kingdom",
  "manager",
  "mariner",
  "monster",
  "morning",
  "natural",
  "network",
  "octopus",
  "outlook",
  "passion",
  "pattern",
  "perfect",
  "picture",
  "popular",
  "produce",
  "quality",
  "reactor",
  "release",
  "resolve",
  "science",
  "soldier",
  "species",
  "success",
  "surface",
  "survive",
  "temple",
  "theater",
  "trouble",
  "victory",
  "welcome",
  "program",
  "python",
  "android",
  "binary",
  "debug",
  "device",
  "closure",
  "output",
  "indexer",
  "stack",
  "model",
  "parser",
  "forloop",
  "swift",
  "gitflow",
  "render",
  "buffer",
  "query",
  "input",
  "compile",
  "structure",
  "class",
  "matrix",
  "integer",
  "version",
  "update",
  "icon",
  "format",
  "input",
  "network",
  "create",
  "runtime",
  "request",
  "handler",
  "encrypt",
  "format",
  "server",
  "debugger",
  "visual",
  "remote",
  "update",
  "tracking",
  "reboot",

  // Grandmaster Level: Complex to type
  "velocity",
  "aerodrome",
  "geometry",
  "computer",
  "keyboard",
  "function",
  "terminal",
  "parallel",
  "compiler",
  "sequence",
  "variable",
  "developer",
  "packages",
  "dynamics",
  "resource",
  "equation",
  "software",
  "optimize",
  "abstract",
  "learning",
  "flexible",
  "argument",
  "balanced",
  "external",
  "hardware",
  "progress",
  "training",
  "research",
  "platform",
  "settings",
  "designer",
  "advanced",
  "strategy",
  "pipeline",
  "feedback",
  "analyze",
  "debugger",
  "security",
  "database",
  "framework",
  "solution",
  "browser",
  "reliable",
  "analytics",
  "frontend",
  "backend",
  "document",
  "function",
  "hypervelocity",
  "aerodynamics",
  "gravitational",
  "astrophysics",
  "interstellar",
  "extraterrestrial",
  "microgravity",
  "quasarsandquarks",
  "quantization",
  "ionization",
  "thermodynamics",
  "spectroscopy",
  "parallelism",
  "ultraviolet",
  "supercluster",
  "eventhorizon",
  "cosmological",
  "darkmatter",
  "neutronstar",
  "eigenvectors",
  "cryptography",
  "infrastructure",
  "characteristic",
  "congratulations",
  "differentiation",
  "generalization",
  "localization",
  "decomposition",
  "synchronization",
  "hyperparameter",
  "revolutionary",
  "superconductivity",
  "information",
  "initialization",
  "procrastination",
  "suboptimization",
  "digitalization",
  "misconfiguration",
  "decentralization",
  "computational",
  "superimposition",
  "microcontrollers",
];

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
  const [typedChars, setTypedChars] = useState([]);
  const [startTime] = useState(Date.now());
  const [lasers, setLasers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [gameContainerSize, setGameContainerSize] = useState({ width: 0, height: 0 });
  const shipRef = useRef(null);
  const gameContainerRef = useRef(null);
  const [currentTarget, setCurrentTarget] = useState(null);

  // Sound effects
  const [playLaser] = useSound("./laser.mp3", { volume: 0.5 });
  const [playExplosion] = useSound("./explosion.mp3", { volume: 0.5 });
  const [playGameOver] = useSound("./gameover.mp3", { volume: 0.5 });

  useEffect(() => {
    const updateContainerSize = () => {
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        setGameContainerSize({
          width: rect.width,
          height: rect.height
        });
      }
    };
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
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
    if (!shipRef.current || !gameContainerRef.current) return;

    const containerRect = gameContainerRef.current.getBoundingClientRect();
    const shipRect = shipRef.current.getBoundingClientRect();

    const shipX = shipRect.left - containerRect.left + shipRect.width / 2;
    const shipY = shipRect.top - containerRect.top;

    const targetX = targetEnemy.position.x + 40; // Center of enemy
    const targetY = targetEnemy.position.y + 40;

    // Calculate angle
    const angle = Math.atan2(targetY - shipY, targetX - shipX);

    const newLaser = {
      id: Date.now(),
      startX: shipX,
      startY: shipY,
      targetX,
      targetY,
      angle,
      progress: 0,
    };

    setLasers((prev) => [...prev, newLaser]);

    setTimeout(() => {
      setLasers((prev) => prev.filter((l) => l.id !== newLaser.id));
      createParticles(targetX, targetY);
    }, 400);
  };

  const getWordForLevel = useCallback(() => {
    const levelWords = wordList.filter((word) => {
      if (level <= 1) return word.length <= 3;
      if (level <= 2) return word.length <= 4;
      if (level <= 3) return word.length <= 5;
      if (level <= 4) return word.length <= 6;
      if (level <= 5) return word.length <= 7;
      if (level <= 6) return word.length <= 8;
      if (level <= 7) return word.length <= 8 && word.length > 5;
      if (level <= 8) return word.length <= 9 && word.length > 3;
      if (level <= 9) return word.length > 4;
      if (level <= 10) return word.length > 5;
      return true;
    });
    return levelWords[Math.floor(Math.random() * levelWords.length)];
  }, [level]);

  const spawnEnemy = useCallback(() => {
    if (enemies.length < 5 && !isPaused && !gameOver && gameContainerSize.width > 0) {
      const word = getWordForLevel();
      const newEnemy = {
        id: Date.now(),
        word,
        position: {
          x: Math.random() * (gameContainerSize.width - 100) + 50,
          y: -50,
        },
        speed: 1 + level * 0.2,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }
  }, [enemies.length, isPaused, gameOver, level, gameContainerSize, getWordForLevel]);

  useEffect(() => {
    if (gameContainerSize.width === 0) return;

    const spawnInterval = setInterval(spawnEnemy, 2000 - level * 100);
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
          (enemy) => enemy.position.y > gameContainerSize.height - 100
        );
        if (reachedBottom) {
          setHealth((h) => {
            const newHealth = h - 20;
            if (newHealth <= 0) {
              setGameOver(true);
              playGameOver();
            }
            return newHealth;
          });
        }

        return updated.filter(
          (enemy) => enemy.position.y <= gameContainerSize.height - 100
        );
      });

      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds > 0) {
        const wordsTyped = score / 2;
        const wordsPerMinute = (wordsTyped / elapsedSeconds) * 60;
        setWpm(Math.round(wordsPerMinute));
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [isPaused, gameOver, score, startTime, playGameOver, gameContainerSize]);

  const handleKeyPress = useCallback(
    (e) => {
      if (gameOver || isPaused) return;
      if (e.key === "Enter") {
        useBomb();
        return;
      }
      const char = e.key.toLowerCase();
      if (!/^[a-z]$/.test(char)) return;

      setTypedChars((prev) => [...prev, char]);

      const targetEnemy = enemies.find((enemy) =>
        enemy.word.toLowerCase().startsWith(currentWord + char)
      );

      if (targetEnemy) {
        setCurrentWord((prev) => prev + char);
        setCurrentTarget(targetEnemy);
        playLaser();
        fireLaser(targetEnemy);

        if (targetEnemy.word.toLowerCase() === currentWord + char) {
          playExplosion();
          setEnemies((prev) => prev.filter((e) => e.id !== targetEnemy.id));
          setCurrentWord("");
          setCurrentTarget(null);
          setScore((s) => s + targetEnemy.word.length * 2);

          const scoreForNextLevel = Math.pow(2, level) * 10;
          if (score >= scoreForNextLevel) {
            setLevel((prev) => prev + 1);
          }
        }
      }
    },
    [enemies, currentWord, gameOver, isPaused, score, playLaser, playExplosion, level]
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  const useBomb = () => {
    if (bombs > 0) {
      setBombs((b) => b - 1);
      setEnemies([]);
      playExplosion();
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
    setTypedChars([]);
    setLasers([]);
    setParticles([]);
    setCurrentTarget(null);
  };

  return (
    <div ref={gameContainerRef}
     className="relative w-[calc(100vw-10rem)] h-[calc(100vh-3.5rem)] bg-black overflow-hidden spacetype">
      {/* Starry background */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')] 
                      bg-cover bg-center opacity-20"
      />

      {/* UI Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white">
        <div className="flex gap-4">
          <div>Score: {score}</div>
          <div>Level: {level}</div>
          <div>WPM: {wpm}</div>
        </div>
        <p className="text-gray-400">
          press Enter to use Bomb | Type to kill words
        </p>
        <div className="flex gap-4">
          <button onClick={useShield} className="flex items-center gap-2">
            <Shield className="text-purple-400" /> x{shields}
          </button>
          <button onClick={useBomb} className="flex items-center gap-2">
            <Bomb className="text-purple-400" /> x{bombs}
          </button>
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? (
              <Play className="text-purple-400" />
            ) : (
              <Pause className="text-purple-400" />
            )}
          </button>
        </div>
      </div>

      {/* Health Bar */}
      <div className="absolute top-16 left-4 right-4 h-2 bg-gray-700 rounded-full">
        <motion.div
          className="h-full bg-purple-500 rounded-full"
          initial={{ width: "100%" }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Game Area */}
      <AnimatePresence>
        {enemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            className="absolute z-20"
            initial={{ x: enemy.position.x, y: -50, scale: 0 }}
            animate={{ x: enemy.position.x, y: enemy.position.y, scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.016 }}
          >
            <div className="relative">
              <div
                className={`w-20 h-20 bg-purple-600 rounded-full opacity-50 animate-pulse
                ${
                  currentTarget?.id === enemy.id
                    ? "ring-4 ring-purple-400 ring-opacity-75 shadow-purple-400/50"
                    : ""
                }`}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          text-white font-bold whitespace-nowrap"
              >
                {enemy.word}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Laser Beams */}
      <AnimatePresence>
        {lasers.map((laser) => (
          <motion.div
            key={laser.id}
            className="laser-beam absolute h-1 laser-glow"
            style={{
              left: laser.startX,
              top: laser.startY,
              width: "2px",
              transformOrigin: "left center",
              transform: `rotate(${laser.angle}rad)`,
            }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{
              scaleX: 30,
              opacity: [1, 1, 0],
              x: [0, 100, 200],
              // y: [0, -50, -100]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        ))}
      </AnimatePresence>

      {/* Explosion Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle absolute w-4 h-4"
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
      <div
        ref={shipRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div 
          className="w-16 h-16 bg-gradient-to-t from-purple-400 to-pink-400 shadow-lg"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))'
          }}
        />
      </div>

      {/* Typed Characters Display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-purple-300">
        {currentWord}
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-purple-300 bg-gray-900 p-8 rounded-lg border border-purple-500">
            <h2 className="text-4xl mb-4 text-purple-400">Game Over</h2>
            <p className="mb-2 text-xl">Final Score: <span className="text-purple-400">{score}</span></p>
            <p className="mb-4 text-lg">Level Reached: <span className="text-purple-400">{level}</span></p>
            <p className="mb-6 text-lg">WPM: <span className="text-purple-400">{wpm}</span></p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex text-white items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
              >
                <RefreshCw size={20} /> Play Again
              </button>
              <button 
                onClick={() => console.log('Exit to menu')}
                className="flex text-white items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} /> Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceType;
