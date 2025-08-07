import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const GameControls = ({ onNewGame, onMainMenu }) => {
  return (
    <div className="flex gap-4 mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
        onClick={onNewGame}
      >
        <RotateCcw size={20} />
        New Game
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg"
        onClick={onMainMenu}
      >
        Main Menu
      </motion.button>
    </div>
  );
};

export default GameControls;