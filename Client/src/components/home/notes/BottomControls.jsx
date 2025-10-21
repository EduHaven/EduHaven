import { useNavigate } from "react-router-dom";
import {
  Trash,
  Palette,
  UserPlus,
  Maximize,
  Check,
  Download,
  Archive,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import SharePopup from "@/components/notes/SharePopup";
import axiosInstance from "@/utils/axios";
import { createPortal } from "react-dom";

const exportNote = (note) => {
  console.log("clicked download");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = note.content;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  const content = `# ${note.title}\n\n${textContent}`;

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.title || "note"}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

function BottomControls({
  isSynced,
  rotate,
  notes,
  currentPage,
  onDelete,
  onArchive,
  colors,
  showColorPicker,
  setShowColorPicker,
  changeColor,
  archivingNoteId,
}) {
  const navigate = useNavigate();

  // add user button / share note functionality
  const [showSharePopup, setShowSharePopup] = useState(false);

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
    <>
      <div className="flex justify-between items-center w-full px-3 p-2 absolute bottom-0 left-0 group-hover:bg-gradient-to-t from-[var(--bg-sec)] via-[var(--bg-sec)] to-transparent">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            title="Change color"
            onClick={() => setShowColorPicker(!showColorPicker)}
            variant="transparent"
            size="icon"
            className=" hover:bg-[var(--bg-ter)] rounded-full"
          >
            <Palette className="size-5" />
          </Button>
          <Button
            title="Download note"
            onClick={() => exportNote(notes[currentPage])}
            variant="transparent"
            size="icon"
            className=" hover:bg-[var(--bg-ter)] rounded-full"
          >
            <Download className="size-5" />
          </Button>
          <Button
            title="Add people"
            onClick={(e) => {
              e.stopPropagation();
              setShowSharePopup(true);
            }}
            variant="transparent"
            size="icon"
            className=" hover:bg-[var(--bg-ter)] rounded-full"
          >
            <UserPlus className="size-5" />
          </Button>
          <Button
            title="Open in full screen"
            onClick={() =>
              navigate(`/notes/${notes[currentPage]?._id || "new"}`)
            }
            variant="transparent"
            size="icon"
            className=" hover:bg-[var(--bg-ter)] rounded-full"
          >
            <Maximize className="size-5" />
          </Button>
          {notes[currentPage]?.content !== "" &&
            notes[currentPage]?.title !== "" && (
              <>
                <Button
                  title="Move to archive"
                  onClick={() => onArchive(notes[currentPage])}
                  variant="transparent"
                  size="icon"
                  className=" hover:bg-[var(--btn)] rounded-full"
                  disabled={archivingNoteId === notes[currentPage]?._id}
                >
                  {archivingNoteId === notes[currentPage]?._id ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Archive className="size-5" />
                  )}
                </Button>
                <Button
                  title="Move to trash"
                  onClick={() => onDelete(notes[currentPage]?._id)}
                  variant="transparent"
                  size="icon"
                  className=" hover:bg-red-500 rounded-full"
                >
                  <Trash className="size-5" />
                </Button>
              </>
            )}
          {!isSynced && (
            <Button variant="transparent" size="default" className="p-0">
              {rotate ? (
                <Check className="text-green-400 size-5" />
              ) : (
                <div className="size-2 rounded-full bg-yellow-300 border"></div>
              )}
            </Button>
          )}
        </div>

        {showColorPicker && (
          <motion.div
            className="absolute bottom-16 left-2 border p-2 shadow-lg z-30 flex gap-1 flex-wrap bg-[var(--bg-ter)] rounded-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 10 }}
          >
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => changeColor(color.name)}
                className="w-6 h-6 cursor-pointer rounded-full border hover:scale-110 transition-transform"
                title={`${color.name} color`}
                style={{
                  ...color.style,
                  borderColor:
                    notes[currentPage]?.color === color.name
                      ? "var(--btn)"
                      : "var(--bg-sec)",
                  borderWidth:
                    notes[currentPage]?.color === color.name ? "2px" : "1px",
                }}
              />
            ))}
          </motion.div>
        )}

        <div className="bg-[var(--bg-sec)] txt-disabled p-1 px-2 rounded-full">
          {notes[currentPage]?.createdAt
            ? new Date(notes[currentPage].createdAt).toLocaleDateString() +
              "\u00A0\u00A0\u00A0" +
              new Date(notes[currentPage].createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "No date available"}
        </div>
      </div>

      {showSharePopup && typeof document !== "undefined" && (
        <>
          {createPortal(
            <SharePopup
              note={notes[currentPage]}
              onClose={() => setShowSharePopup(false)}
              onShare={handleShareNote}
            />,
            document.body
          )}
        </>
      )}
    </>
  );
}

export default BottomControls;
