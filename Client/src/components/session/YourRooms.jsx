import { useEffect, useState } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "./RoomCard";
import CreateRoomModal from "./CreateRoomModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function YourRooms({ myRooms }) {
  const [sessions, setSessions] = useState(myRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const navigate = useNavigate();

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

  const OpenProfile = (user) => {
    if (user._id) {
      navigate(`/user/${user._id}`, { replace: true });
    }
  };

  const handleRequest = async (roomId, targetUserId, action) => {
    try {
      await axiosInstance.post(`/session-room/${roomId}/handle-request`, {
        targetUserId,
        action,
      });

      setSessions((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? {
                ...room,
                pendingRequests: room.pendingRequests.filter(
                  (user) => user._id !== targetUserId
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
            {room.isPrivate &&
              room.pendingRequests &&
              room.pendingRequests.length > 0 && (
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-3 mt-2 space-y-2">
                  <div className="font-semibold txt text-sm">
                    Pending Join Requests ({room.pendingRequests.length}):
                  </div>

                  {room.pendingRequests.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => OpenProfile(user)}
                      className="flex flex-col cursor-pointer gap-2 p-2.5 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex flex-col items-start gap-2.5">
                        <div className="flex justify-between items-center gap-2">
                          <img
                            src={
                              user.ProfilePicture ||
                              "https://ui-avatars.com/api/?name=" +
                                user.Username
                            }
                            alt={user.Username}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-white block text-sm">
                              {user.Username}
                            </span>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                              {user.Bio || "No bio provided"}
                            </p>
                          </div>
                        </div>

                        {user.OtherDetails?.skills && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-300 mb-1.5">
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.OtherDetails.skills
                                .split(",")
                                .slice(0, 3)
                                .map((s, i) => (
                                  <span
                                    key={`skill-${i}`}
                                    className="inline-flex items-center px-2.5 py-1 bg-amber-900/40 text-amber-300 text-[10px] sm:text-xs rounded-full whitespace-nowrap border border-amber-700/30 hover:bg-amber-900/60 transition-colors"
                                  >
                                    {s.trim()}
                                  </span>
                                ))}
                              {user.OtherDetails.skills.split(",").length >
                                3 && (
                                <span className="text-gray-500 text-[10px] sm:text-xs px-2 py-1">
                                  +
                                  {user.OtherDetails.skills.split(",").length -
                                    3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {user.OtherDetails?.interests && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-300 mb-1.5">
                              Interests
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.OtherDetails.interests
                                .split(",")
                                .slice(0, 3)
                                .map((i, idx) => (
                                  <span
                                    key={`interest-${idx}`}
                                    className="inline-flex items-center px-2.5 py-1 bg-cyan-900/40 text-cyan-300 text-[10px] sm:text-xs rounded-full whitespace-nowrap border border-cyan-700/30 hover:bg-cyan-900/60 transition-colors"
                                  >
                                    {i.trim()}
                                  </span>
                                ))}
                              {user.OtherDetails.interests.split(",").length >
                                3 && (
                                <span className="text-gray-500 text-[10px] sm:text-xs px-2 py-1">
                                  +
                                  {user.OtherDetails.interests.split(",")
                                    .length - 3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 w-full">
                        <UIButton
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 h-9 text-sm"
                          onClick={() =>
                            handleRequest(room._id, user._id, "approve")
                          }
                        >
                          Approve
                        </UIButton>
                        <UIButton
                          size="sm"
                          variant="destructive"
                          className="flex-1 h-9 text-sm"
                          onClick={() =>
                            handleRequest(room._id, user._id, "reject")
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
