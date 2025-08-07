import { Trophy, Medal } from "lucide-react";

const Achievements = () => {
  return (
    <div className="bg-gray-800 rounded-3xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold">Achievements</h3>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center gap-3">
          <Medal className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300">Completed 100 Coding Challenges</span>
        </li>
        <li className="flex items-center gap-3">
          <Medal className="w-5 h-5 text-purple-400" />
          <span className="text-gray-300">Top 10 in Monthly Hackathon</span>
        </li>
        <li className="flex items-center gap-3">
          <Medal className="w-5 h-5 text-green-400" />
          <span className="text-gray-300">Achieved Level 7 in Analytics</span>
        </li>
      </ul>
    </div>
  );
};

export default Achievements;
