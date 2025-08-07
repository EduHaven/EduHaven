import { useEffect, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function OtherRoom({ otherRooms }) {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef(null);

  useEffect(() => {
    setSessions(otherRooms.map((r) => ({ ...r, joins: r.joins ?? 0 })));
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

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl 2xl:text-2xl font-semibold txt">
          Session Rooms
        </h1>

        <input
          type="text"
          placeholder="Search rooms..."
          className="w-[270px] px-4 py-2 mb-3 border rounded-full bg-transparent text-white placeholder-gray-400 border-gray-600 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category toggle horizontal scroll */}
      <div className="relative mb-3 2xl:mb-6">
        <div className="absolute left-0 top-0 h-full w-20 z-10 bg-[linear-gradient(to_right,var(--bg-primary)_0%,var(--bg-primary)_50%,transparent_90%)]">
          <button
            onClick={() => scroll("left")}
            className="mr-auto bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white px-3 py-1 rounded-full"
          >
            <ChevronLeft size={29} />
          </button>
        </div>

        {/* Scrollable category buttons */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-2 px-16"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-sm transition ${
                selectedCategory === cat
                  ? "btn text-white border-[var(--btn)]"
                  : "bg-transparent txt border-gray-500/20 hover:bg-[var(--btn-hover)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right gradient + button */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[var(--bg-primary)] to-transparent flex items-end justify-center">
          <button
            onClick={() => scroll("right")}
            className="ml-auto bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white px-3 py-1 rounded-full"
          >
            <ChevronRight size={29}/>
          </button>
        </div>
      </div>

      {/* Filtered sessions */}
      {filteredSessions.length === 0 ? (
        <div className="mx-auto txt-dim w-fit mt-10 text-lg">No results</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((room) => (
            <RoomCard key={room._id} room={room} showCategory={false} />
          ))}
        </div>
      )}
    </div>
  );
}
