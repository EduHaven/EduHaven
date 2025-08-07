import React from 'react';
import { motion } from 'framer-motion';

const Cell = ({ value, onClick, isWinning }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`board-cell ${isWinning ? 'winning-cell' : ''}`}
      onClick={onClick}
    >
      {value && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={value === 'X' ? 'text-purple-400' : 'text-purple-300'}
        >
          {value}
        </motion.span>
      )}
    </motion.div>
  );
};

export default Cell;