import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import NoteTitle from "./Title";
import TopControls from "./TopControls";
import BottomControls from "./BottomControls";
import NoteContent from "./content";
import { motion, AnimatePresence } from "framer-motion";
import "@/components/notes/note.css";
import { useArchiveNote } from "@/queries/NoteQueries";
import { useToast } from "@/contexts/ToastContext";

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [archivingNoteId, setArchivingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const archiveNoteMutation = useArchiveNote();

  useEffect(() => {
    fetchNotes();

    return () => {
      clearTimeout(titleTimeoutRef.current);
      clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  // Handled adding new page at the start
  const addNewPage = () => {
    const newNote = {
      title: "",
      content: "",
      date: new Date(),
      color: "default",
    };
    // Add the new note to the beginning of the array
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentPage(0);
    setDirection(-1);
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
        color: "default",
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

  const changeColor = async (color) => {
    const noteIndex = currentPage;
    const noteId = notes[noteIndex]?._id;

    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === noteIndex ? { ...note, color } : note
      )
    );

    setShowColorPicker(false);

    if (noteId) {
      try {
        await axiosInstance.put(`/note/${noteId}`, { color });
        setRotate(true);
        setTimeout(() => setIsSynced(true), 700);
      } catch (err) {
        console.error("Error updating note color:", err);
        setError("Failed to save color change");
        // Revert the change
        setNotes((prevNotes) =>
          prevNotes.map((note, index) =>
            index === noteIndex
              ? { ...note, color: note.color || "default" }
              : note
          )
        );
      }
    }
  };

  // Handled delete note
  const handleDeleteNote = async (id) => {
    try {
      const response = await axiosInstance.delete(`/note/${id}`);
      if (response.data.success) {
        //Adjusting the current page before fetching new notes
        if (currentPage >= notes.length - 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        }
        fetchNotes();
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to delete note try refreshing page"
      );
    }
  };

  // Handle archive note
  const handleArchiveNote = (note) => {
    const noteId = note._id || note.id;
    if (!noteId) return;

    const truncateTitle = (title, maxLength = 30) => {
      if (!title || title.length <= maxLength) return title || "Untitled";
      return title.substring(0, maxLength) + "...";
    };

    setArchivingNoteId(noteId);
    archiveNoteMutation.mutate(noteId, {
      onSuccess: () => {
        const truncatedTitle = truncateTitle(note.title);
        toast.success(`Note "${truncatedTitle}" is archived`);
        setArchivingNoteId(null);

        // Refresh notes after archiving
        if (currentPage >= notes.length - 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        }
        fetchNotes();
      },
      onError: () => {
        setArchivingNoteId(null);
        toast.error("Failed to archive note");
      },
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

  const getColorStyle = (colorName) => {
    const color = colors.find((c) => c.name === colorName);
    return color ? color.style : colors[0].style;
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
          className="group txt rounded-3xl py-6 pb-3 2xl:px-3 shadow z-10 absolute w-full overflow-hidden"
          style={{
            ...getColorStyle(notes[currentPage]?.color || "default"),
          }}
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
            isLoading={isLoading}
          />

          <BottomControls
            isSynced={isSynced}
            rotate={rotate}
            notes={notes}
            currentPage={currentPage}
            onDelete={handleDeleteNote}
            onArchive={handleArchiveNote}
            colors={colors}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            changeColor={changeColor}
            archivingNoteId={archivingNoteId}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default NotesComponent;
