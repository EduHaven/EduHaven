import { useEffect, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All",
  "study-room",
  "general",
  "Tech",
  "Science",
  "Language-learning",
  "Professional",
  "Career-development",
  "Industry-Deep-dives",
  "Entrepreneurship/startup",
  "marketing",
  "Side-Hustles",
  "Freelancing",
  "Hobbies",
  "fitness",
  "Art/design",
];

// Improved Skeleton with better background matching
function RoomCardSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-gray-700/30 p-6 rounded-3xl shadow animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-40 bg-gray-500/20 rounded-md"></div>
        </div>
        <div className="w-6 h-6 bg-gray-500/20 rounded-full"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 w-24 bg-gray-500/20 rounded-md"></div>
      </div>
      <div className="mb-4">
        <div className="h-3 w-full bg-gray-500/20 rounded-md mb-2"></div>
        <div className="h-3 w-4/5 bg-gray-500/20 rounded-md"></div>
      </div>
      <div className="w-full h-10 bg-gray-500/20 rounded-lg"></div>
    </div>
  );
}

export default function OtherRoom({ otherRooms, isLoading = false }) {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (otherRooms) {
      setSessions(otherRooms.map((r) => ({ ...r, joins: r.joins ?? 0 })));
    }
  }, [otherRooms]);

  const filteredSessions = sessions.filter((room) => {
    const matchCategory =
      selectedCategory === "All" || room.cateogery === selectedCategory;
    const matchSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const showSkeletons = !isLoading && sessions.length === 0;

  return (
    <div>
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl 2xl:text-2xl font-semibold txt mb-2 sm:mb-0">
          Explore Rooms
        </h1>

        <input
          type="text"
          placeholder="Search rooms..."
          className="w-full sm:w-[270px] px-4 py-2 border rounded-full bg-transparent placeholder-gray-400 border-gray-600 focus:outline-none focus:border-[var(--btn)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Category toggle horizontal scroll */}
      <div className="relative mb-3 2xl:mb-6">
        {/* Left Arrow */}
        <div className="absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-[var(--bg-primary)] to-transparent flex items-center justify-start">
          <Button
            onClick={() => scroll("left")}
            size="icon"
            className="rounded-full bg-transparent hover:bg-[var(--btn)] text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <ChevronLeft size={26} />
          </Button>
        </div>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-2 px-16"
        >
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              onClick={() => !isLoading && setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "secondary"}
              size="sm"
              className={`rounded-full border text-sm transition-colors ${
                selectedCategory === cat
                  ? "border-[var(--btn)] bg-[var(--btn)] text-white"
                  : "bg-transparent border-gray-50/20 hover:bg-[var(--btn)] hover:text-white"
              }`}
              disabled={isLoading}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Right Arrow */}
        <div className="absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-[var(--bg-primary)] to-transparent flex items-center justify-end">
          <Button
            onClick={() => scroll("right")}
            size="icon"
            className="rounded-full bg-transparent hover:bg-[var(--btn)] text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <ChevronRight size={26} />
          </Button>
        </div>
      </div>

      {/* Room Cards */}
      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <RoomCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="mx-auto txt-dim w-fit mt-10 text-lg">No results</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((room) => (
            <RoomCard key={room._id} room={room} showCategory={true} />
          ))}
        </div>
      )}
    </div>
  );
}
