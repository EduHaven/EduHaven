import { useNavigate, useParams } from "react-router-dom";
import FileHandler from "@tiptap/extension-file-handler";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

import NoteEditor from "@/components/notes/NoteEditor.jsx";
import NoteHeader from "@/components/notes/NoteHeader.jsx";
import NotesList from "@/components/notes/NotesList.jsx";

import {
  useArchivedNotes,
  useArchiveNote,
  useCreateNote,
  useDeleteNote,
  useNotes,
  useRestoreTrashedNote,
  useTrashedNotes,
  useTrashNote,
  useUpdateNote,
} from "@/queries/NoteQueries";

import "@/components/notes/note.css";
import TrashNotes from "@/components/notes/TrashNote";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";

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

const Notes = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const isFullScreen = !!noteId;
  const { data: notes = [], isLoading } = useNotes();
  const { data: archiveNotes = [], isLoading: isArchiveLoading } =
    useArchivedNotes();
  const { data: trashNotes = [], isLoading: isTrashLoading } =
    useTrashedNotes();

  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const archiveNoteMutation = useArchiveNote();
  const sendToTrashMutation = useTrashNote();
  const restoreMutation = useRestoreTrashedNote();

  const [status, setStatus] = useState("active"); // active, archive, trash
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);

  useEffect(() => {
    if (noteId && notes.length > 0) {
      const foundNote = notes.find((n) => n._id === noteId);
      if (foundNote) {
        setSelectedNote(foundNote);
      }
    }
  }, [noteId, notes]);

  const notesObj = {
    active: notes,
    archive: archiveNotes,
    trash: trashNotes,
  };

  const typingTimeoutRef = useRef(null);

  const BackspaceOnImage = Extension.create({
    addKeyboardShortcuts() {
      return {
        Backspace: ({ editor }) => {
          const { state } = editor;
          const { $from, empty } = state.selection;
          if (!empty) {
            return false;
          }

          let imageNode = null;
          let imagePos = null;

          if ($from.nodeBefore && $from.nodeBefore.type.name === "image") {
            imageNode = $from.nodeBefore;
            imagePos = $from.pos - $from.nodeBefore.nodeSize;
          } else if ($from.parentOffset === 0) {
            const prevNode = state.doc.resolve($from.pos - 1);
            if (
              prevNode.nodeBefore &&
              prevNode.nodeBefore.type.name === "image"
            ) {
              imageNode = prevNode.nodeBefore;
              imagePos = prevNode.pos - prevNode.nodeBefore.nodeSize;
            }
          } else {
            for (let pos = $from.pos - 1; pos >= 0; pos--) {
              try {
                const resolvedPos = state.doc.resolve(pos);
                const node = resolvedPos.nodeAfter;
                if (node && node.type.name === "image") {
                  imageNode = node;
                  imagePos = pos;

                  break;
                }

                if (node && node.type.name !== "text") {
                  break;
                }
              } catch (e) {
                break;
              }
            }
          }

          if (imageNode) {
            mySpecialImageHandler(imageNode, imagePos, editor);

            return true;
          }

          return false;
        },
      };
    },
  });

  async function mySpecialImageHandler(node, pos, editor) {
    try {
      const src = node.attrs.src;
      if (!src) {
        console.error("No src attribute found on image");
        return;
      }

      const publicId = src.split("/").pop().split(".")[0];

      await axiosInstance.post("/note/deleteimage", { publicId });
      if (pos !== null && pos >= 0) {
        const tr = editor.state.tr.delete(pos, pos + node.nodeSize);
        editor.view.dispatch(tr);
      }
    } catch (err) {
      console.error("Image deletion failed:", err);
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return 'Type "/" for commands, or just start writing...';
        },
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      BackspaceOnImage,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) =>
          handleImageUpload(currentEditor, files, pos),
        onPaste: (currentEditor, files, pos) =>
          handleImageUpload(currentEditor, files, pos),
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: selectedNote?.content || "",
    onUpdate: ({ editor }) => {
      if (!selectedNote) return;

      const content = editor.getHTML();

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        updateNote(selectedNote._id, { content });
      }, 1500); // waits 1500ms after last keystroke
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
    shouldRerenderOnTransaction: true,
  });

  const handleImageUpload = async (editor, files, pos) => {
    const replacePlaceholder = (placeholder, replacement) => {
      const { doc } = editor.state;
      let replaced = false;

      doc.descendants((node, posNode) => {
        if (replaced) return false; // stop early if already replaced
        if (node.isText && node.text && node.text.includes(placeholder)) {
          const idx = node.text.indexOf(placeholder);
          const from = posNode + idx;
          const to = from + placeholder.length;

          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContentAt({ from, to: from }, replacement)
            .run();

          replaced = true;
          return false;
        }
        return true;
      });

      return replaced;
    };

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const safePos =
        typeof pos === "number" ? pos : editor.state.selection.from;
      const uploadId =
        "Uploading-Image" +
        Date.now() +
        "-" +
        Math.random().toString(6).slice(2, 6);
      const placeholder = `[${uploadId}]`;

      editor
        .chain()
        .focus()
        .insertContentAt({ from: safePos, to: safePos }, placeholder)
        .run();

      try {
        const formData = new FormData();
        formData.append("noteImage", file);

        const { data } = await axiosInstance.post("/note/upload", formData);
        const imageUrl = data.noteImageUrl;

        const didReplace = replacePlaceholder(placeholder, {
          type: "image",
          attrs: { src: imageUrl, alt: file.name || "Image" },
        });

        if (!didReplace) {
          const insertPos = editor.state.selection.from;
          editor
            .chain()
            .focus()
            .insertContentAt(
              { from: insertPos, to: insertPos },
              {
                type: "image",
                attrs: { src: imageUrl, alt: file.name || "Image" },
              }
            )
            .run();
        }
      } catch {
        const didReplace = replacePlaceholder(
          placeholder,
          "Failed to upload image"
        );
        if (!didReplace) {
          editor
            .chain()
            .focus()
            .insertContentAt(
              editor.state.selection.from,
              "Failed to upload image"
            )
            .run();
        }
      }
    }
  };

  useEffect(() => {
    if (editor && selectedNote) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedNote.content) {
        editor.commands.setContent(selectedNote.content);
      }
    }
  }, [selectedNote, editor]);

  const createNewNote = () => {
    createNoteMutation.mutate(
      {
        title: `Note ${notes.length + 1}`,
        content: "Write here...",
        color: "default",
        pinnedAt: false,
      },
      {
        onSuccess: (newNote) => setSelectedNote(newNote),
      }
    );
  };

  const updateNote = (id, updates) => {
    updateNoteMutation.mutate({ id, ...updates });
    if (selectedNote && selectedNote._id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (id) => {
    deleteNoteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Note deleted!");
        if (selectedNote?._id === id) setSelectedNote(null);
      },
    });
  };

  const sendToTrashNote = (id) => {
    sendToTrashMutation.mutate(id, {
      onSuccess: () => {
        if (selectedNote?._id === id) setSelectedNote(null);
      },
    });
  };

  const restoreNote = (id) => {
    restoreMutation.mutate(id, {
      onSuccess: () => toast.success("Note restored"),
    });
  };

  const togglePin = (id, pinnedAt) => {
    updateNote(id, { pinnedAt: !pinnedAt });
  };

  const changeColor = (id, color) => {
    updateNote(id, { color });
    setShowColorPicker(null);
  };

  const archiveNote = (note) => {
    archiveNoteMutation.mutate(note._id, {
      onSuccess: () => {
        if (selectedNote?._id === note._id) setSelectedNote(null);
      },
    });
  };

  const exportNote = (note) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = note.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const content = `# ${note.title}\n\n${textContent}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title || "note"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertImage = () => {
    if (!editor) return;

    // Create hidden input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    // Attach change event
    input.addEventListener("change", async () => {
      const files = input?.files;
      console.log(files);
      if (!files || files.length === 0) return;

      try {
        await handleImageUpload(editor, files, editor.state.selection.from); // your upload function
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    });

    // Must be triggered synchronously from user click
    input.click();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url && editor) {
      if (editor.state.selection.empty) {
        const text = prompt("Enter link text:") || url;
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${url}">${text}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const insertTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const getPlainTextPreview = (htmlContent) => {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.substring(0, 100) + (text.length > 100 ? "..." : "");
  };

  const filteredNotes = notesObj[status].filter((note) => {
    const plainContent = getPlainTextPreview(note.content);
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plainContent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pinnedNotes = (notesObj[status] || []).filter((note) => note.pinnedAt);
  const unpinnedNotes = (notesObj[status] || []).filter(
    (note) => !note.pinnedAt
  );

  if (status == "active" && isLoading) {
    return <p>Loading notes...</p>;
  }

  if (status == "archive" && isArchiveLoading) {
    return <p>Loading archived notes...</p>;
  }

  if (status == "trash" && isTrashLoading) {
    return <p>Loading trashed notes...</p>;
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--txt)" }}
    >
      <div className="flex h-screen">
        {/* notes page (also works as sidebar} */}
        <div
          className={`${
            isFullScreen ? "hidden" : selectedNote ? "w-80" : "w-full"
          } overflow-auto p-4`}
        >
          <NoteHeader
            selectedNote={selectedNote}
            createNewNote={createNewNote}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setStatus={setStatus}
            setSelectedNote={setSelectedNote}
            status={status}
          />

          {(status == "active" || status == "archive") && (
            <NotesList
              pinnedNotes={pinnedNotes}
              unpinnedNotes={unpinnedNotes}
              filteredNotes={filteredNotes}
              searchTerm={searchTerm}
              setSelectedNote={setSelectedNote}
              togglePin={togglePin}
              sendToTrashNote={sendToTrashNote}
              archiveNote={archiveNote}
              exportNote={exportNote}
              changeColor={changeColor}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
              colors={colors}
              getPlainTextPreview={getPlainTextPreview}
            />
          )}

          {status == "trash" && (
            <TrashNotes
              notes={trashNotes}
              onDelete={deleteNote}
              onRestore={restoreNote}
              getPlainTextPreview={getPlainTextPreview}
            />
          )}
        </div>

        {/* Note Editor */}
        {selectedNote && (
          <div className="flex-1 flex flex-col">
            <NoteEditor
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              colors={colors}
              editor={editor}
              updateNote={updateNote}
              insertLink={insertLink}
              insertImage={insertImage}
              insertTable={insertTable}
              onClose={() => {
                if (noteId) navigate(-1);
                else setSelectedNote(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
