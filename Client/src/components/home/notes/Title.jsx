function NoteTitle({ notes, currentPage, titleChange, titleError }) {
  return (
    <div className="flex justify-between px-2 gap-4">
      <div className="flex items-center flex-1 relative">
        <input
          type="text"
          value={notes[currentPage]?.title || ""}
          onChange={titleChange}
          placeholder="Title"
          className="bg-transparent outline-none p-0.5 text-xl w-full font-semibold "
        />
        {titleError && (
          <p className="text-red-400 text-xs absolute -bottom-3">
            {titleError}
          </p>
        )}
        <div className="absolute right-0 w-10 h-full bg-gradient-to-r from-transparent to-[var(--bg-sec)]"></div>
      </div>
    </div>
  );
}

export default NoteTitle;
