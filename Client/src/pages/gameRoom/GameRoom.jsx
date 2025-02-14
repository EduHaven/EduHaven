import { useState, useEffect } from "react";
import { Trophy, Users, Star } from "lucide-react";
import LionComponent from "./LionComponent";
import { Link } from "react-router-dom";
import GameRoomShimmer from "../../components/shimmerUI/shimmerGames";

function GameRoom() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      setGames([
        { name: "Space-Type-2", difficulty: "Medium", path: "space-type-2", img: "./spaceType.svg" },
        { name: "Hungry Snake", difficulty: "Easy", path: "snake", img: "./snake.svg" },
        { name: "Tic-Tac-Toe", difficulty: "Medium", path: "tic-tac-toe", img: "./ticTacToe.svg" },
        { name: "typing-game-old", difficulty: "Medium", path: "typing-game", img: "./spaceType.svg" },
      ]);
      setLoading(false);
    };

    fetchGames();
  }, []);

  return (
    <>
      {loading ? (
        <GameRoomShimmer />
      ) : (
        <>
          {/* Navbar */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Game Room</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                <span>1,234 points</span>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="w-[svw] h-[50vh] pb-5">
            <div className="absolute h-1/2 w-[calc(100vw-6rem)] right-0 overflow-hidden ">
              <div className="relative bottom-[45%] left-[30%]">
                <LionComponent />
              </div>
            </div>
            <div className=" flex flex-col justify-center h-full">
              <h1 className="relative text-[5vw] font-extrabold text-purple-500 py-3 px-28 select-none">
                Enough grinding,
              </h1>
              <h2 className="relative text-[4vw] font-semibold text-purple-200 py-3 px-28 select-none">
                time to chill & relax!
              </h2>
            </div>
          </div>

          {/* Games Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            {games.map((game) => (
              <Link
                key={game.name}
                to={game.path}
                className="bg-gray-800 flex gap-3 break-words p-6 rounded-xl transition duration-200 hover:scale-105 shimmer-box"
              >
                {game.img && (
                  <img
                    src={game.img}
                    alt={`${game.name} thumbnail`}
                    className="h-full p-4 opacity-90"
                  />
                )}
                <div className="flex flex-col flex-1 justify-center p-4 h-[130px]">
                  <h3 className="text-xl font-bold pb-1">{game.name}</h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Users className="w-4 h-4" />
                    <span>single-player</span>
                  </div>
                  <div className="flex">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= game.difficulty.length
                            ? "text-yellow-500"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Breathing Space */}
          <div className="h-[200px]"></div>
        </>
      )}
    </>
  );
}

export default GameRoom;

