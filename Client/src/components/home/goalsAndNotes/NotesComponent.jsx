import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Plus,
  RefreshCcwDot,
} from "lucide-react";
const backendUrl = import.meta.env.VITE_API_URL;

function NotesComponent() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const [isSynced, setIsSynced] = useState(true);
  const [rotate, setRotate] = useState(false); // used to rotate sync icon
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const textAreaRef = useRef(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchNotes();

    if (textAreaRef.current) {
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
    return () => {
      clearTimeout(titleTimeoutRef.current);
      clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  // Add effect to update scroll height when notes change
  useEffect(() => {
    if (textAreaRef.current) {
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
  }, [notes, currentPage]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/note`, getAuthHeader());
      if (response.data.success) {
        if (!response.data.data || response.data.data.length === 0) {
          addNewPage(); // adding new is necessary cause we get err in posting data to db.
        } else {
          setNotes(response.data.data);
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
      setCurrentPage((prev) => prev + 1);
      setTitleError("");
      setContentError("");
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
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
      const response = await axios.post(
        `${backendUrl}/note`,
        {
          title: title,
          content: content,
        },
        getAuthHeader()
      );

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
      // If the note has an ID, delete it from the server
      if (id) {
        const response = await axios.delete(
          `${backendUrl}/note/${id}`,
          getAuthHeader()
        );
        if (response.data.success) {
          fetchNotes();
        }
      } else {
        // If no ID (unsaved note), just remove it from local state
        setNotes(prevNotes => prevNotes.filter((_, index) => index !== currentPage));
        if (notes.length > 1) {
          setCurrentPage(Math.max(0, currentPage - 1));
        } else {
          // If this was the last note, clear the notes array to show empty state
          setNotes([]);
          setCurrentPage(0);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete note try refreshing page"
      );
    }
  };

  const validateFields = (title, content) => {
    if (!title.trim()) setTitleError("*title is required");
    else setTitleError("");

    if (!content.trim()) setContentError("*content is required");
    else setContentError("");
  };

  const handleNoteContentChange = (event) => {
    const updatedText = event.target.value;
    const noteIndex = currentPage;

    const currentTitle = notes[noteIndex]?.title || "";
    validateFields(currentTitle, updatedText);

    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === noteIndex ? { ...note, content: updatedText } : note
      )
    );

    if (error) setError("");

    if (updatedText.trim() && currentTitle.trim()) {
      if (isSynced) {
        setIsSynced(false);
        setRotate(false);
      }

      clearTimeout(contentTimeoutRef.current);

      const noteId = notes[noteIndex]?._id;
      const contentToSave = updatedText.trim();

      contentTimeoutRef.current = setTimeout(async () => {
        try {
          if (noteId) {
            await axios.put(
              `${backendUrl}/note/${noteId}`,
              { content: contentToSave },
              getAuthHeader()
            );
          }
          handleSync(notes[noteIndex].title, updatedText); // sets synced = true
        } catch (err) {
          console.error("Error updating note content:", err);
          setError("Failed to save changes");
          setIsSynced(true);
        }
      }, 3000);
    } else {
      clearTimeout(contentTimeoutRef.current);
      if (!isSynced) {
        setIsSynced(true);
        setRotate(false);
      }
    }
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
            await axios.put(
              `${backendUrl}/note/${noteId}`,
              { title: titleToSave },
              getAuthHeader()
            );
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

  const handleScroll = () => {
    if (textAreaRef.current) {
      setScrollPosition(textAreaRef.current.scrollTop);
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
  };

  return (
    <div className="bg-sec txt rounded-3xl py-6 px-3 w-full mx-auto relative shadow">
      {error && console.error(error)}

      {/* If there are no notes, show  box with plus icon */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-white/20 backdrop-blur-md rounded-2xl border-2 border-dashed border-yellow-300 mb-6">
          <button
            className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-500 focus:outline-none"
            onClick={addNewPage}
            aria-label="Add Note"
          >
            <Plus className="w-12 h-12 mb-2" />
            <span className="text-lg font-semibold">Add Note</span>
          </button>
        </div>
      )}

      {/* If there are notes, show navigation and note editor */}
      {notes.length > 0 && (
        <>
          {/* Note editor */}
          <div className="flex flex-col">
            {/* Navigation */}
            <div className="flex justify-between px-3 mb-4">
              <div className="flex gap-4 items-center">
                <h3 className="text-2xl font-semibold">Notes</h3>
                {/* Note selector dropdown */}
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm txt focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {notes.map((note, idx) => (
                    <option key={idx} value={idx} className="bg-sec">
                      {note.title || `Note ${idx + 1}`}
                    </option>
                  ))}
                </select>
                {/* Add Note Button */}
                <button
                  onClick={addNewPage}
                  className="flex items-center gap-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-medium transition-colors"
                  title="Add New Note"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex space-x-2 items-center">
                <span className="text-yellow-300 opacity-90 text-lg">
                  {notes.length > 0 ? `${currentPage + 1}/${notes.length}` : "1/1"}
                </span>
                <button
                  onClick={goToPreviousPage}
                  className={`p-1.5 rounded-full hover:bg-ter ${currentPage === 0 ? "txt-dim" : ""}`}
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={goToNextPage}
                  className={`p-1.5 rounded-full hover:bg-ter ${currentPage === notes.length - 1 ? "txt-dim" : ""}`}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            {/* Title, Delete and Sync Button */}
            <div className="flex justify-between items-center w-full px-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={notes[currentPage]?.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Title"
                  autoFocus
                  className="bg-transparent outline-none p-0.5 text-lg w-full font-semibold text-yellow-400 opacity-85"
                />
                {titleError && (
                  <p className="text-red-400 text-xs absolute -bottom-3">{titleError}</p>
                )}
              </div>
              {!isSynced && (
                <button className="text-black text-lg hover:bg-yellow-300 rounded-full mx-3 py-0.5 px-4 bg-yellow-400 flex items-center gap-2 transition-transform transform opacity-100">
                  sync
                  <div
                    className="h-4"
                    style={{
                      transform: rotate ? "rotate(-360deg)" : "rotate(0deg)",
                      transition: "transform 0.7s ease-in-out",
                    }}
                  >
                    <RefreshCcwDot className="h-4" />
                  </div>
                </button>
              )}
              {notes.length > 0 && (
                <button 
                  onClick={() => handleDeleteNote(notes[currentPage]?._id)}
                  className="p-1.5 rounded-full hover:bg-red-500/20 transition-colors"
                  title="Delete note"
                >
                  <Trash className="h-5 txt-dim hover:text-red-500" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="relative w-full h-64 overflow-hidden bg-white/5 rounded-lg border border-white/10">
              <div
                className="absolute w-full pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 24px, rgba(255, 255, 255, 0.15) 24px, rgba(255, 255, 255, 0.15) 25px)`,
                  backgroundSize: "100% 32px",
                  transform: `translateY(-${scrollPosition}px)`,
                  height: `${Math.max(scrollHeight, 256)}px`,
                  marginTop: "8px",
                  zIndex: 1,
                }}
              ></div>
              <textarea
                ref={textAreaRef}
                id="area"
                className="relative w-full h-full bg-transparent txt-dim p-2 px-3 outline-none resize-none font-kalam font-light"
                style={{
                  lineHeight: "32px",
                  paddingTop: "8px",
                  paddingBottom: "40px",
                  zIndex: 2,
                  position: "relative",
                }}
                placeholder="Take a note..."
                onScroll={handleScroll}
                value={notes[currentPage]?.content}
                onChange={handleNoteContentChange}
                autoFocus={notes[currentPage]?.content === ""}
              ></textarea>
            </div>

            {/* Error and Date Section */}
            <div className="flex justify-between items-end mt-2 px-3">
              {/* Content Error */}
              {contentError && (
                <span className="text-red-400 text-xs">{contentError}</span>
              )}
              
              {/* Date and Time */}
              <div className="txt-dim text-sm">
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

            {/* Floating New Note Button */}
            <button
              className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              onClick={addNewPage}
              title="Add New Note"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NotesComponent;
