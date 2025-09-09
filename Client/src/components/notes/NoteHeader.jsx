import { FilePenLine, Plus, Search } from "lucide-react";

const NoteHeader = ({
  createNewNote,
  searchTerm,
  setSearchTerm,
  selectedNote,
}) => {
  return (
    <header
      className={`flex justify-between  w-full  ${
        selectedNote
          ? "flex-col justify-center gap-2 mb-1"
          : "flex-row items-start gap-8 mb-3"
      }`}
    >
      <div className="flex items-center gap-2">
        <h1 className="m-0 text-2xl font-semibold">Notes</h1>
      </div>

      {selectedNote && (
        <button
          onClick={createNewNote}
          className="w-full p-2 py-2.5 mt-1 hover:bg-[var(--bg-ter)] rounded-lg cursor-pointer flex items-center gap-2 transition-colors font-semibold"
        >
          <FilePenLine size={18} />
          Create new Note
        </button>
      )}

      <div className="flex-1 max-w-2xl relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: "var(--txt-dim)" }}
        />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-10 pr-3 border text-sm outline-none"
          style={{
            borderColor: "var(--bg-sec)",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--bg-sec)",
            color: "var(--txt)",
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={createNewNote}
          className={`w-full p-2.5 px-6 cursor-pointer flex items-center justify-center gap-2 bg-[var(--btn)] text-white hover:bg-[var(--btn-hover)] rounded-lg ${
            selectedNote && "hidden"
          }`}
        >
          <Plus size={18} />
          Create new Note
        </button>
      </div>
    </header>
  );
};

export default NoteHeader;
