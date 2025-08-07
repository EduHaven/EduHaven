import { useState, useRef, useEffect } from "react";
import {
  Activity,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash,
  Link,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoomCard({ room, onDelete, showCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pinned = JSON.parse(localStorage.getItem("pinnedRooms") || "[]");
    const found = pinned.some((r) => r._id === room._id);
    setIsPinned(found);
  }, [room._id]);

  // close menu if clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const handleJoin = () => {
    navigate(`/session/${room._id}`);
  };

  const handlePin = () => {
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
    const link = `${window.location.origin}/session/${room._id}`;
    navigator.clipboard.writeText(link).catch((err) => {
      console.error("Failed to copy link: ", err);
    });
    setMenuOpen(false);
  };

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
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="txt hover:txt-dim"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-12 bg-ter rounded-xl shadow-md z-10 p-1"
        >
          {!isPinned ? (
            <button
              onClick={handlePin}
              className="flex items-center w-full text-left px-4 py-2.5 text-md gap-2 txt hover:btn"
            >
              <Pin size={20} /> Pin to home
            </button>
          ) : (
            <button
              onClick={handleUnpin}
              className="flex items-center w-full text-left px-4 py-2.5 text-md gap-2 txt hover:btn"
            >
              <PinOff size={20} /> Unpin from home
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="flex items-center w-full text-left px-4 py-2.5 text-md gap-2 txt hover:btn"
          >
            <Link size={20}/>
            Copy Link
          </button>

          {onDelete && (
            <button
              onClick={() => {
                onDelete(room);
                setMenuOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-2.5 text-md gap-2 txt hover:btn"
            >
              <Trash size={20} /> Delete
            </button>
          )}
        </div>
      )}

      {showCategory && (
        <p className="txt-dim mb-4 capitalize">
          Category: <span className="font-medium">{room.cateogery}</span>
        </p>
      )}

      <p className="txt-dim mb-2">
        <span className="font-medium">{room.joins}</span> student
        {room.joins !== 1 && "s"} studying
      </p>

      {room.description && <p className="txt-dim mb-4">{room.description}</p>}

      <button
        onClick={handleJoin}
        className="w-full btn px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Activity className="w-5 h-5" />
        Join
      </button>
    </div>
  );
}
