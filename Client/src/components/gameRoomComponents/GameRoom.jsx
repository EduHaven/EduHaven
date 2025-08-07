import React from "react";
import { Trophy, Users, Star } from "lucide-react";
import LionComponent from "./LionComponent";
import { Link } from "react-router-dom";

import SnakeIcon from "..//../assets/icon/SnakeIcon"
import SpaceTypeIcon from "../../assets/icon/SpaceTypeIcon";
import TicTacToeIcon from "../../assets/icon/TicTacToeIcon";

function GameRoom() {
  const games = [
    {
      name: "Space-Type-2",
      difficulty: "Medium",
      path: "space-type-2",
      Icon: SpaceTypeIcon,
    },
    {
      name: "Hungry Snake",
      difficulty: "Easy",
      path: "snake",
      Icon: SnakeIcon,
    },
    {
      name: "Tic-Tac-Toe",
      difficulty: "Medium",
      path: "tic-tac-toe",
      Icon: TicTacToeIcon,
    },
    {
      name: "typing-game-old",
      difficulty: "Medium",
      path: "typing-game",
      Icon: SpaceTypeIcon,
    },
    {
      name: "Whac-a-mole",
      difficulty: "Medium",
      path: "whac-a-mole",
      Icon: SpaceTypeIcon, // Using SpaceTypeIcon here as svg was not available
    },
  ];

  return (
    <div className="m-6 min-h-screen bg-[hsl(var(--background))] txt transition-colors duration-300">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold txt">Game Room</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-ter px-4 py-2 rounded-xl">
            <Trophy className="text-[hsl(var(--accent))]" />
            <span className="txt-dim">1,234 points</span>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative w-[svw] h-[50vh] pb-5 overflow-hidden">
        <div className="absolute h-1/2 w-[calc(100vw-6rem)] right-0">
          <div className="relative bottom-[45%] left-[30%]">
            <LionComponent />
          </div>
        </div>
        <div className="flex flex-col justify-center h-full z-10 relative">
          <h1 className="text-[5vw] font-extrabold text-[hsl(var(--accent))] py-3 px-28 select-none">
            Enough grinding,
          </h1>
          <h2 className="text-[4vw] font-semibold text-[hsl(var(--accent)/0.6)] py-3 px-28 select-none">
            time to chill & relax!
          </h2>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        {games.map(({ name, difficulty, path, Icon }) => (
          <Link
            key={name}
            to={path}
            className="bg-sec txt-dim hover:bg-ter rounded-xl transition duration-200 hover:scale-105 flex gap-3 p-6"
          >
            {Icon && (
              <div className="p-4 opacity-90 flex items-center justify-center">
                <Icon className="w-16 h-16 text-[hsl(var(--accent))]" />
              </div>
            )}
            <div className="flex flex-col flex-1 justify-center h-[130px]">
              <h3 className="text-xl font-bold txt pb-1">{name}</h3>

              <div className="flex items-center gap-2 text-sm mb-4">
                <Users className="w-4 h-4" />
                <span>single-player</span>
              </div>

              <div className="flex">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= difficulty.length ? "text-yellow-400" : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Spacer */}
      <div className="h-[200px]"></div>
    </div>
  );
}

export default GameRoom;
