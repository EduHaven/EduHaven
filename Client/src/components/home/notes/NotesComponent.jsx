import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/utils/axios";
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
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const [isSynced, setIsSynced] = useState(true);
  const [rotate, setRotate] = useState(false); // to indicate when tick icon when it starts saving.
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchNotes();

    return () => {
      clearTimeout(titleTimeoutRef.current);
      clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get(`/note`);
      if (response.data.success) {
        if (!response.data.data || response.data.data.length === 0) {
          addNewPage(); // adding new is necessary cause we get err in posting data to db.
        } else {
          setNotes(response.data.data);
          console.log("fetched notes", response.data.data);
        }
      } else {
        setError("Something wrong at our end");
      }
    } catch (err) {
      setError(err?.response?.data?.error);
    }
  };

  // This function manages whether to update note or create new.
  const handleSync = (title, content) => {
    setRotate(true);
    setTimeout(() => setIsSynced(true), 700);
    if (notes[currentPage]._id === undefined) {
      handleAddNote(title, content);
      return;
    }
  };

  const addNewPage = () => {
    const newNote = { content: "", title: "", date: new Date() };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentPage(notes.length);
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

  const handleAddNote = async (title, content) => {
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/note`, {
        title: title,
        content: content,
      });

      if (response.data.success) {
        fetchNotes();
        setError(""); // Clear errors
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add note try refreshing page"
      );
      console.log(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await axiosInstance.delete(`/note/${id}`);
      if (response.data.success) {
        fetchNotes();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete note try refreshinng page"
      );
    }
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

    // Update title in local state
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === noteIndex ? { ...note, title: updatedTitle } : note
      )
    );

    if (error) setError("");
    const noteId = notes[noteIndex]?._id;

    if (updatedTitle.trim() && currentContent.trim()) {
      if (isSynced) {
        setIsSynced(false);
        setRotate(false);
      }

      clearTimeout(titleTimeoutRef.current);

      const titleToSave = updatedTitle.trim();

      titleTimeoutRef.current = setTimeout(async () => {
        try {
          if (noteId) {
            await axiosInstance.put(`/note/${noteId}`, { title: titleToSave });
          }
          handleSync(updatedTitle, notes[noteIndex].content); // sets synced = true after delay
        } catch (err) {
          console.error("Error updating note title:", err);
          setError("Failed to save changes");
          setIsSynced(true); // Reset sync state on error
        }
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
            setNotes={setNotes}
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
