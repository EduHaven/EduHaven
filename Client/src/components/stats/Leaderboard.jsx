import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const backendUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Leaderboard = () => {
  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false);
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);


  const getCurrentUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  useEffect(() => {
    const id = getCurrentUserIdFromToken();
    setCurrentUserId(id);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${backendUrl}/leaderboard?period=${view}&friendsOnly=${friendsOnly}`, getAuthHeader());
        console.log(res)
        const data = await res.data;
        console.log(data)
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [friendsOnly,view]);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  const handleFriendsOnlyToggle = () => {
    setFriendsOnly((prev) => !prev);
  };

  const currentUser = leaderboard.find((user) => user.userId === currentUserId);

  return (
    <div className="bg-gray-800 p-6 pl-0 rounded-3xl shadow-md text-center w-full">
      <nav className="flex justify-between items-center pl-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <strong>Leaderboard</strong>
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1 hover:bg-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </nav>

      {/* Friends Only Toggle */}
      <div className="mt-4 flex pl-6 items-center gap-2">
      <label className="text-sm text-gray-300">Friends Only</label>
        <Button
          variant="outline"
          onClick={handleFriendsOnlyToggle}
          className={`relative w-14 h-8 rounded-full px-0 border-2 transition-all duration-200 ${friendsOnly ? "bg-green-500 border-green-600" : "bg-gray-600 border-gray-500"
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-200 ${friendsOnly ? "translate-x-6" : ""
              }`}
          ></span>
        </Button>

      </div>

      <div className="mt-4">
        <ul className="divide-y divide-gray-700 rounded-lg overflow-hidden">
          {leaderboard.slice(0, 10).map((user, index) => {
            const isCurrentUser = user.userId === currentUserId;

            const getBadge = (rank) => {
              switch (rank) {
                case 0:
                  return "🥇";
                case 1:
                  return "🥈";
                case 2:
                  return "🥉";
                default:
                  return `${rank + 1}.`;
              }
            };

            return (
              <li
                key={user.userId}
                className={`flex justify-between items-center py-3 px-5 transition-all duration-200
        ${isCurrentUser ? "bg-green-700 text-white font-semibold" : "hover:bg-gray-700"}
      `}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 text-right">
                    {getBadge(index)}
                  </span>
                  <span>{user.username}</span>
                </span>
                <span className="text-sm">{user.totalDuration} minutes</span>
              </li>
            );
          })}

        </ul>
      </div>


      {currentUserId && currentUser && (
        <div className="mt-4 text-lg font-semibold">
          Your Position: {leaderboard.findIndex(u => u.userId === currentUserId) + 1} -{" "}
          ({currentUser.totalDuration} minutes)
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
