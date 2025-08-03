import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Sample leaderboard data
const leaderboardData = {
  daily: [
    { rank: 1, name: "John", score: 150, isFriend: true },
    { rank: 2, name: "Jane", score: 140, isFriend: true },
    { rank: 3, name: "Max", score: 130, isFriend: false },
    { rank: 4, name: "Anna", score: 120, isFriend: false },
    { rank: 5, name: "Lucas", score: 110, isFriend: true },
    { rank: 6, name: "Mia", score: 100, isFriend: false },
    { rank: 7, name: "Sophia", score: 95, isFriend: true },
    { rank: 8, name: "Daniel", score: 90, isFriend: false },
    { rank: 9, name: "Olivia", score: 85, isFriend: true },
    { rank: 10, name: "Ethan", score: 80, isFriend: false },
    { rank: 11, name: "Isabella", score: 75, isFriend: false },
    { rank: 12, name: "Liam", score: 70, isFriend: true },
  ],
  weekly: [
    { rank: 1, name: "Alex", score: 700, isFriend: true },
    { rank: 2, name: "Charlie", score: 680, isFriend: false },
    { rank: 3, name: "Sam", score: 650, isFriend: true },
    { rank: 4, name: "Jordan", score: 640, isFriend: false },
    { rank: 5, name: "Blake", score: 620, isFriend: true },
    { rank: 6, name: "Taylor", score: 600, isFriend: true },
    { rank: 7, name: "Ryan", score: 590, isFriend: false },
    { rank: 8, name: "Dakota", score: 580, isFriend: true },
    { rank: 9, name: "Harper", score: 570, isFriend: false },
    { rank: 10, name: "Reed", score: 550, isFriend: true },
    { rank: 11, name: "Morgan", score: 540, isFriend: true },
    { rank: 12, name: "Skyler", score: 530, isFriend: false },
  ],
  monthly: [
    { rank: 1, name: "Sara", score: 3000, isFriend: true },
    { rank: 2, name: "Tom", score: 2900, isFriend: false },
    { rank: 3, name: "Lily", score: 2800, isFriend: true },
    { rank: 4, name: "Chris", score: 2700, isFriend: true },
    { rank: 5, name: "David", score: 2600, isFriend: false },
    { rank: 6, name: "Katie", score: 2500, isFriend: true },
    { rank: 7, name: "James", score: 2400, isFriend: false },
    { rank: 8, name: "Emma", score: 2300, isFriend: true },
    { rank: 9, name: "Matthew", score: 2200, isFriend: false },
    { rank: 10, name: "Olivia", score: 2100, isFriend: true },
    { rank: 11, name: "Daniel", score: 2000, isFriend: false },
    { rank: 12, name: "Jack", score: 1900, isFriend: true },
  ],
};

const Leaderboard = () => {
  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
  const [friendsOnly, setFriendsOnly] = useState(false); // State for "Friends Only" toggle

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false); // Close the dropdown when a selection is made
  };

  const handleFriendsOnlyToggle = () => {
    setFriendsOnly((prev) => !prev); // Toggle the "Friends Only" filter
  };

  // Example: Current user's data (you can get this dynamically)
  const currentUser = {
    name: "You",
    rank: 2,
    score: leaderboardData[view][1]?.score,
  };

  // Filter the leaderboard based on "Friends Only" toggle
  const filteredLeaderboard = leaderboardData[view].filter(
    (entry) => !friendsOnly || entry.isFriend
  );

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
          className={`${
            friendsOnly ? "bg-green-600" : "bg-gray-600"
          } px-4 py-2 rounded-md`}
          onClick={handleFriendsOnlyToggle}
        >
          {friendsOnly ? "On" : "Off"}
        </Button>
      </div>

      <div className="mt-4">
        <ul>
          {filteredLeaderboard.slice(0, 10).map((entry) => (
            <li
              key={entry.rank}
              className={`flex justify-between py-2 px-4 ${
                entry.name === currentUser.name ? "bg-gray-600" : ""
              }`}
            >
              <span>
                {entry.rank}. {entry.name}
              </span>
              <span>{entry.score} points</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Show current user's position at the end */}
      <div className="mt-4 text-lg font-semibold">
        Your Position: {currentUser.rank} - {currentUser.name} (
        {currentUser.score} points)
      </div>
    </div>
  );
};

export default Leaderboard;
