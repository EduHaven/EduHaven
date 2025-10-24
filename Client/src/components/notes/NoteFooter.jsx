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
  const [collaboratorsData, setCollaboratorsData] = useState([]);
  const currentUserId = getCurrentUserId();

  // fetch real owner
  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUserDetails(note?.owner);
      setOwner(data);
    };
    getUser();
  }, [note?.owner]);

  // fetch collaborators details
  useEffect(() => {
    const getCollaborators = async () => {
      if (note?.collaborators?.length) {
        const data = await Promise.all(
          note.collaborators.map(async (collab) => {
            const res = await fetchUserDetails(collab.user._id);
            return res;
          })
        );
        setCollaboratorsData(data);
      }
    };
    getCollaborators();
  }, [note?.collaborators?.length]);

  const isOwner = note.owner === currentUserId;

  // limit displaying collaborators profile (default: 5)
  const visibleCollaborators = collaboratorsData.slice(0, 5);
  // remaining collaborators count
  const extraCount = collaboratorsData.length - 5;

  // visibility
  let visibility = "Private";
  if (note.visibility === "public") visibility = "Public";
  else if (note.visibility === "private" && note.collaborators?.length)
    visibility = "Shared";

  return (
    <>
      {visibility === "Shared" && isOwner && note?.collaborators.length && (
        <div className="flex items-center space-x-1 w-full">
          {visibleCollaborators.map((collab) => (
            <img
              key={collab._id}
              className="w-5 h-5 rounded-full"
              src={collab?.ProfilePicture}
              alt={collab?.FirstName}
            />
          ))}
          {extraCount > 0 && <span className="text-xs">+{extraCount}</span>}
        </div>
      )}
      <div
        className="text-xs flex justify-between items-center"
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
    </>
  );
};

export default NoteFooter;
