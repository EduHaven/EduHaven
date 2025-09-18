import { Archive, FileText, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const NoteHeader = ({
  createNewNote,
  searchTerm,
  setSearchTerm,
  selectedNote,
  setStatus,
  setSelectedNote,
}) => {
  return (
    <header
      className={`flex justify-between items-center w-full ${
        selectedNote
          ? "flex-col justify-center gap-2 mb-1"
          : "flex-row items-start gap-6 mb-3"
      }`}
    >
      {/* 🔹 Navigation Tabs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-medium text-[var(--txt)] hover:bg-[var(--bg-ter)] px-3 py-2 rounded-lg"
          onClick={() => {
            setStatus("active");
            setSelectedNote(null);
          }}
        >
          <FileText size={18} />
          Notes
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-medium text-[var(--txt)] hover:bg-[var(--bg-ter)] px-3 py-2 rounded-lg"
          onClick={() => {
            setStatus("archive");
            setSelectedNote(null);
          }}
        >
          <Archive size={18} />
          Archived
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-medium text-[var(--txt)] hover:bg-[var(--bg-ter)] px-3 py-2 rounded-lg"
          onClick={() => {
            setStatus("trash");
            setSelectedNote(null);
          }}
        >
          <Trash2 size={18} />
          Trash
        </Button>
      </div>

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
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            onClick={createNewNote}
            className={`w-full p-2.5 px-6 cursor-pointer flex items-center justify-center gap-2 bg-[var(--btn)] text-white hover:bg-[var(--btn-hover)] rounded-lg ${
              selectedNote && "hidden"
            }`}
          >
            <Plus size={18} />
            New Note
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default NoteHeader;
