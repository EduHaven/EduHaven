import React, { useEffect, useState, useRef } from "react";
import "./snake.css";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";

// Define the theme configurations
const themes = {
  light: [
    { name: "Light default", glow: "#a855f7" },
    { name: "Ocean Breeze", glow: "#3b82f6" },
    { name: "Arctic Mint", glow: "#2dd4bf" },
    { name: "Mint Dream", glow: "#86efac" },
    { name: "Rose Gold", glow: "#f43f5e" },
    { name: "Coral Reef", glow: "#f87171" },
    { name: "Golden Hour", glow: "#fbbf24" },
    { name: "Lavender Fields", glow: "#c4b5fd" },
  ],
  dark: [
    { name: "Dark default", glow: "#a855f7" },
    { name: "Space Black", glow: "#c084fc" },
    { name: "Midnight Blue", glow: "#2563eb" },
    { name: "Obsidian", glow: "#fbbf24" },
    { name: "Sapphire Dream", glow: "#2563eb" },
    { name: "Deep Purple", glow: "#581c87" },
    { name: "Volcanic", glow: "#b91c1c" },
    { name: "Forest", glow: "#16a34a" },
    { name: "Coffee", glow: "#7c2d12" },
    { name: "Neon Sunset", glow: "#f43f5e" },
    { name: "Cyberpunk", glow: "#d946ef" },
    { name: "Matrix", glow: "#4ade80" },
  ],
};

