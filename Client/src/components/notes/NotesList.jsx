import NoteCard from "./NoteCard";
import axiosInstance from "@/utils/axios";
import useNoteStore from '@/stores/useNoteStore';

const NotesList = ({
  pinnedNotes,
  unpinnedNotes,
  filteredNotes,
  togglePin,
  sendToTrashNote,
  archiveNote,
  exportNote,
  changeColor,
  colors,
  getPlainTextPreview,
}) => {
  // Zustand store
  const {
    searchTerm,
    showColorPicker,
    setShowColorPicker
  } = useNoteStore();

  const handleShareNote = async (noteId, userId, accessLevel) => {
    try {
      const response = await axiosInstance.post(`/note/${noteId}/collaborators`, {
        userId,
        access: accessLevel
      });

      if (response.status === 200) {
        return Promise.resolve();
      } else {
        throw new Error(response.data.error || "Failed to share note");
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.error || error.response.data?.message || "Failed to share note");
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      {/* Pinned notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-6">
          <h3
            className="text-xs font-medium uppercase mb-2 mt-0"
            style={{ color: "var(--txt-dim)" }}
          >
            Pinned
          </h3>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note?._id}
                note={note}
                onPin={togglePin}
                onSendToTrash={sendToTrashNote}
                onArchive={archiveNote}
                onExport={exportNote}
                onColorChange={changeColor}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                colors={colors}
                getPlainTextPreview={getPlainTextPreview}
                onShare={handleShareNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unpinned notes */}
      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h3
              className="text-xs font-medium uppercase mb-2 mt-0"
              style={{ color: "var(--txt-dim)" }}
            >
              Others
            </h3>
          )}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note?._id}
                note={note}
                onPin={togglePin}
                onSendToTrash={sendToTrashNote}
                onArchive={archiveNote}
                onExport={exportNote}
                onColorChange={changeColor}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                colors={colors}
                getPlainTextPreview={getPlainTextPreview}
                onShare={handleShareNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <div className="text-center mt-10" style={{ color: "var(--txt-dim)" }}>
          {searchTerm
            ? "No notes found"
            : "No notes yet. Create your first note!"}
        </div>
      )}
    </>
  );
};

export default NotesList;