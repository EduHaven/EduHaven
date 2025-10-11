import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, User } from "lucide-react";

const SharedNoteView = ({ sharedNote, onClose }) => {
  // Function to safely render HTML content
  const renderNoteContent = (content) => {
    return { __html: content };
  };

  const getColorStyle = (colorName) => {
    const colors = [
      { name: "default", style: { backgroundColor: "var(--bg-primary)" } },
      { name: "blue", style: { backgroundColor: "#dbeafe" } },
      { name: "green", style: { backgroundColor: "#d1fae5" } },
      { name: "pink", style: { backgroundColor: "#fce7f3" } },
      { name: "purple", style: { backgroundColor: "#f3e8ff" } },
      { name: "yellow", style: { backgroundColor: "#fef9c3" } },
      { name: "orange", style: { backgroundColor: "#ffedd5" } },
    ];

    return colors.find((c) => c.name === colorName)?.style || colors[0].style;
  };

  if (!sharedNote) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="text-[var(--txt-dim)]">
            Note not found or link has expired
          </div>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[var(--bg-primary)] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl border border-[var(--bg-ter)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={getColorStyle(sharedNote.color)}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--bg-ter)]">
          <div className="flex items-center justify-end mb-4">
            <Button
              variant="transparent"
              size="icon"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--bg-ter)]"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Note Title */}
          <h1 className="text-2xl font-bold text-[var(--txt)] mb-2">
            {sharedNote.title}
          </h1>

          {/* Owner Info */}
          <div className="flex items-center gap-2 text-sm text-[var(--txt-dim)]">
            <User size={14} />
            <span>
              Shared by {sharedNote.owner.FirstName} {sharedNote.owner.LastName}
            </span>
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div
            className="prose max-w-none min-h-full"
            style={{
              color: "var(--txt)",
              fontFamily: "inherit",
            }}
          >
            {/* Render the HTML content safely */}
            <div
              dangerouslySetInnerHTML={renderNoteContent(sharedNote.content)}
              className="shared-note-content"
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SharedNoteView;