const SnakeGame = () => {
  const [hiScore, setHiScore] = useState(0);
  const [drawingMode, setDrawingMode] = useState("circles");
  // The state will now hold the index of the current light or dark theme
  const [currentLightIndex, setCurrentLightIndex] = useState(0);
  const [currentDarkIndex, setCurrentDarkIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const drawingRef = useRef({ circles: true, lines: false, contour: false });

  // Function to cycle through themes
  const toggleTheme = () => {
    if (isDarkMode) {
      // If currently in dark mode, cycle through the dark themes
      if (currentDarkIndex < themes.dark.length - 1) {
        setCurrentDarkIndex(prevIndex => prevIndex + 1);
      } else {
        // After the last dark theme, switch to the first light theme
        setIsDarkMode(false);
        setCurrentDarkIndex(-1);
        setCurrentLightIndex(0);
      }
    } else {
      // If currently in light mode, cycle through the light themes
      if (currentLightIndex < themes.light.length - 1) {
        setCurrentLightIndex(prevIndex => prevIndex + 1);
      } else {
        // After the last light theme, switch to dark mode
        setIsDarkMode(true);
        setCurrentLightIndex(-1);
        setCurrentDarkIndex(0);
      }
    }
  };

  useEffect(() => {
    const prevHiScore = localStorage.getItem("snakeHiScore");
    if (prevHiScore) {
      setHiScore(parseInt(prevHiScore, 10));
    }
  }, []);

  useEffect(() => {
    // --- All the original game logic remains here, unchanged ---
    Math.PI2 = 2 * Math.PI;
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (function () {
        return (
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            return window.setTimeout(callback, 1000 / 60);
          }
        );
      })();
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (function () {
        return (
          window.webkitCancelAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (a) {
            window.clearTimeout(a);
          }
        );
      })();
    }
    function comeCloser(n, goal, factor, limit) {
      return limit && Math.abs(goal - n) < limit
        ? n
        : n + (goal - n) / (factor || 10);
    }
    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    function Point(x, y) { this.x = x; this.y = y; return this; }
    Point.prototype = {
      clone: function () { return new Point(this.x, this.y); },
      add: function (p) { this.x += p.x; this.y += p.y; return this; },
      sub: function (p) { this.x -= p.x; this.y -= p.y; return this; },
      dist: function (p) { var x = p.x - this.x, y = p.y - this.y; return Math.sqrt(x * x + y * y); },
      toPolar: function () { return new Polar(Math.atan2(this.y, this.x), Math.sqrt(this.y * this.y + this.x * this.x)); },
    };
    function Polar(a, d) { this.a = a; this.d = d; return this; }
    Polar.prototype = {
      clone: function () { return new Polar(this.a, this.d); },
      multiply: function (f) { this.d *= f; return this; },
      toPoint: function () { return new Point(this.d * Math.cos(this.a), this.d * Math.sin(this.a)); },
    };
    const scoreFont = " Verdana, Geneva, sans-serif";
    const fontFamily = ' "Merriweather Sans", sans-serif';
    const c = document.getElementById("c");
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, played = false, ingame = false, playing = false, aniFrame;
    const kbd = { left: false, right: false };
    let goal, goalSize, bodyP = [], bodyM = [], bodyRadius, rotSpeed, density, score;

    function newGoal() {
      let p, ok = false;
      const rect = { x: { min: 2 * bodyRadius, max: w - 2 * bodyRadius }, y: { min: 2 * bodyRadius, max: h - 2 * bodyRadius } };
      while (!ok) {
        p = new Point(randomBetween(rect.x.min, rect.x.max), randomBetween(rect.y.min, rect.y.max));
        ok = true;
        for (let i = 0, len = bodyP.length; i < len; i++) {
          if (p.dist(bodyP[i]) <= bodyRadius) { ok = false; break; }
        }
      }
      goalSize = 200;
      ctx.strokeStyle = "white";
      goal = p;
    }
    function start() {
      if (playing) return;
      bodyRadius = 9;
      rotSpeed = 0.085;
      density = 0.15;
      bodyP = [new Point(w * 0.5, h * 0.5)];
      bodyM = [new Polar(0, 2.2)];
      score = 0;
      newGoal();
      played = ingame = playing = true;
      step();
    }
    function lose(source) {
      stop();
      ingame = false;
      draw();
      ctx.font = "30px" + fontFamily;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      let text = "GAME OVER";
      if (source === "tail") text = "OH SNAKE, WHY DID YOU EAT YOURSELF ?!";
      if (source === "wall") text = "THERE'S A WALL DOWN THERE";
      ctx.fillText(text, w * 0.5, h * 0.5);
      ctx.font = "30px" + scoreFont;
      const rScore = Math.round(score);
      const currentHiScore = parseInt(localStorage.getItem("snakeHiScore") || "0", 10);
      if (rScore > currentHiScore) {
        localStorage.setItem("snakeHiScore", rScore);
        setHiScore(rScore);
      }
      ctx.textBaseline = "middle";
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5 + 15);
      for (let i = 0, n = 5; i < n; i++) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0," + (i + 1) / (n * 3) + ")";
        ctx.translate(randomBetween(-5, 5), randomBetween(-5, 5));
        ctx.rotate(randomBetween(-Math.PI * 0.1, Math.PI * 0.1));
        const s = randomBetween(0.9, 1.2);
        ctx.scale(s, s);
        ctx.fillText(rScore, 0, 0);
        ctx.restore();
      }
      ctx.fillStyle = "white";
      ctx.fillText(rScore, 0, 0);
      ctx.restore();
    }
    function resume() { if (playing) return; playing = true; step(); }
    function stop() { if (aniFrame) cancelAnimationFrame(aniFrame); playing = false; }
    function step() {
      if (!playing) return;
      score = Math.max(0, score - 0.005 * bodyP.length);
      goalSize = comeCloser(goalSize, 1, 15);
      if (kbd.left) bodyM[0].a -= rotSpeed;
      if (kbd.right) bodyM[0].a += rotSpeed;
      bodyM[0].a %= Math.PI2;
      let point, head = bodyP[0];
      for (let i = 1, l = bodyM.length; i < l; i++) bodyM[i] = bodyP[i].clone().sub(bodyP[i - 1]).toPolar().multiply(-density);
      for (let i = 0, l = bodyP.length; i < l; i++) {
        point = bodyP[i];
        point.add(bodyM[i].toPoint());
        if (point.dist(goal) <= bodyRadius) {
          score += 50 * l;
          bodyM.push(bodyM[l - 1].clone());
          bodyP.push(bodyP[l - 1].clone());
          newGoal();
        }
        if (i > 2 && point.dist(head) < 2 * bodyRadius) return lose("tail");
      }
      if (head.x < bodyRadius || head.x > w - bodyRadius || head.y < bodyRadius || head.y > h - bodyRadius) return lose("wall");
      draw();
      if (playing) aniFrame = requestAnimationFrame(step);
    }
    
    // Corrected draw function to handle lines and contour modes
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, goalSize, 0, Math.PI2, false);
      ctx.strokeStyle = "white";
      ctx.stroke();
    
      if (drawingRef.current.circles) {
        for (let i = 0, l = bodyP.length; i < l; i++) {
          const p = bodyP[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, bodyRadius * 0.8, 0, Math.PI2, false); // Reduced circle size
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
      } else if (drawingRef.current.lines) {
        // Draw the snake as a single horizontal line
        if (bodyP.length > 0) {
          ctx.beginPath();
          const p = bodyP[0];
          ctx.moveTo(p.x - bodyRadius, p.y);
          ctx.lineTo(p.x + bodyRadius, p.y);
          ctx.strokeStyle = "white";
          ctx.lineWidth = bodyRadius * 2;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      } else if (drawingRef.current.contour) {
        // Draw the snake as a filled contour with a semi-circle head and tail
        ctx.beginPath();
        if (bodyP.length > 0) {
            const head = bodyP[0];
            const headM = bodyM[0];
            const headAngle = headM.a;
            
            // Draw a semi-circle at the head
            ctx.arc(head.x, head.y, bodyRadius, headAngle + Math.PI / 2, headAngle - Math.PI / 2, true);
        
            // Draw the line connecting the head to the tail
            ctx.lineTo(bodyP[bodyP.length - 1].x, bodyP[bodyP.length - 1].y);

            // Draw a semi-circle at the tail
            const tail = bodyP[bodyP.length - 1];
            const tailM = bodyM[bodyM.length - 1];
            const tailAngle = tailM.a;
            ctx.arc(tail.x, tail.y, bodyRadius, tailAngle + Math.PI / 2, tailAngle - Math.PI / 2, true);

            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.fill();
        }
      }
    }

    const handleKeyDown = (e) => {
      let preventDefault = true;
      switch (e.keyCode) {
        case 32: if (ingame && playing) { stop(); } else if (!playing) { if (!ingame) start(); else resume(); } break;
        case 40: if (ingame && playing) stop(); break;
        case 38: if (!playing) { if (!ingame) start(); else resume(); } break;
        case 37: kbd.left = true; break;
        case 39: kbd.right = true; break;
        default: preventDefault = false;
      }
      if (preventDefault) e.preventDefault();
    };
    const handleKeyUp = (e) => {
      let preventDefault = true;
      switch (e.keyCode) {
        case 37: kbd.left = false; break;
        case 39: kbd.right = false; break;
        default: preventDefault = false;
      }
      if (preventDefault) e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    const handleResize = () => {
      const canvasContainer = document.querySelector('.snake-canvas-container');
      if (canvasContainer) {
        w = c.width = canvasContainer.clientWidth;
        h = c.height = canvasContainer.clientHeight;
      }
      if (!played) {
        ctx.fillStyle = "#969696";
        ctx.strokeStyle = "white";
        ctx.font = "37px" + fontFamily;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.strokeText("PRESS SPACE OR UP TO START", w * 0.5, h * 0.5);
        ctx.font = "20px" + fontFamily;
        ctx.textBaseline = "top";
        ctx.fillText("Then use left and right arrows to turn and eat everything", w * 0.5, h * 0.5);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      stop();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleModeChange = (mode) => {
    setDrawingMode(mode);
    drawingRef.current = {
      circles: mode === "circles",
      lines: mode === "lines",
      contour: mode === "contour",
    };
  };

  const currentGlowColor = isDarkMode
    ? themes.dark[currentDarkIndex].glow
    : themes.light[currentLightIndex].glow;

  return (
    <div
      className={`snake-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
      style={{ '--neon-glow-color': currentGlowColor }}
    >
      <nav className="snake-navbar">
        <div className="nav-left">
          <Link to={"/games"} className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Games</span>
          </Link>
        </div>

        <div className="nav-center">
          <span className="hiscore-label">HI-SCORE</span>
          <span className="hiscore-value">{hiScore}</span>
        </div>

        <div className="nav-right">
          <div className="theme-switcher-container">
            <button className="theme-switcher" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
          <div className="button-group">
            <button
              className={`mode-button ${drawingMode === "circles" ? "active" : ""}`}
              onClick={() => handleModeChange("circles")}
            >
              Circles
            </button>
            <button
              className={`mode-button ${drawingMode === "lines" ? "active" : ""}`}
              onClick={() => handleModeChange("lines")}
            >
              Lines
            </button>
            <button
              className={`mode-button ${drawingMode === "contour" ? "active" : ""}`}
              onClick={() => handleModeChange("contour")}
            >
              Contour
            </button>
          </div>
        </div>
      </nav>

      <div className="snake-canvas-container">
        <canvas id="c"></canvas>
      </div>

      <div className="notice-pause">
        Use space or down to pause and space or up to resume.
      </div>
    </div>
  );
};

export default SnakeGame;