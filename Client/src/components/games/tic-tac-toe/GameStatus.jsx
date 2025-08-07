import React from 'react';
import { motion } from 'framer-motion';

const GameStatus = ({ winner, xIsNext }) => {
  const renderStatus = () => {
    if (winner === 'tie') return 'Game is a tie!';
    if (winner) return `Winner: ${winner}`;
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xl mb-4 text-purple-100"
    >
      {renderStatus()}
    </motion.div>
  );
};

export default GameStatus;