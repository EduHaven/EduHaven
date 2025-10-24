import { useNoteStore } from "@/stores/useNoteStore";
import { useEffect } from "react";

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
  const currentUserId = getCurrentUserId();
  const { owners, collaborators, setOwner, setCollaborators } = useNoteStore();

  // fetch real owner
  useEffect(() => {
    if (note?.owner && !owners[note.owner]) setOwner(note.owner);
    if (note?.collaborators?.length && !collaborators[note._id])
      setCollaborators(note);
  }, [note, owners, collaborators, setOwner, setCollaborators]);

  const owner = owners[note.owner];
  const collabs = collaborators[note._id] || [];
  const isOwner = note.owner === currentUserId;

  // visibility
  let visibility = "Private";
  if (note.visibility === "public") visibility = "Public";
  else if (note.visibility === "private" && note.collaborators?.length)
    visibility = "Shared";

  const visibleCollabs = collabs.slice(0, 5);
  const extraCount = collabs.length - 5;

  return (
    <>
      {visibility === "Shared" && isOwner && (
        <div className="flex items-center space-x-2 w-full">
          {visibleCollabs.map((c) => (
            <img
              key={c._id}
              className="w-5 h-5 rounded-full"
              src={c?.ProfilePicture}
              alt={c?.FirstName}
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
