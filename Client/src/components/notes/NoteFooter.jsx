import { fetchUserDetails } from "@/api/userApi";
import { useEffect, useState } from "react";

const getCurrentUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken?.id || null;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

const NoteFooter = ({ note }) => {
  const [owner, setOwner] = useState(null);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUserDetails(note?.owner);
      setOwner(data);
    };
    getUser();
  }, [note?.owner]);

  const isOwner = note.owner === currentUserId;

  // visibility
  let visibility = "Private";
  if (note.visibility === "public") visibility = "Public";
  else if (note.visibility === "private" && note.collaborators?.length)
    visibility = "Shared";

  return (
    <div
      className="text-xs mt-2 flex justify-between items-center"
      style={{ color: "var(--txt-disabled)" }}
    >
      {new Date(note?.createdAt).toLocaleDateString()}
      <div className="border px-1 h-7 rounded-full flex items-center justify-center">
        <span className="mx-1">{visibility}</span>
        {visibility === "Shared" && !isOwner && owner?.ProfilePicture && (
          <img
            className="w-5 h-5 rounded-full"
            src={owner?.ProfilePicture}
            alt={owner?.FirstName}
          />
        )}
      </div>
    </div>
  );
};

export default NoteFooter;
