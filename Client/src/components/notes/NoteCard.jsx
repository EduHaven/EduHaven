import { motion } from "framer-motion";
import {
  Archive,
  Download,
  Palette,
  Pin,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
const NoteCard = ({
  note,
  onSelect,
  onPin,
  onSendToTrash,
  onArchive,
  onExport,
  onColorChange,
  showColorPicker,
  setShowColorPicker,
  colors,
  getPlainTextPreview,
}) => {
  const [hovered, setHovered] = useState(false);

  const getColorStyle = (colorName) => {
    const color = colors.find((c) => c.name === colorName);
    return color ? color.style : colors[0].style;
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  const isOptimistic = note?._id?.startsWith("optimistic-") || note?.__optimistic;

  return (
    <div
      className={`cursor-pointer relative flex flex-col transition-all p-4 rounded-xl group ${
        isOptimistic ? "animate-pulse opacity-75" : ""
      }`}
      style={{
        ...getColorStyle(note?.color),
        minHeight: "140px",
      }}
      onClick={() => !isOptimistic && onSelect(note)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin(note?._id, note?.pinnedAt);
        }}
        className={`absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20 transition-opacity
        ${
          note?.pinnedAt ? "opacity-100" : hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <Pin
          size={16}
          style={{
            color: note?.pinnedAt ? "var(--btn)" : "var(--txt-dim)",
            transform: note?.pinnedAt ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

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
          {isOptimistic ? (
            <span className="text-blue-500 font-medium">Saving...</span>
          ) : (
            truncateText(getPlainTextPreview(note?.content), 100)
          )}
        </div>
      </div>

      <div className="text-xs mt-2" style={{ color: "var(--txt-disabled)" }}>
        {new Date(note?.createdAt).toLocaleDateString()}
      </div>

      {hovered && (
        <motion.div
          className="absolute bottom-2 left-2 right-2 flex justify-between items-center gap-2 px-2 py-1 rounded-lg"
          style={{ backgroundColor: "var(--bg-ter)" }}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <button
            onClick={() =>
              setShowColorPicker(
                showColorPicker === note?._id ? null : note?._id
              )
            }
            className="p-1 rounded hover:bg-black/10"
          >
            <Palette size={16} />
          </button>

          <button
            onClick={() => onArchive(note)}
            className="p-1 rounded hover:bg-black/10"
          >
            <Archive size={16} />
          </button>

          <button
            onClick={() => onExport(note)}
            className="p-1 rounded hover:bg-black/10"
          >
            <Download size={16} />
          </button>

          <button
            disabled
            className="p-1 rounded opacity-40 cursor-not-allowed"
          >
            <UserPlus size={16} />
          </button>

          <button
            onClick={() => onSendToTrash(note?._id)}
            className="p-1 rounded hover:bg-black/10"
          >
            <Trash2 size={16} />
          </button>
        </motion.div>
      )}

      {showColorPicker === note?._id && (
        <motion.div
          className="absolute bottom-12 left-2 border p-2 shadow-lg z-20 flex gap-1 flex-wrap bg-[var(--bg-ter)] rounded-lg"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(note?._id, color.name)}
              className="w-6 h-6 cursor-pointer rounded-full border"
              style={{
                ...color.style,
                borderColor:
                  note?.color === color.name ? "var(--btn)" : "var(--bg-sec)",
                borderWidth: note?.color === color.name ? "2px" : "1px",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default NoteCard;
