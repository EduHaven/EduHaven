export function getInitialBoard(size: number) {
  return Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));
}

export function getMaxQueens(size: number) {
  return size;
}

// Validate no two queens attack each other
export function isValidBoard(board: number[][]) {
  const n = board.length;
  const directions = [
    [-1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
  ];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 1) {
        for (const [dr, dc] of directions) {
          let rr = r + dr;
          let cc = c + dc;
          while (rr >= 0 && rr < n && cc >= 0 && cc < n) {
            if (board[rr][cc] === 1) return false;
            rr += dr;
            cc += dc;
          }
        }
      }
    }
  }
  return true;
}

// Return positions of queens that conflict to highlight red
export function getInvalidPositions(board: number[][]): Set<string> {
  const n = board.length;
  const conflicts = new Set<string>();
  const directions = [
    [-1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 1) {
        for (const [dr, dc] of directions) {
          let rr = r + dr;
          let cc = c + dc;
          while (rr >= 0 && rr < n && cc >= 0 && cc < n) {
            if (board[rr][cc] === 1) {
              conflicts.add(`${r}-${c}`);
              conflicts.add(`${rr}-${cc}`);
            }
            rr += dr;
            cc += dc;
          }
        }
      }
    }
  }
  return conflicts;
}
