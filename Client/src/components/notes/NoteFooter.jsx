const NoteFooter = ({ note }) => {
  // visibility map
  const visibilityMap = {
    public: "Public",
    private: note.collaborators?.length ? "Shared" : "Private",
  };
  return (
    <div
      className="text-xs mt-2 flex justify-between items-center"
      style={{ color: "var(--txt-disabled)" }}
    >
      {new Date(note?.createdAt).toLocaleDateString()}
      <div className="border px-3 py-1 rounded-md">
        {visibilityMap[note.visibility]}
      </div>
    </div>
  );
};

export default NoteFooter;
