import { useEffect, useState } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "./RoomCard";
import CreateRoomModal from "./CreateRoomModal";
import { Button } from "@/components/ui/button";

export default function YourRooms({ myRooms }) {
  const [sessions, setSessions] = useState(myRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    setSessions(myRooms.map((r) => ({ ...r, joins: r.joins ?? 0 })));
  }, [myRooms]);

  const handleCreate = async (data) => {
    try {
      const res = await axiosInstance.post(`/session-room`, data);
      setSessions((s) => [...s, res.data]);
    } catch (err) {
      console.error("Create room failed:", err);
    }
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/session-room/${roomToDelete._id}`);
      setSessions((s) => s.filter((r) => r._id !== roomToDelete._id));
    } catch (err) {
      console.error("Delete room failed:", err);
    } finally {
      setShowDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  // Handle join request approval/rejection
  const handleRequest = async (roomId, targetUserId, action) => {
    try {
      await axiosInstance.post(`/session-room/${roomId}/handle-request`, {
        targetUserId,
        action,
      });
      // Refresh sessions (ideally, fetch again, but for now, update state)
      setSessions((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? {
                ...room,
                pendingRequests: room.pendingRequests.filter(
                  (id) => id !== targetUserId
                ),
                members:
                  action === "approve"
                    ? [...room.members, targetUserId]
                    : room.members,
              }
            : room
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to handle request");
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-lg 2xl:text-2xl font-semibold txt mb-3 2xl:mb-6">
        Your Rooms
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 2xl:gap-6">
        {sessions.map((room) => (
          <div key={room._id}>
            <RoomCard
              room={room}
              onDelete={() => handleDeleteClick(room)}
              showCategory={true}
            />
            {/* Show join requests for private rooms */}
            {room.isPrivate &&
              room.pendingRequests &&
              room.pendingRequests.length > 0 && (
                <div className="bg-gray-800/40 rounded-xl p-3 mt-2">
                  <div className="font-semibold mb-2 txt">Join Requests:</div>
                  {room.pendingRequests.map((userId) => (
                    <div
                      key={userId}
                      className="flex items-center justify-between mb-2"
                    >
                      <span className="txt-dim">User: {userId}</span>
                      <div className="flex gap-2">
                        <UIButton
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleRequest(room._id, userId, "approve")
                          }
                        >
                          Approve
                        </UIButton>
                        <UIButton
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleRequest(room._id, userId, "reject")
                          }
                        >
                          Reject
                        </UIButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="flex flex-col items-center justify-center gap-4 px-6 py-2.5 rounded-3xl aspect-square h-full w-fit border-8 border-[var(--bg-sec)] hover:border-[var(--btn-hover)]"
        >
          <PlusCircle className="size-14" strokeWidth={1} />
          <h3 className="font-semibold">Create Room</h3>
        </Button>
      </div>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.25 }}
              className="bg-sec border border-white/20 rounded-2xl shadow-2xl p-6 max-w-sm w-[90%]"
            >
              <h2 className="text-xl text-[var(--txt)] font-semibold mb-2">
                Delete Room?
              </h2>
              <p className="mb-6 text-[var(--txt-dim)] dark:text-gray-300 text-sm">
                This action is permanent and cannot be undone.
              </p>
              <div className="flex justify-evenly gap-4">
                <Button
                  onClick={confirmDelete}
                  variant="destructive"
                  size="default"
                  className="w-32 font-medium"
                >
                  Yes, Delete
                </Button>
                <Button
                  onClick={cancelDelete}
                  variant="secondary"
                  size="default"
                  className="w-32 font-medium"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
