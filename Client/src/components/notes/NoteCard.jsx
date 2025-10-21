import { motion } from "framer-motion";
import {
  Archive,
  Download,
  Palette,
  Pin,
  Trash2,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SharePopup from "./SharePopup";
import { useNoteStore } from "@/stores/useNoteStore";
import {
  useUpdateNote,
  useArchiveNote,
  useTrashNote,
} from "@/queries/NoteQueries";
import axiosInstance from "@/utils/axios";
import NoteFooter from "./NoteFooter";

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

const NoteCard = ({ note, getPlainTextPreview, onExport }) => {
  const [hovered, setHovered] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    setSelectedNote,
    togglePin,
    changeColor,
    showColorPicker,
    setShowColorPicker,
  } = useNoteStore();

  const updateNoteMutation = useUpdateNote();
  const archiveNoteMutation = useArchiveNote();
  const trashNoteMutation = useTrashNote();

  const currentUserId = getCurrentUserId();

  // Check if the current user is the owner or has edit access
  const isOwner = note?.owner === currentUserId;
  const hasEditAccess = note?.collaborators.some(
    (collaborator) =>
      collaborator.user._id === currentUserId && collaborator.access === "edit"
  );
  const canEdit = isOwner || hasEditAccess;
  // Check is the note is shared
  const isSharedCollaborator = !isOwner && note?.collaborators?.length > 0;

  // Create handlers that combine store actions with mutations
  const handleTogglePin = (id, pinnedAt) => {
    if (!canEdit) return;
    const { updates } = togglePin(id, pinnedAt);
    updateNoteMutation.mutate({ id, ...updates });
  };

  const handleChangeColor = (id, color) => {
    if (!canEdit) return;
    const { updates } = changeColor(id, color);
    updateNoteMutation.mutate({ id, ...updates });
  };

  const handleArchiveNote = (noteToArchive) => {
    if (!canEdit) return;
    archiveNoteMutation.mutate(noteToArchive._id);
  };

  const handleSendToTrash = (id) => {
    setIsDeleting(true);
    if (!canEdit) return;
    trashNoteMutation.mutate(id);
    setIsDeleting(false);
  };

  const getColorStyle = (colorName) => {
    const colors = [
      { name: "default", style: { backgroundColor: "var(--note-default)" } },
      { name: "red", style: { backgroundColor: "var(--note-red)" } },
      { name: "orange", style: { backgroundColor: "var(--note-orange)" } },
      { name: "yellow", style: { backgroundColor: "var(--note-yellow)" } },
      { name: "green", style: { backgroundColor: "var(--note-green)" } },
      { name: "blue", style: { backgroundColor: "var(--note-blue)" } },
      { name: "purple", style: { backgroundColor: "var(--note-purple)" } },
      { name: "pink", style: { backgroundColor: "var(--note-pink)" } },
    ];
    const color = colors.find((c) => c.name === colorName);
    return color ? color.style : colors[0].style;
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  const handleShareNote = async (noteId, userId, accessLevel) => {
    try {
      const response = await axiosInstance.post(
        `/note/${noteId}/collaborators`,
        {
          userId,
          access: accessLevel,
        }
      );

      if (response.status === 200) {
        return Promise.resolve();
      } else {
        throw new Error(response.data.error || "Failed to share note");
      }
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.error ||
            error.response.data?.message ||
            "Failed to share note"
        );
      } else {
        throw error;
      }
    }
  };

  return (
    <div
      className="cursor-pointer relative flex flex-col transition-all p-4 rounded-xl group"
      style={{
        ...getColorStyle(note?.color),
        minHeight: "140px",
      }}
      onClick={() => setSelectedNote(note)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTogglePin(note?._id, note?.pinnedAt);
        }}
        className={`absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20 transition-opacity

        ${
          note?.pinnedAt ? "opacity-100" : hovered ? "opacity-100" : "opacity-0"
        }`}
        disabled={!canEdit}
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
          {truncateText(getPlainTextPreview(note?.content), 100)}
        </div>
      </div>

      {/* Note footer  */}
      <NoteFooter note={note} />

      {hovered && (
        <motion.div
          className="absolute bottom-2 left-2 right-2 flex justify-between items-center gap-2 px-2 py-1 rounded-lg bg-[var(--bg-ter)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Button
            onClick={() =>
              setShowColorPicker(
                showColorPicker === note?._id ? null : note?._id
              )
            }
            variant="transparent"
            size="icon"
            className="p-1 rounded hover:bg-[var(--bg-secondary)]"
            disabled={!canEdit || isSharedCollaborator}
          >
            <Palette size={16} />
          </Button>

          <Button
            onClick={() => handleArchiveNote(note)}
            variant="transparent"
            size="icon"
            className="p-1 rounded hover:bg-[var(--bg-secondary)]"
            disabled={!canEdit || isSharedCollaborator}
          >
            <Archive size={16} />
          </Button>

          <Button
            onClick={() => onExport(note)}
            variant="transparent"
            size="icon"
            className="p-1 rounded hover:bg-[var(--bg-secondary)]"
          >
            <Download size={16} />
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowSharePopup(true);
            }}
            variant="transparent"
            size="icon"
            className="p-1 rounded hover:bg-[var(--bg-secondary)]"
            disabled={!canEdit || isSharedCollaborator}
          >
            <UserPlus size={16} />
          </Button>

          <Button
            onClick={() => handleSendToTrash(note?._id)}
            variant="transparent"
            size="icon"
            className="p-1 rounded hover:bg-[var(--bg-secondary)]"
            disabled={!canEdit || isSharedCollaborator}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>
        </motion.div>
      )}

      {showColorPicker === note?._id && (
        <motion.div
          className="absolute bottom-12 left-2 border border-[var(--bg-ter)] p-2 shadow-lg z-20 flex gap-1 flex-wrap bg-[var(--bg-ter)] rounded-lg"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {[
            {
              name: "default",
              style: { backgroundColor: "var(--note-default)" },
            },
            { name: "red", style: { backgroundColor: "var(--note-red)" } },
            {
              name: "orange",
              style: { backgroundColor: "var(--note-orange)" },
            },
            {
              name: "yellow",
              style: { backgroundColor: "var(--note-yellow)" },
            },
            { name: "green", style: { backgroundColor: "var(--note-green)" } },
            { name: "blue", style: { backgroundColor: "var(--note-blue)" } },
            {
              name: "purple",
              style: { backgroundColor: "var(--note-purple)" },
            },
            { name: "pink", style: { backgroundColor: "var(--note-pink)" } },
          ].map((color) => (
            <button
              key={color.name}
              onClick={() => handleChangeColor(note?._id, color.name)}
              className="w-6 h-6 cursor-pointer rounded-full border"
              style={{
                ...color.style,
                borderColor:
                  note?.color === color.name
                    ? "var(--btn)"
                    : "var(--bg-secondary)",
                borderWidth: note?.color === color.name ? "2px" : "1px",
              }}
              disabled={!canEdit}
            />
          ))}
        </motion.div>
      )}

      {showSharePopup && (
        <SharePopup
          note={note}
          onClose={() => setShowSharePopup(false)}
          onShare={handleShareNote}
        />
      )}
    </div>
  );
};

export default NoteCard;
