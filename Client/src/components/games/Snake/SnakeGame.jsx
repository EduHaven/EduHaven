import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import styles from "./snake.module.css";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChevronDown = ({ size = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className={styles.line}>
      <span className={styles.toggleLabel}>{label}</span>
      <div
        className={styles.toggleTrack}
        style={{ backgroundColor: checked ? "var(--btn)" : "#cccccc" }} // Keep dynamic background color
        onClick={(e) => {
          e.stopPropagation(); // Prevent dropdown from closing
          onChange(!checked);
        }}
      >
        <div
          className={styles.toggleThumb}
          style={{ transform: checked ? "translateX(22px)" : "translateX(0)" }} // Keep dynamic transform
        ></div>
      </div>
    </div>
  );
};

const SnakeGame = () => {
  const root = document.documentElement; // or any container element
  const txtDim = getComputedStyle(root).getPropertyValue("--txt").trim();

  const [hiScore, setHiScore] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [gameMode, setGameMode] = useState("settings");

  // CHANGED: RENAMED 'settings' TO 'drawingOptions' TO MATCH GAME LOGIC AND ADDED CORRECT KEYS
  const [drawingOptions, setDrawingOptions] = useState({
    contour: true,
    circles: false,
    lines: false,
  });
  const dropdownRef = useRef(null);

  // CHANGED: ADDED GAME MODES TO THE DROPDOWN LIST
  const dropdownOptions = [
    { type: "setting", label: "Circles", key: "circles" },
    { type: "setting", label: "Lines", key: "lines" },
    { type: "setting", label: "Contour", key: "contour" },
  ];

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handler for changing game mode
  const handleModeClick = (option) => {
    setGameMode(option.label);
    setIsOpen(false); // Close dropdown when a mode is selected
  };

  const handleDrawingChange = (key) => {
    // This directly manipulates the `drawing` object in the game's scope
    // This is a necessary workaround because the game logic is not React-driven
    if (window.drawing) {
      window.drawing[key] = !window.drawing[key];
    }
    setDrawingOptions((prevOptions) => ({
      ...prevOptions,
      [key]: !prevOptions[key],
    }));
  };

  // fetches the prev hi score on mount
  useEffect(() => {
    const prevHiScore = localStorage.getItem("snakeHiScore");
    if (prevHiScore) {
      setHiScore(parseInt(prevHiScore));
    }
  }, []);

  useEffect(() => {
    Math.PI2 = 2 * Math.PI;
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (function () {
        return (
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
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
          window.mozCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
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
    function Point(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    Point.prototype = {
      clone: function () {
        return new Point(this.x, this.y);
      },
      add: function (p) {
        this.x += p.x;
        this.y += p.y;
        return this;
      },
      sub: function (p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
      },
      dist: function (p) {
        var x = p.x - this.x,
          y = p.y - this.y;
        return Math.sqrt(x * x + y * y);
      },
      toPolar: function () {
        return new Polar(
          Math.atan2(this.y, this.x),
          Math.sqrt(this.y * this.y + this.x * this.x)
        );
      },
    };
    function Polar(a, d) {
      this.a = a;
      this.d = d;
      return this;
    }
    Polar.prototype = {
      set: function (p, v) {
        this[p] = v;
        return this;
      },
      clone: function () {
        return new Polar(this.a, this.d);
      },
      multiply: function (f) {
        this.d *= f;
        return this;
      },
      toPoint: function () {
        return new Point(this.d * Math.cos(this.a), this.d * Math.sin(this.a));
      },
    };
    var scoreFont = " Verdana, Geneva, sans-serif";
    var fontFamily = ' "Merriweather Sans", sans-serif';
    $(document).ready(function () {
      var $c = $("#c"),
        c = $c[0],
        ctx = c.getContext("2d"),
        w = c.width,
        h = c.height,
        played = false,
        ingame = false,
        playing = false,
        aniFrame;
      var kbd = { left: false, right: false };
      /* P for positions, M for movements */
      var goal,
        goalSize,
        bodyP = [],
        bodyM = [],
        bodyRadius,
        rotSpeed,
        density,
        score;
      // CHANGED: ATTACHED 'drawing' TO WINDOW SCOPE FOR REACT TO ACCESS
      var drawing = (window.drawing = {
        circles: false,
        lines: false,
        contour: true,
      });

      function newGoal() {
        var p,
          ok = false,
          rect = {
            x: { min: 2 * bodyRadius, max: w - 2 * bodyRadius },
            y: { min: 2 * bodyRadius, max: h - 2 * bodyRadius },
          },
          i,
          len = bodyP.length;
        while (!ok) {
          p = new Point(
            randomBetween(rect.x.min, rect.x.max),
            randomBetween(rect.y.min, rect.y.max)
          );
          ok = true;
          // Prevent giving free candies
          // Comment the following loop if you don't mind
          for (i = 0; i < len; i++)
            if (p.dist(bodyP[i]) <= bodyRadius) {
              ok = false;
              break;
            }
        }
        goalSize = 200;
        ctx.strokeStyle = txtDim;
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
        var text = "GAME OVER";
        if (source == "tail") text = "OH SNAKE, WHY DID YOU EAT YOURSELF ?!";
        if (source == "wall") text = "THERE'S A WALL DOWN THERE";
        ctx.fillText(text, w * 0.5, h * 0.5);
        /* Prevent photoshopping */
        ctx.font = "30px" + scoreFont;
        var rScore = Math.round(score);

        // Update high score if beaten
        if (rScore > hiScore) {
          localStorage.setItem("snakeHiScore", rScore);
          setHiScore(rScore);
        }
        ctx.textBaseline = "middle";
        ctx.save();
        ctx.translate(w * 0.5, h * 0.5 + 15);
        for (var i = 0, n = 5; i < n; i++) {
          ctx.save();
          ctx.fillStyle = "rgba(0,0,0," + (i + 1) / (n * 3) + ")";
          ctx.translate(randomBetween(-5, 5), randomBetween(-5, 5));
          ctx.rotate(randomBetween(-Math.PI * 0.1, Math.PI * 0.1));
          var s = randomBetween(0.9, 1.2);
          ctx.scale(s, s);
          ctx.fillText(rScore, 0, 0);
          ctx.restore();
        }
        ctx.fillStyle = txtDim;
        ctx.fillText(rScore, 0, 0);
        ctx.restore();
      }
      function resume() {
        if (playing) return;
        playing = true;
        step();
      }
      function stop() {
        cancelAnimationFrame(aniFrame);
        playing = false;
      }
      function step() {
        if (!playing) return;
        score = Math.max(0, score - 0.005 * bodyP.length);
        goalSize = comeCloser(goalSize, 1, 15);
        if (kbd.left) bodyM[0].a -= rotSpeed;
        if (kbd.right) bodyM[0].a += rotSpeed;
        bodyM[0].a %= Math.PI2;
        var i,
          l,
          point,
          head = bodyP[0];
        for (i = 1, l = bodyM.length; i < l; i++)
          bodyM[i] = bodyP[i]
            .clone()
            .sub(bodyP[i - 1])
            .toPolar()
            .multiply(-density);
        for (i = 0, l = bodyP.length; i < l; i++) {
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
        if (
          head.x < bodyRadius ||
          head.x > w - bodyRadius ||
          head.y < bodyRadius ||
          head.y > h - bodyRadius
        )
          return lose("wall");
        draw();
        if (playing) aniFrame = requestAnimationFrame(step);
      }
      function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.font = "20px" + scoreFont; // Increase font size
        ctx.textAlign = "right"; // Align text to the right
        ctx.textBaseline = "top"; // Keep it at the top
        ctx.fillStyle = txtDim;
        ctx.fillText(Math.round(score), w - 20, 20);
        ctx.beginPath();
        ctx.arc(goal.x, goal.y, goalSize, 0, Math.PI2, false);
        ctx.strokeStyle = txtDim;
        ctx.stroke();

        var p, i, l;
        if (drawing.circles) {
          for (i = 0, l = bodyP.length; i < l; i++) {
            p = bodyP[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, bodyRadius, 0, Math.PI2, false);
            ctx.strokeStyle = txtDim;
            ctx.stroke();
          }
        }
        if (drawing.lines) {
          ctx.beginPath();
          p = bodyP[0]
            .clone()
            .add(bodyM[0].clone().set("d", bodyRadius).toPoint());
          ctx.moveTo(p.x, p.y);
          for (i = 0, l = bodyP.length; i < l; i++) {
            p = bodyP[i];
            ctx.lineTo(p.x, p.y);
          }
          p = bodyP[l - 1]
            .clone()
            .add(bodyM[l - 1].clone().set("d", bodyRadius).toPoint());
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = txtDim;
          ctx.stroke();
        }
        if (drawing.contour) {
          ctx.beginPath();
          p = bodyP[0];
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(bodyM[0].a + Math.PI * 0.5);
          ctx.arc(0, 0, bodyRadius, 0, Math.PI, true);
          ctx.restore();
          for (i = 1, l = bodyP.length; i < l; i++) {
            p = bodyP[i];
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(bodyM[i].a);
            ctx.lineTo(0, bodyRadius);
            ctx.restore();
          }
          p = bodyP[l - 1];
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(bodyM[l - 1].a + Math.PI * 0.5);
          ctx.arc(0, 0, bodyRadius, 0, Math.PI, true);
          ctx.restore();
          for (i = l - 1; i > 0; i--) {
            p = bodyP[i];
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(bodyM[i].a);
            ctx.lineTo(0, -bodyRadius);
            ctx.restore();
          }
          ctx.closePath();
          ctx.strokeStyle = txtDim;
          ctx.stroke();
        }
      }

      $(document)
        .keydown(function (e) {
          var preventDefault = true;
          switch (e.keyCode) {
            case 32:
              if (ingame && playing) {
                stop();
                break;
              }
              if (!playing)
                if (!ingame) start();
                else resume();
              break;
            case 40:
              if (ingame && playing) stop();
              break;
            case 38:
              if (!playing)
                if (!ingame) start();
                else resume();
              break;
            case 37:
              kbd.left = true;
              break;
            case 39:
              kbd.right = true;
              break;
            default:
              preventDefault = false;
          }
          if (preventDefault) e.preventDefault();
        })
        .keyup(function (e) {
          var preventDefault = true;
          switch (e.keyCode) {
            case 37:
              kbd.left = false;
              break;
            case 39:
              kbd.right = false;
              break;
            default:
              preventDefault = false;
          }
          if (preventDefault) e.preventDefault();
        });
      $(window)
        .resize(function () {
          w = c.width = $c.width();
          h = c.height = $c.height();
          if (!played) {
            ctx.fillStyle = txtDim;
            ctx.strokeStyle = txtDim;
            ctx.font = "37px" + fontFamily;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            ctx.fillText("PRESS SPACE OR UP TO START", w * 0.5, h * 0.5);

            ctx.font = "20px" + fontFamily;
            ctx.textBaseline = "top";
            ctx.fillText(
              "Then use left and right arrows to turn and eat everything",
              w * 0.5,
              h * 0.5
            );
          }
        })
        .resize(); // Trigger resize function on initial load

      // REMOVED: OLD JQUERY EVENT HANDLERS FOR CHECKBOXES
    });
  }, [hiScore, txtDim]); // ADDED HISCORE TO DEPENDENCY ARRAY

  return (
    <div className={styles.snakeGame}>
      <nav className="px-6 flex items-center justify-between w-full">
        <Button
          onClick={() => window.history.back()}
          variant="secondary"
          className="flex items-center gap-2 px-3 py-2 text-[txtDim] bg-[var(--bg-ter)] rounded-lg text-base font-medium hover:bg-ter hover:text-[var(--txt)] shadow-sm"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className={styles.hiScore}>High Score: {hiScore}</div>
        {/* REMOVED UNNECESSARY WRAPPER DIVS AND CORRECTED className USAGE */}
        <div className={styles.customDropdown} ref={dropdownRef}>
          <div
            className={styles.dropdownHeader}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{gameMode}</span>
            <ChevronDown
              size={20}
              className={`${styles.chevron} ${
                isOpen ? styles.chevronOpen : ""
              }`}
            />
          </div>
          {isOpen && (
            <div className={styles.dropdownList}>
              {dropdownOptions.map((option) => {
                if (option.type === "setting") {
                  return (
                    <div
                      key={option.key}
                      className={styles.dropdownItemNoHover}
                    >
                      <ToggleSwitch
                        label={option.label}
                        checked={drawingOptions[option.key]}
                        onChange={() => handleDrawingChange(option.key)}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={option.label}
                    className={styles.dropdownItem}
                    onClick={() => handleModeClick(option)}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <canvas className={`flex-1 ${styles.canvas}`} id="c"></canvas>

      <div className={styles.noticePause}>
        Use space or down to pause and space or up to resume.
      </div>
    </div>
  );
};

export default SnakeGame;
