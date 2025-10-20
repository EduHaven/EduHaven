import { fetchUserDetails } from "@/api/userApi";
import { useEffect, useState } from "react";

const NoteFooter = ({ note }) => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUserDetails(note.owner);
      setOwner(data);
    };
    getUser();
  }, [note.owner]);

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
      <div className="border px-2 h-7 rounded-full flex items-center space-x-2">
        <span>{visibility}</span>
        {visibility === "Shared" && (
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
