import NoteCard from "./NoteCard";

const NotesList = ({
  pinnedNotes,
  unpinnedNotes,
  filteredNotes,
  searchTerm,
  setSelectedNote,
  togglePin,
  sendToTrashNote,
  archiveNote,
  exportNote,
  changeColor,
  showColorPicker,
  setShowColorPicker,
  colors,
  getPlainTextPreview,
}) => {
  // When searching, use filtered notes; otherwise use separated pinned/unpinned
  const displayPinnedNotes = searchTerm
    ? pinnedNotes.filter((note) =>
        filteredNotes.some((fn) => fn._id === note._id)
      )
    : pinnedNotes;

  const displayUnpinnedNotes = searchTerm
    ? unpinnedNotes.filter((note) =>
        filteredNotes.some((fn) => fn._id === note._id)
      )
    : unpinnedNotes;

  return (
    <>
      {/* Pinned notes */}
      {displayPinnedNotes.length > 0 && (
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
            {displayPinnedNotes.map((note) => (
              <NoteCard
                key={note?._id}
                note={note}
                onSelect={setSelectedNote}
                onPin={togglePin}
                onSendToTrash={sendToTrashNote}
                onArchive={archiveNote}
                onExport={exportNote}
                onColorChange={changeColor}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                colors={colors}
                getPlainTextPreview={getPlainTextPreview}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unpinned notes */}
      {displayUnpinnedNotes.length > 0 && (
        <div>
          {displayPinnedNotes.length > 0 && (
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
            {displayUnpinnedNotes.map((note) => (
              <NoteCard
                key={note?._id}
                note={note}
                onSelect={setSelectedNote}
                onPin={togglePin}
                onSendToTrash={sendToTrashNote}
                onArchive={archiveNote}
                onExport={exportNote}
                onColorChange={changeColor}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                colors={colors}
                getPlainTextPreview={getPlainTextPreview}
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
