import { useEffect, useState } from "react";
import RoomCard from "../session/RoomCard";

export default function PinnedRoomsSection() {
  const [pinnedRooms, setPinnedRooms] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pinnedRooms") || "[]";
      const rooms = JSON.parse(raw);
      setPinnedRooms(rooms);
    } catch {
      setPinnedRooms([]);
    }
  }, []);

  return (
    <div className="mb-6 sm:mb-8 lg:mb-10">
      {pinnedRooms.length > 0 && (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ml-2 sm:ml-4">Pinned rooms:</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 2xl:gap-6">
            {pinnedRooms.map((room) => (
              <RoomCard key={room._id} room={room} showCategory={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
