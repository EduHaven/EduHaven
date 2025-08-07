import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const DifficultySelector = ({ onSelectDifficulty, onBack }) => {
  const difficulties = [
    { level: 'easy', label: 'Easy', color: 'bg-purple-500' },
    { level: 'medium', label: 'Medium', color: 'bg-purple-600' },
    { level: 'hard', label: 'Hard', color: 'bg-purple-700' }
  ];

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
          Back
        </motion.button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-purple-300">Select Difficulty</h2>
      <div className="flex gap-4">
        {difficulties.map(({ level, label, color }) => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${color} hover:opacity-90 text-white px-6 py-3 rounded-lg`}
            onClick={() => onSelectDifficulty(level)}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultySelector;