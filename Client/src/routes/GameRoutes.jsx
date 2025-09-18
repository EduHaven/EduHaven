import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load game components
const GameRoom = lazy(() => import("../components/gameRoomComponents/GameRoom"));
const TicTacToe = lazy(() => import("../components/games/tic-tac-toe/TicTacToe.jsx"));
const Snake = lazy(() => import("../components/games/Snake/SnakeGame.jsx"));
const SpaceType = lazy(() => import("../components/games/space-type/SpaceType"));
const Whacamole = lazy(() => import("@/components/games/whac-a-mole/Whacamole"));
const Sudoku = lazy(() => import("@/components/games/sudoku/Sudoku"));
const Game2048 = lazy(() => import("@/components/games/2048/Game2048"));

// Loading component for games
const GameLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading game...</p>
    </div>
  </div>
);

const GameRoutes = () => {
  return (
    <Suspense fallback={<GameLoadingSpinner />}>
      <Routes>
        <Route index element={<GameRoom />} />
        <Route path="tic-tac-toe" element={<TicTacToe />} />
        <Route path="sudoku" element={<Sudoku />} />
        <Route path="snake" element={<Snake />} />
        <Route path="space-type" element={<SpaceType />} />
        <Route path="whac-a-mole" element={<Whacamole />} />
        <Route path="2048" element={<Game2048 />} />
      </Routes>
    </Suspense>
  );
};

export default GameRoutes;
