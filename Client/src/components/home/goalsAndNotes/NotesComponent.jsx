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
  const [contentError, setContentError] = useState("")
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

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/note`,
        getAuthHeader()
      );
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
    if (
      title.trim() === "" ||
      content.trim() === ""
    ) {
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
      const response = await axios.delete(
        `${backendUrl}/note/${id}`,
        getAuthHeader()
      );
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
    if (!title.trim()) {
      setTitleError("*title is required")
    }
    else {
      setTitleError("")
    }

    if (!content.trim()) {
      setContentError("*content is required")
    }
    else {
      setContentError("")
    }
  }


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
    <div className="bg-sec txt rounded-2xl sm:rounded-3xl py-4 sm:py-6 px-2 sm:px-3 w-full mx-auto relative shadow">
      {error && console.error(error)}

      {/* Navigation */}
      <div className="flex justify-between px-2 sm:px-3">
        <div className="flex gap-2 sm:gap-4 items-center">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">Notes</h3>
          <button
            className="p-1 sm:p-1.5 rounded-full hover:bg-ter"
            onClick={addNewPage}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex space-x-1 sm:space-x-2 items-center">
          <span className="text-yellow-300 opacity-90 text-sm sm:text-lg">
            {notes.length > 0 ? `${currentPage + 1}/${notes.length}` : "1/1"}
          </span>
          <button
            onClick={goToPreviousPage}
            className={`p-1 sm:p-1.5 rounded-full hover:bg-ter ${currentPage === 0 ? "txt-dim" : ""
              }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={goToNextPage}
            className={`p-1 sm:p-1.5 rounded-full hover:bg-ter ${currentPage === notes.length - 1 ? "txt-dim" : ""
              }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Title, Delete and Sync Button */}
      <div className="flex justify-between mt-4 sm:mt-5 items-center w-full px-2 sm:px-3 mb-1.5">
        <div className="flex-1 relative">
          <input
            type="text"
            value={notes[currentPage]?.title || ""}
            onChange={handleTitleChange}
            placeholder="Title"
            className="bg-transparent outline-none p-0.5 text-base sm:text-lg w-full font-semibold text-yellow-400 opacity-85"
          />
          {titleError && <p className="text-red-400 text-xs absolute -bottom-3">{titleError}</p>}
        </div>

        {!isSynced && (
          <button
            className="text-black text-sm sm:text-lg hover:bg-yellow-300 rounded-full mx-2 sm:mx-3 py-0.5 px-2 sm:px-4 bg-yellow-400 flex items-center gap-1 sm:gap-2 transition-transform transform opacity-100"
          >
            <span className="hidden sm:inline">sync</span>
            <span className="sm:hidden">S</span>
            <div
              className="h-3 sm:h-4"
              style={{
                transform: rotate ? "rotate(-360deg)" : "rotate(0deg)",
                transition: "transform 0.7s ease-in-out",
              }}
            >
              <RefreshCcwDot className="h-3 sm:h-4" />
            </div>
          </button>
        )}
        <button onClick={() => handleDeleteNote(notes[currentPage]?._id)}>
          <Trash className="h-4 sm:h-5 txt-dim hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
        <div
          className="absolute w-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 26px, #6E6E6E 27px )`,
            backgroundSize: "100% 28px",
            transform: `translateY(-${scrollPosition}px)`,
            height: `${scrollHeight}px`,
            marginTop: "2px",
          }}
        ></div>

        <textarea
          ref={textAreaRef}
          id="area"
          className="relative w-full h-full bg-transparent txt-dim p-2 px-2 sm:px-3 outline-none resize-none font-kalam font-light text-sm sm:text-base"
          style={{
            lineHeight: "28px",
            paddingTop: "6px",
          }}
          placeholder="Take a note..."
          onScroll={handleScroll}
          value={notes[currentPage]?.content}
          onChange={handleNoteContentChange}
        ></textarea>
      </div>
      {contentError && <span className="text-red-400 text-xs mt-1 absolute bottom-3 sm:bottom-4 left-2 sm:left-3">{contentError}</span>}

      {/* Date and Time */}
      <div className="absolute bottom-3 sm:bottom-4 right-8 sm:right-12 txt-dim bg-sec flex justify-between text-xs sm:text-sm">
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
  );
}

export default NotesComponent;
