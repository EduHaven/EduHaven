import React from 'react';

const ScoreBoard = ({ scores }) => {
  return (
    <div className="flex gap-8 mb-4">
      <div className="text-center">
        <div className="text-purple-400 font-bold">Player X</div>
        <div className="text-2xl text-purple-300">{scores.X}</div>
      </div>
      <div className="text-center">
        <div className="text-purple-400 font-bold">Player O</div>
        <div className="text-2xl text-purple-300">{scores.O}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;