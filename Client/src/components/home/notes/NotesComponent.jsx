import { useState, useRef } from "react";
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/queries/NoteQueries";
import NoteTitle from "./Title";
import TopControls from "./TopControls";
import BottomControls from "./BottomControls";
import NoteContent from "./content";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 150 : -150,
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -150 : 150,
    opacity: 0,
    scale: 0.95,
  }),
};

function NotesComponent() {
  const { data: notes = [], isLoading, isError } = useNotes();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Failed to load notes</p>;

  const handleAddNote = (title, content) => {
    if (!title.trim() || !content.trim()) {
      return;
    }
    createNoteMutation.mutate({ title, content });
  };

  const handleDeleteNote = (id) => {
    deleteNoteMutation.mutate(id);
  };

  const handleTitleChange = (event) => {
    const updatedTitle = event.target.value;
    const noteId = notes[currentPage]?._id;

    if (!noteId) return;
    clearTimeout(titleTimeoutRef.current);

    titleTimeoutRef.current = setTimeout(() => {
      updateNoteMutation.mutate({ id: noteId, title: updatedTitle });
    }, 1000);
  };

  const handleContentChange = (updatedContent) => {
    const noteId = notes[currentPage]?._id;
    if (!noteId) return;
    clearTimeout(contentTimeoutRef.current);
    contentTimeoutRef.current = setTimeout(() => {
      updateNoteMutation.mutate({ id: noteId, content: updatedContent });
    }, 1000);
  };

  const handleAddNewPage = () => {
    handleAddNote("Untitled", "");
    setCurrentPage(notes.length); // Go to the new note (will be last after mutation)
  };

  return (
    <div className="group relative w-full h-[404px] rounded-3xl mx-auto overflow-hidden">
      <TopControls
        notes={notes}
        addNew={handleAddNewPage}
        currentPage={currentPage}
        next={() => setCurrentPage((p) => Math.min(p + 1, notes.length - 1))}
        prev={() => setCurrentPage((p) => Math.max(p - 1, 0))}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="group bg-sec txt rounded-3xl py-6 pb-3 2xl:px-3 shadow z-10 absolute w-full overflow-hidden"
        >
          <NoteTitle
            notes={notes}
            titleChange={handleTitleChange}
            currentPage={currentPage}
            titleError={titleError}
          />

          <NoteContent
            notes={notes}
            currentPage={currentPage}
            onContentChange={handleContentChange}
            contentTimeoutRef={contentTimeoutRef}
            err={contentError}
          />

          <BottomControls
            notes={notes}
            currentPage={currentPage}
            onDelete={handleDeleteNote}
            isSynced={!updateNoteMutation.isLoading} // false when updating, true when synced
            rotate={updateNoteMutation.isSuccess}    // true when update is successful
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default NotesComponent;
