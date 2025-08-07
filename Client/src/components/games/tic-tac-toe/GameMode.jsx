import React from 'react';
import { motion } from 'framer-motion';
import { Notebook as Robot, Users, ArrowLeft } from 'lucide-react';

const GameMode = ({ onSelectMode, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="w-full flex justify-start mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-purple-100"
        >
          <ArrowLeft size={24} />
          Back to Games
        </motion.button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-purple-300">Choose Game Mode</h1>
      
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 p-6 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
          onClick={() => onSelectMode('bot')}
        >
          <Robot size={48} />
          <span>vs Computer</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 p-6 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
          onClick={() => onSelectMode('player')}
        >
          <Users size={48} />
          <span>vs Player</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameMode;