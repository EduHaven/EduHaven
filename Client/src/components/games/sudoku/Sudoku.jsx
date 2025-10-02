import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import {
  generatePuzzle,
  DIFFICULTY_PRESETS,
  countEmptyCells,
  cloneBoard,
  boardsEqual,
} from "./sudokuUtils";
import styles from "./Sudoku.module.css";
import PopupContainer from "@/components/ui/Popup";

const formatTime = (s) => {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("medium");
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(difficulty));
  const [solution, setSolution] = useState(puzzle.solution);
  const [board, setBoard] = useState(puzzle.board);
  const [fixed, setFixed] = useState(puzzle.fixed);
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [hintsLeft, setHintsLeft] = useState(
    DIFFICULTY_PRESETS[difficulty].hints
  );
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const [showHowToPlay, setShowHowToPlay] = useState(false); // ✅ New state
  const timerRef = useRef(null);

  const emptyCount = countEmptyCells(board);

  // Start/reset timer on puzzle change
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [puzzle]);

  // Keyboard input handling
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const { r, c } = selected;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dr = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
        const dc = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
        setSelected({ r: (r + dr + 9) % 9, c: (c + dc + 9) % 9 });
        return;
      }
      if (fixed[r][c]) return;
      if (/^[1-9]$/.test(e.key)) {
        const val = Number(e.key);
        setBoard((prev) => {
          const next = cloneBoard(prev);
          next[r][c] = val;
          return next;
        });
        setStatus("");
      }
      if (["Backspace", "Delete", "0"].includes(e.key)) {
        setBoard((prev) => {
          const next = cloneBoard(prev);
          next[r][c] = 0;
          return next;
        });
        setStatus("");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, fixed]);

  const handleNewPuzzle = (lvl) => {
    const newPuzzle = generatePuzzle(lvl);
    setDifficulty(lvl);
    setPuzzle(newPuzzle);
    setSolution(newPuzzle.solution);
    setBoard(newPuzzle.board);
    setFixed(newPuzzle.fixed);
    setHintsLeft(DIFFICULTY_PRESETS[lvl].hints);
    setStatus("");
  };

  const handleHint = () => {
    if (hintsLeft <= 0) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          setBoard((prev) => {
            const next = cloneBoard(prev);
            next[r][c] = solution[r][c];
            return next;
          });
          setHintsLeft((h) => h - 1);
          setStatus("");
          setTimeout(() => {
            if (boardsEqual(board, solution)) {
              setStatus("complete");
              if (timerRef.current) clearInterval(timerRef.current);
            }
          }, 0);
          return;
        }
      }
    }
  };

  const handleValidate = () => {
    const conflicts = validateConflicts(board, solution);
    if (conflicts) {
      setStatus("conflict");
    } else {
      if (boardsEqual(board, solution)) {
        setStatus("complete");
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setStatus("correct");
      }
    }
  };

  const handleCheckSolution = () => {
    setBoard(cloneBoard(solution));
    setStatus("complete");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const validateConflicts = (board, solution) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0 && board[r][c] !== solution[r][c]) {
          return true;
        }
      }
    }
    return false;
  };

  const levelOptions = Object.keys(DIFFICULTY_PRESETS);

  return (
    <main className={styles.appContainer}>
      <nav className={styles.gameHeader}>
        <div className={styles.topBar}>
          <div className={styles.navSection}>
            <button
              onClick={() => window.history.back()}
              className={styles.iconButton}
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>
          <div className={`${styles.navSection} ${styles.navCenter}`}>
            <h1 className={styles.navbarTitle}>Sudoku</h1>
          </div>
          <div className={`${styles.navSection} ${styles.navRight}`}>
            <button className={styles.iconButton} aria-label="Toggle Sound">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.controlsBar}>
          <div className={styles.gameStats}>
            <span>⏱ {formatTime(seconds)}</span>
            <span>Empty: {emptyCount}</span>
            <span>Hints: {hintsLeft}</span>
          </div>
          <div className={styles.difficultyControl}>
            <span>Difficulty:</span>
            <div className={styles.segmentedControl}>
              {levelOptions.map((lvl) => (
                <button
                  key={lvl}
                  className={difficulty === lvl ? styles.active : ""}
                  onClick={() => handleNewPuzzle(lvl)}
                >
                  {DIFFICULTY_PRESETS[lvl].label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowHowToPlay(true)}
            className={styles.howToPlayBtn}
          >
            How to Play
          </button>
        </div>
      </nav>

      <div className={styles.gameWrapper}>
        <Board
          board={board}
          fixed={fixed}
          selected={selected}
          onSelect={setSelected}
        />

        <div className={styles.gameActions}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => handleNewPuzzle(difficulty)}
          >
            New Puzzle
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleHint}
            disabled={hintsLeft <= 0}
          >
            Hint
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleValidate}
          >
            Validate
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleCheckSolution}
          >
            Check Solution
          </button>

          {status === "complete" && (
            <span
              className={`${styles.statusMessage} ${styles.statusComplete}`}
            >
              Solved! 🎉
            </span>
          )}
          {status === "conflict" && (
            <span
              className={`${styles.statusMessage} ${styles.statusConflict}`}
            >
              Conflicts found
            </span>
          )}
          {status === "correct" && (
            <span className={`${styles.statusMessage} ${styles.statusCorrect}`}>
              Looks good so far
            </span>
          )}
        </div>
      </div>

      {showHowToPlay && (
        <PopupContainer
          title="How to Play Sudoku"
          onClose={() => setShowHowToPlay(false)}
        >
          <ul className="list-disc pl-5 space-y-2 txt">
            <li>
              Fill the board so that each row, column, and 3x3 grid has numbers
              1–9.
            </li>
            <li>Each number can appear only once in a row, column, or grid.</li>
            <li>Use logic, not guessing, to solve the puzzle.</li>
            <li>Hints will reveal a correct number if you’re stuck.</li>
            <li>The game ends when the board is correctly filled.</li>
          </ul>
        </PopupContainer>
      )}
    </main>
  );
}
