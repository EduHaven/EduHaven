import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "./RoomCard";

export default function SessionRooms({ joinedRooms }) {
  const [sessions, setSessions] = useState(joinedRooms);

  useEffect(() => {
    setSessions(joinedRooms.map((r) => ({ ...r, joins: r.joins ?? 0 })));
  }, [joinedRooms]);


  return (
    <div className="space-y-4">
      <h2 className="text-xl 2xl:text-2xl font-semibold txt">
        Session Rooms
      </h2>

      {sessions.length === 0 ? (
        <div
          className="text-center p-8 rounded-3xl shadow-lg"
          style={{
            backgroundColor: "var(--bg-sec)",
            color: "var(--txt-dim)",
          }}
        >
          <p className="text-lg">
            You haven't joined any rooms yet. Explore rooms to join them!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sessions.map((room) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RoomCard
                  room={room}
                  showCategory={true}
                  isJoinedRoom={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
