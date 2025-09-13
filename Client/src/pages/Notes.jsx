import FileHandler from "@tiptap/extension-file-handler";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
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
import { useEffect, useState } from "react";

import NoteEditor from "@/components/notes/NoteEditor.jsx";
import NoteHeader from "@/components/notes/NoteHeader.jsx";
import NotesList from "@/components/notes/NotesList.jsx";

import "@/components/notes/note.css";

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
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome to Eduhaven Notes!",
      content: `<h1>Welcome to Eduhaven Notes!</h1><p>This is a modern notes feature with rich text editing capabilities, similar to Notion.</p><p>You can:</p><ul><li>Create <strong>bold</strong> and <em>italic</em> text</li><li>Add headers, lists, and more</li><li>Use the toolbar above for formatting</li><li>Create task lists</li></ul><p>Try selecting text and using the formatting toolbar above!</p>`,
      createdAt: new Date().toISOString(),
      isPinned: false,
      color: "default",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);

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
      if (selectedNote) {
        const content = editor.getHTML();
        updateNote(selectedNote.id, { content });
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
    shouldRerenderOnTransaction: true,
  });

  useEffect(() => {
    if (editor && selectedNote) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedNote.content) {
        editor.commands.setContent(selectedNote.content);
      }
    }
  }, [selectedNote, editor]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      isPinned: false,
      color: "default",
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const updateNote = (id, updates) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  const togglePin = (id) => {
    const note = notes.find((n) => n.id === id);
    updateNote(id, { isPinned: !note.isPinned });
  };

  const changeColor = (id, color) => {
    updateNote(id, { color });
    setShowColorPicker(null);
  };

  const duplicateNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      title: note.title + " (Copy)",
      createdAt: new Date().toISOString(),
      isPinned: false,
    };
    setNotes([newNote, ...notes]);
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
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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

  const filteredNotes = notes.filter((note) => {
    const plainContent = getPlainTextPreview(note.content);
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plainContent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--txt)" }}
    >
      {/* Header */}
      <NoteHeader
        createNewNote={createNewNote}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex" style={{ height: "calc(100vh - 73px)" }}>
        {/* Notes List */}
        <NotesList
          selectedNote={selectedNote}
          pinnedNotes={pinnedNotes}
          unpinnedNotes={unpinnedNotes}
          filteredNotes={filteredNotes}
          searchTerm={searchTerm}
          setSelectedNote={setSelectedNote}
          togglePin={togglePin}
          deleteNote={deleteNote}
          duplicateNote={duplicateNote}
          exportNote={exportNote}
          changeColor={changeColor}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          colors={colors}
          getPlainTextPreview={getPlainTextPreview}
        />

        {/* Note Editor */}
        {selectedNote && (
          <NoteEditor
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            colors={colors}
            editor={editor}
            updateNote={updateNote}
            insertLink={insertLink}
            insertImage={insertImage}
            insertTable={insertTable}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
