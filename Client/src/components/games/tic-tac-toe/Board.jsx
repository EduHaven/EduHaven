import React from 'react';
import { motion } from 'framer-motion';
import Cell from './Cell';

const Board = ({ squares, onClick, winningLine }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-3 gap-2 max-w-[400px] mx-auto"
    >
      {squares.map((square, i) => (
        <Cell
          key={i}
          value={square}
          onClick={() => onClick(i)}
          isWinning={winningLine?.includes(i)}
        />
      ))}
    </motion.div>
  );
};

export default Board;