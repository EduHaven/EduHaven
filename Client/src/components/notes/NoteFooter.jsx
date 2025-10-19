const NoteFooter = ({ note }) => {
  return (
    <div
      className="text-xs mt-2 flex justify-between items-center"
      style={{ color: "var(--txt-disabled)" }}
    >
      {new Date(note?.createdAt).toLocaleDateString()}
      <div className="rounded-md border px-3 py-1">Public</div>
    </div>
  );
};

export default NoteFooter;
