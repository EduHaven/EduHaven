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

// for framer motion left/right moving animation
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 150 : -150,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -150 : 150,
    opacity: 0,
    scale: 0.95,
  }),
};

function NotesComponent() {
  const { data: notes = [] } = useNotes();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const [isSynced, setIsSynced] = useState(true);
  const [rotate, setRotate] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // This function manages whether to update note or create new.
  const handleSync = (title, content) => {
    setRotate(true);
    setTimeout(() => setIsSynced(true), 700);
    const note = notes[currentPage];
    if (!note?._id) {
      handleAddNote(title, content);
      return;
    }
    // Update note
    updateNoteMutation.mutate({ id: note._id, title, content });
  };

  const addNewPage = () => {
    createNoteMutation.mutate(
      {
        title: "",
        content: "",
        color: "default",
        pinnedAt: false,
      },
      {
        onSuccess: (newNote) => {
          setCurrentPage(notes.length); // go to new note
        },
        onError: (err) => setError("Failed to add note"),
      }
    );
  };

  const goToNextPage = () => {
    if (currentPage < notes.length - 1) {
      setDirection(1); // moving forward
      setCurrentPage((prev) => prev + 1);
      setTitleError("");
      setContentError("");
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setDirection(-1); // moving backward
      setCurrentPage((prev) => prev - 1);
      setTitleError("");
      setContentError("");
    }
  };

  const handleAddNote = (title, content) => {
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required.");
      return;
    }
    createNoteMutation.mutate(
      {
        title,
        content,
        color: "default",
        pinnedAt: false,
      },
      {
        onError: (err) => setError("Failed to add note"),
      }
    );
  };

  const handleDeleteNote = (id) => {
    deleteNoteMutation.mutate(id, {
      onError: () => setError("Failed to delete note"),
    });
  };

  const validateFields = (title, content) => {
    if (!title.trim()) setTitleError("*title is required");
    else setTitleError("");

    if (!content.trim()) setContentError("*content is required");
    else setContentError("");
  };

  const handleTitleChange = (event) => {
    const updatedTitle = event.target.value;
    const noteIndex = currentPage;
    const currentContent = notes[noteIndex]?.content || "";
    validateFields(updatedTitle, currentContent);
    if (error) setError("");
    const noteId = notes[noteIndex]?._id;
    if (updatedTitle.trim() && currentContent.trim()) {
      if (isSynced) {
        setIsSynced(false);
        setRotate(false);
      }
      clearTimeout(titleTimeoutRef.current);
      titleTimeoutRef.current = setTimeout(() => {
        if (noteId) {
          updateNoteMutation.mutate({ id: noteId, title: updatedTitle });
        }
        handleSync(updatedTitle, notes[noteIndex].content);
      }, 3000);
    } else {
      clearTimeout(titleTimeoutRef.current);
      if (!isSynced) {
        setIsSynced(true);
        setRotate(false);
      }
    }
  };

  return (
    <div className="group relative w-full h-[404px] rounded-3xl mx-auto overflow-hidden bg- red-500">
      <TopControls
        notes={notes}
        addNew={addNewPage}
        currentPage={currentPage}
        next={goToNextPage}
        prev={goToPreviousPage}
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
          {error && console.error(error)}

          <NoteTitle
            notes={notes}
            titleChange={handleTitleChange}
            currentPage={currentPage}
            titleError={titleError}
          />

          <NoteContent
            err={contentError}
            setError={setError}
            notes={notes}
            currentPage={currentPage}
            setRotate={setRotate}
            isSynced={isSynced}
            setIsSynced={setIsSynced}
            contentTimeoutRef={contentTimeoutRef}
            handleSync={handleSync}
            validateFields={validateFields}
          />

          <BottomControls
            isSynced={isSynced}
            rotate={rotate}
            notes={notes}
            currentPage={currentPage}
            onDelete={handleDeleteNote}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default NotesComponent;
