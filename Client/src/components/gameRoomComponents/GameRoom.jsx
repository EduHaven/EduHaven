import LionComponent from "./LionComponent";
import { Link } from "react-router-dom";

import SnakeIcon from "../../assets/icon/SnakeIcon";
import SpaceTypeIcon from "../../assets/icon/SpaceTypeIcon";
import TicTacToeIcon from "../../assets/icon/TicTacToeIcon";
import WacAMole from "@/assets/icon/WacAMole";
import SudokuIcon from "../../assets/icon/SudokuIcon.jsx";
import Game2048Icon from "@/assets/icon/Game2048Icon";

function GameRoom() {
  const games = [
    {
      name: "Space-Type",
      path: "space-type",
      Icon: SpaceTypeIcon,
    },
    {
      name: "Hungry Snake",
      path: "snake",
      Icon: SnakeIcon,
    },
    {
      name: "Tic-Tac-Toe",
      path: "tic-tac-toe",
      Icon: TicTacToeIcon,
    },
    {
      name: "Whac-a-mole",
      path: "whac-a-mole",
      Icon: WacAMole,
    },
    {
      name: "2048",
      path: "2048",
      Icon: Game2048Icon,
    },
    {
      name: "Sudoku",
      path: "sudoku",
      Icon: SudokuIcon,
    },
  ];

  return (
    <div className="m-6  bg-[hsl(var(--background))] txt transition-colors duration-300 overflow-x-hidden">
      <h1 className="text-2xl font-bold txt">Game Room</h1>
      <div className="relative w-[svw] h-[50vh] pb-5">
        <div className="absolute h-1/2 w-[calc(100vw-6rem)] right-0">
          <div className="relative bottom-[100%] left-[30%]">
            <LionComponent />
          </div>
        </div>
        <div className="flex flex-col justify-center h-full z-10 relative">
          <h1 className="text-[5vw] font-extrabold text-[var(--btn-hover)] py-3 md:px-28 select-none">
            Enough grinding,
          </h1>
          <h2 className="text-[4vw] font-semibold text-[var(--txt-disabled)] py-3 md:px-28 select-none">
            time to chill & relax!
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {games.map(({ name, path, Icon }) => (
          <Link
            key={name}
            to={path}
            className="txt-dim hover:border-[var(--bg-ter)] border border-transparent rounded-3xl transition duration-200 p-4"
          >
            {Icon && (
              <div className="p-12 opacity-90 flex items-center justify-center bg-sec rounded-3xl">
                <Icon className="w-24 h-24" />
              </div>
            )}
            <div className="flex flex-col flex-1 justify-center p-2 bg-te r">
              <h3 className="text-lg font-semibold txt pb-1">{name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameRoom;
