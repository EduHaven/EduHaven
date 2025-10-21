import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import {
  Activity,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash,
  Link as LinkIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RoomCard({ room, onDelete, showCategory, loading, onRoomNotFound, isJoinedRoom = false }) {
  const [isPinned, setIsPinned] = useState(false);
  const [joinStatus, setJoinStatus] = useState(null); // 'member', 'pending', 'none'
  const navigate = useNavigate();

  // Load pinned state
  useEffect(() => {
    if (!room) return;
    const pinned = JSON.parse(localStorage.getItem("pinnedRooms") || "[]");
    const found = pinned.some((r) => r._id === room._id);
    setIsPinned(found);
  }, [room, room?._id]);

  // Load join status
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (room && user) {
      axiosInstance
        .get(`/session-room/${room._id}/join-status`)
        .then((res) => setJoinStatus(res.data.status))
        .catch((error) => {
          // Check if it's a 404 error (room not found)
          if (error.response?.status === 404) {
            if (onRoomNotFound) {
              onRoomNotFound(room._id);
            }
          }
          setJoinStatus(null);
        });
    }
  }, [room, onRoomNotFound]);

  // Poll join-status so UI updates after creator approves without manual refresh
  useEffect(() => {
    if (!room?._id) return;
    let intervalId;
    let canceled = false;

    const fetchStatus = () => {
      axiosInstance
        .get(`/session-room/${room._id}/join-status`)
        .then((res) => {
          if (!canceled) setJoinStatus(res.data.status);
        })
        .catch((error) => {
          // Check if it's a 404 error (room not found)
          if (error.response?.status === 404) {
            if (onRoomNotFound && !canceled) {
              onRoomNotFound(room._id);
            }
            // Stop polling if room is deleted
            if (intervalId) {
              clearInterval(intervalId);
            }
          }
        });
    };

    // initial immediate fetch to sync
    fetchStatus();
    intervalId = setInterval(fetchStatus, 5000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchStatus();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      canceled = true;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [room?._id, onRoomNotFound]);

  const handleJoin = async () => {
    if (loading) return;
    if (room.isPrivate) {
      if (joinStatus === "member") {
        try {
          const res = await axiosInstance.post(
            `/session-room/${room._id}/join`
          );
          import("react-toastify").then(({ toast }) => {
            toast.success(res.data?.message || "Entering room...");
          });
          navigate(`/session/${room._id}`);
        } catch (err) {
          import("react-toastify").then(({ toast }) => {
            toast.error(err.response?.data?.error || "Failed to enter room");
          });
        }
      } else if (joinStatus === "pending") {
        import("react-toastify").then(({ toast }) =>
          toast.info("Your join request is pending approval.")
        );
      } else {
        // Send join request
        try {
          await axiosInstance.post(`/session-room/${room._id}/request-join`);
          setJoinStatus("pending");
          import("react-toastify").then(({ toast }) =>
            toast.success("Join request sent.")
          );
        } catch (err) {
          const message = err.response?.data?.error;
          if (message && message.toLowerCase().includes("already a member")) {
            setJoinStatus("member");
            import("react-toastify").then(({ toast }) => {
              toast.success("You are already a member. Entering room...");
            });
            navigate(`/session/${room._id}`);
          } else {
            import("react-toastify").then(({ toast }) => {
              toast.error(message || "Failed to send request");
            });
          }
        }
      }
    } else {
      try {
        const res = await axiosInstance.post(`/session-room/${room._id}/join`);

        if (joinStatus === "member") {
          toast.success("Entering room...");
        } else {
          toast.success("Joining room...");
        }
        setJoinStatus("member");
        navigate(`/session/${room._id}`);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to join room");
      }
    }
  };

  const handleCancelRequest = async () => {
    if (loading) return;
    try {
      await axiosInstance.post(`/session-room/${room._id}/cancel-request`);
      setJoinStatus("none");
      import("react-toastify").then(({ toast }) => {
        toast.success("Join request canceled.");
      });
    } catch (err) {
      import("react-toastify").then(({ toast }) => {
        toast.error(err.response?.data?.error || "Failed to cancel request");
      });
    }
  };

  const handlePin = () => {
    if (loading) return;
    try {
      const raw = localStorage.getItem("pinnedRooms") || "[]";
      const arr = JSON.parse(raw);
      const exists = arr.some((r) => r._id === room._id);
      if (!exists) {
        arr.push(room);
        localStorage.setItem("pinnedRooms", JSON.stringify(arr));
        setIsPinned(true);
      }
    } catch {
      localStorage.setItem("pinnedRooms", JSON.stringify([room]));
      setIsPinned(true);
    }
    setMenuOpen(false);
  };

  const handleUnpin = () => {
    if (loading) return;
    try {
      const raw = localStorage.getItem("pinnedRooms") || "[]";
      const arr = JSON.parse(raw).filter((r) => r._id !== room._id);
      localStorage.setItem("pinnedRooms", JSON.stringify(arr));
      setIsPinned(false);
    } catch {
      console.error("Failed to unpin room.");
    }
    setMenuOpen(false);
  };

  const handleCopyLink = () => {
    if (loading) return;
    const link = `${window.location.origin}/session/${room._id}`;
    navigator.clipboard.writeText(link).catch((err) => {
      console.error("Failed to copy link: ", err);
    });
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="relative bg-sec backdrop-blur-md p-6 rounded-3xl shadow animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>

        {showCategory && (
          <div className="mb-4">
            <div className="h-4 w-24 bg-gray-300 rounded-md mb-1"></div>
            <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          </div>
        )}

        <div className="mb-4">
          <div className="h-3 w-full bg-gray-300 rounded-md mb-2"></div>
          <div className="h-3 w-4/5 bg-gray-300 rounded-md"></div>
        </div>

        <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-sec backdrop-blur-md p-6 rounded-3xl shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold txt">{room.name}</h3>
          {isPinned && (
            <span title="Pinned">
              {" "}
              <Pin size={18} className="rotate-45 ml-1" />
            </span>
          )}
        </div>

        {/* Dropdown Menu ->for mantaing UI*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              size="icon"
              className="txt hover:txt-dim"
            >
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-ter rounded-xl shadow-md">
            {!isPinned ? (
              <DropdownMenuItem
                onClick={handlePin}
                className="flex items-center gap-2 txt cursor-pointer"
              >
                <Pin size={18} />
                Pin to home
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleUnpin}
                className="flex items-center gap-2 txt cursor-pointer"
              >
                <PinOff size={18} />
                Unpin from home
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={handleCopyLink}
              className="flex items-center gap-2 txt cursor-pointer"
            >
              <LinkIcon size={18} />
              Copy Link
            </DropdownMenuItem>

            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(room)}
                className="flex items-center gap-2 text-red-500 cursor-pointer"
              >
                <Trash size={18} />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showCategory && (
        <p className="txt-dim mb-4 capitalize">
          Category: <span className="font-medium">{room.cateogery}</span>
        </p>
      )}

      {room.description && <p className="txt-dim mb-4">{room.description}</p>}

      {/* Join/Request Button Logic using joinStatus from backend */}
      {isJoinedRoom ? (
        <Button
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2"
        >
          <Activity className="w-5 h-5" />
          Enter Room
        </Button>
      ) : room.isPrivate ? (
        joinStatus === "member" ? (
          <Button
            onClick={handleJoin}
            className="w-full flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Enter Room
          </Button>
        ) : joinStatus === "pending" ? (
          <div className="flex gap-2">
            <Button
              onClick={handleCancelRequest}
              className="w-full flex items-center justify-center gap-2"
            >
              Cancel Request
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleJoin}
            className="w-full flex items-center justify-center gap-2"
          >
            Request Join
          </Button>
        )
      ) : joinStatus === "member" ? (
        <Button
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2"
        >
          <Activity className="w-5 h-5" />
          Enter Room
        </Button>
      ) : (
        <Button
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2"
        >
          <Activity className="w-5 h-5" />
          Join
        </Button>
      )}
    </div>
  );
}
