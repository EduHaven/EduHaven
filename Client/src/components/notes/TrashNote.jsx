import { motion } from "framer-motion";
import { Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";

const TrashNoteCard = ({ note, onDelete, onRestore, getPlainTextPreview }) => {
  const [hovered, setHovered] = useState(false);

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div
      className="cursor-pointer relative flex flex-col transition-all p-4 rounded-xl group"
      style={{
        backgroundColor: "var(--note-default)",
        minHeight: "140px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1">
        {note?.title && (
          <h3
            className="text-sm font-semibold m-0 mb-1.5 leading-tight"
            style={{ color: "var(--txt)" }}
          >
            {truncateText(note?.title, 40)}
          </h3>
        )}
        <div
          className="text-xs leading-snug"
          style={{ color: "var(--txt-dim)" }}
        >
          {truncateText(getPlainTextPreview(note?.content), 100)}
        </div>
      </div>

      {!hovered && (
        <div className="text-xs mt-2" style={{ color: "var(--txt-disabled)" }}>
          {new Date(note?.createdAt).toLocaleDateString()}
        </div>
      )}

      {hovered && (
        <motion.div
          className="absolute bottom-2 left-2 right-2 flex justify-center items-center text-sm gap-2 px-2 rounded-lg"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {/* Restore button */}
          <button
            onClick={() => onRestore(note?._id)}
            className="p-2 rounded bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
          >
            <RotateCcw size={16} />
            Restore
          </button>

          {/* Delete permanently button */}
          <button
            onClick={() => onDelete(note?._id)}
            className="p-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </motion.div>
      )}
    </div>
  );
};

const TrashNotes = ({ notes, onDelete, onRestore, getPlainTextPreview }) => {
  if (!notes?.length) {
    return (
      <p className="text-center mt-10" style={{ color: "var(--txt-dim)" }}>
        No trashed notes.
      </p>
    );
  }

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {notes.map((note) => (
        <TrashNoteCard
          key={note._id}
          note={note}
          onDelete={onDelete}
          onRestore={onRestore}
          getPlainTextPreview={getPlainTextPreview}
        />
      ))}
    </div>
  );
};

export default TrashNotes;
