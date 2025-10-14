// components/ProfileCard/UserRoomsCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Lock, DoorOpen, XCircle, ArrowRight } from "lucide-react";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Custom hook to fetch the join status for all rooms (Logic unchanged as it was correct)
const useRoomStatus = (myRooms) => {
  const [joinStatus, setJoinStatus] = useState({});

  useEffect(() => {
    if (myRooms && myRooms.length > 0) {
      const fetchStatuses = async () => {
        const statuses = {};
        const statusPromises = myRooms.map((room) =>
          axiosInstance
            .get(`/session-room/${room._id}/join-status`)
            .then((res) => ({ id: room._id, status: res.data.status }))
            .catch(() => ({ id: room._id, status: "none" }))
        );

        const results = await Promise.all(statusPromises);
        results.forEach((result) => {
          statuses[result.id] = result.status;
        });
        setJoinStatus(statuses);
      };
      fetchStatuses();
    }
  }, [myRooms]);

  const updateJoinStatus = (roomId, status) => {
    setJoinStatus((prev) => ({ ...prev, [roomId]: status }));
  };

  return { joinStatus, updateJoinStatus };
};

const UserRoomsCard = ({ isCurrentUser, myRooms }) => {
  const navigate = useNavigate();
  const { joinStatus, updateJoinStatus } = useRoomStatus(myRooms);

  const handleJoin = async (room) => {
    const status = joinStatus[room._id] || (room.isJoined ? "member" : "none");

    if (room.isPrivate) {
      if (status === "member") {
        toast.info("Entering room...");
        navigate(`/session/${room._id}`);
      } else if (status === "pending") {
        toast.info("Your join request is pending approval.");
      } else {
        try {
          await axiosInstance.post(`/session-room/${room._id}/request-join`);
          updateJoinStatus(room._id, "pending");
          toast.success("Join request sent.");
        } catch (err) {
          const message = err.response?.data?.error;
          if (message?.toLowerCase().includes("already a member")) {
            updateJoinStatus(room._id, "member");
            toast.success("You are already a member. Entering room...");
            navigate(`/session/${room._id}`);
          } else {
            toast.error(message || "Failed to send request");
          }
        }
      }
    } else {
      try {
        await axiosInstance.post(`/session-room/${room._id}/join`);
        updateJoinStatus(room._id, "member");
        toast.success("Joined room. Entering...");
        navigate(`/session/${room._id}`);
      } catch (err) {
        if (
          err.response?.data?.error?.toLowerCase().includes("already a member")
        ) {
          updateJoinStatus(room._id, "member");
          toast.success("Entering room...");
          navigate(`/session/${room._id}`);
        } else {
          toast.error(err.response?.data?.error || "Failed to join room");
        }
      }
    }
  };

  const handleCancelRequest = async (room) => {
    try {
      await axiosInstance.post(`/session-room/${room._id}/cancel-request`);
      updateJoinStatus(room._id, "none");
      toast.success("Join request canceled.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel request");
    }
  };

  return (
    <div
      className="rounded-3xl shadow-lg p-6 w-full h-fit relative"
      style={{
        backgroundColor: "var(--bg-sec)",
      }}
    >
      <div className="inner">
        <h2
          className="text-xl font-semibold mb-6"
          style={{
            color: "var(--txt)",
          }}
        >
          {isCurrentUser ? "My Rooms" : "User's Rooms"}
        </h2>

        {myRooms.length === 0 ? (
          <p
            className="text-center p-4 rounded-lg"
            style={{
              color: "var(--txt-dim)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            {isCurrentUser
              ? "You haven't created any rooms yet."
              : "This user hasn't created any rooms."}
          </p>
        ) : (
          <ul className="space-y-4">
            {myRooms.map((room) => {
              const status =
                joinStatus[room._id] || (room.isJoined ? "member" : "none");
              const categoryText = truncateText(room.cateogery, 25);

              let buttonText = "Join";
              let buttonAction = () => handleJoin(room);
              let buttonVariant = "default";

              // Determine button state and text
              if (room.isPrivate) {
                if (status === "member") {
                  buttonText = "Enter Room";
                  buttonVariant = "secondary";
                } else if (status === "pending") {
                  buttonText = "Cancel Request";
                  buttonAction = () => handleCancelRequest(room);
                  buttonVariant = "destructive";
                } else {
                  // status === "none"
                  buttonText = "Request Join";
                }
              } else {
                // Public Room
                if (status === "member") {
                  buttonText = "Enter Room";
                  buttonVariant = "secondary";
                } else {
                  // status === "none"
                  buttonText = "Join";
                }
              }

              return (
                <li
                  key={room._id}
                  className="flex items-center justify-between p-4 rounded-xl shadow-inner transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  {/* Room Details */}
                  <div className="flex flex-col min-w-0 pr-4 flex-grow">
                    <span
                      className="font-medium text-lg truncate mb-0.5"
                      style={{ color: "var(--txt)" }}
                      title={room.name}
                    >
                      {room.name}{" "}
                      {room.isPrivate && (
                        <Lock
                          className="inline-block w-4 h-4 ml-1 align-sub"
                          style={{ color: "var(--txt-dim)" }}
                        />
                      )}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--txt-dim)" }}
                      title={room.cateogery}
                    >
                      Category: {categoryText}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={buttonAction}
                    variant={buttonVariant}
                    className="min-w-[100px] flex items-center justify-center gap-2"
                  >
                    {buttonText}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserRoomsCard;
