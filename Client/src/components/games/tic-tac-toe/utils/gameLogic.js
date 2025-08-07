// Check for winner
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  if (squares.every(square => square)) {
    return { winner: 'tie', line: null };
  }

  return { winner: null, line: null };
};

// Bot move logic
export const getBotMove = (squares, difficulty) => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(squares);
    case 'medium':
      return getMediumMove(squares);
    case 'hard':
      return getMinimaxMove(squares);
    default:
      return getRandomMove(squares);
  }
};

// Easy: Random move
const getRandomMove = (squares) => {
  const availableMoves = squares
    .map((square, index) => !square ? index : null)
    .filter(move => move !== null);
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Medium: Basic strategy
const getMediumMove = (squares) => {
  // Try to win
  const winMove = findWinningMove(squares, 'O');
  if (winMove !== null) return winMove;

  // Block opponent
  const blockMove = findWinningMove(squares, 'X');
  if (blockMove !== null) return blockMove;

  // Take center if available
  if (!squares[4]) return 4;

  // Random move
  return getRandomMove(squares);
};

// Helper for medium difficulty
const findWinningMove = (squares, player) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    const squaresCopy = [...squares];
    if (!squaresCopy[a] && squaresCopy[b] === player && squaresCopy[c] === player) return a;
    if (squaresCopy[a] === player && !squaresCopy[b] && squaresCopy[c] === player) return b;
    if (squaresCopy[a] === player && squaresCopy[b] === player && !squaresCopy[c]) return c;
  }

  return null;
};

// Hard: Minimax algorithm
const getMinimaxMove = (squares) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = 'O';
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
  
  if (result.winner === 'O') return 10 - depth;
  if (result.winner === 'X') return depth - 10;
  if (result.winner === 'tie') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'X';
        bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return bestScore;
  }
};