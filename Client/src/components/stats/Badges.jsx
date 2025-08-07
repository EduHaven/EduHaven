import { Award } from "lucide-react";

const Badges = () => {
  // Create an array of 10 dummy badges.
  const badges = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-gray-800 rounded-3xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-4 text-center">Badges Earned</h3>
      <div className="grid grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div key={badge} className="flex flex-col items-center">
            <Award className="w-8 h-8 text-yellow-500" />
            <p className="text-xs text-gray-400 mt-1">Badge {badge}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
