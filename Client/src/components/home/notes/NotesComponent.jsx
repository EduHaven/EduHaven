import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Plus,
  RefreshCcwDot,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";

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

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Take a note...",
      }),
    ],
    content: notes[currentPage]?.content || "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const noteIndex = currentPage;
      const currentTitle = notes[noteIndex]?.title || "";

      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((note, index) =>
          index === noteIndex ? { ...note, content } : note
        )
      );

      // Validate fields
      validateFields(currentTitle, content);

      if (error) setError("");

      // Auto-save logic
      if (content.trim() && currentTitle.trim()) {
        if (isSynced) {
          setIsSynced(false);
          setRotate(false);
        }

        clearTimeout(contentTimeoutRef.current);
        const noteId = notes[noteIndex]?._id;
        const contentToSave = content.trim();

        contentTimeoutRef.current = setTimeout(async () => {
          try {
            if (noteId) {
              await axiosInstance.put(`/note/${noteId}`, {
                content: contentToSave,
              });
            }
            handleSync(notes[noteIndex].title, content);
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
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
        style: "line-height: 32px; padding-top: 8px;",
      },
    },
  });

  // Update editor content when currentPage changes
  useEffect(() => {
    if (editor && notes[currentPage]) {
      const currentContent = editor.getHTML();
      if (currentContent !== notes[currentPage].content) {
        editor.commands.setContent(notes[currentPage].content || "");
      }
    }
  }, [currentPage, notes, editor]);

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

  const handleScroll = () => {
    if (textAreaRef.current) {
      setScrollPosition(textAreaRef.current.scrollTop);
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
  };

  return (
    <div className="bg-sec txt rounded-3xl py-6 px-3 w-full mx-auto relative shadow">
      {error && console.error(error)}

      {/* Navigation */}
      <div className="flex justify-between px-3">
        <div className="flex gap-4 items-center">
          <h3 className="text-2xl font-semibold">Notes</h3>
          <Button
            onClick={addNewPage}
            variant="transparent"
            size="icon"
            className="p-1.5 rounded-full hover:bg-ter"
          >
            <Plus />
          </Button>
        </div>
        <div className="flex space-x-2 items-center">
          <span className="opacity-90 text-lg">
            {notes.length > 0 ? `${currentPage + 1}/${notes.length}` : "1/1"}
          </span>
          <Button
            onClick={goToPreviousPage}
            variant="transparent"
            size="icon"
            className={`p-1.5 rounded-full hover:bg-ter ${currentPage === 0 ? "txt-dim" : ""}`}
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={goToNextPage}
            variant="transparent"
            size="icon"
            className={`p-1.5 rounded-full hover:bg-ter ${currentPage === notes.length - 1 ? "txt-dim" : ""}`}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Title, Delete and Sync Button */}
      <div className="flex justify-between mt-5 items-center w-full px-3 mb-1.5">
        <div className="flex-1 relative">
          <input
            type="text"
            value={notes[currentPage]?.title || ""}
            onChange={handleTitleChange}
            placeholder="Title"
            className="bg-transparent outline-none p-0.5 text-lg w-full font-semibold opacity-85"
          />
          {titleError && (
            <p className="text-red-400 text-xs absolute -bottom-3">
              {titleError}
            </p>
          )}
        </div>

        {!isSynced && (
          <Button
            variant="default"
            size="default"
            className="text-black text-lg hover:bg-yellow-300 rounded-full mx-3 py-0.5 px-4 flex items-center gap-2 transition-transform transform opacity-100"
          >
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
          </Button>
        )}
        {notes[currentPage]?.content !== "" &&
          notes[currentPage]?.title !== "" && (
            <Button
              onClick={() => handleDeleteNote(notes[currentPage]?._id)}
              variant="transparent"
              size="icon"
              className="txt-dim hover:text-red-500"
            >
              <Trash className="h-5" />
            </Button>
          )}
      </div>

      {/* Content with TipTap Editor */}
      <div className="relative w-full h-64 overflow-hidden">
        <div
          className="absolute w-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 30px, #6E6E6E 39px )`,
            backgroundSize: "100% 32px",
            transform: `translateY(-${scrollPosition}px)`,
            height: `${scrollHeight}px`,
            marginTop: "2px",
          }}
        ></div>
        <div
          className="relative w-full h-full bg-transparent txt-dim p-2 px-3 font-kalam font-light overflow-auto"
          style={{
            lineHeight: "32px",
            paddingTop: "8px",
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {contentError && (
        <span className="text-red-400 text-xs mt-1 absolute bottom-4 left-3">
          {contentError}
        </span>
      )}

      {/* Date and Time */}
      <div className="absolute bottom-4 right-12 txt-dim bg-sec flex justify-between">
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
