import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import axiosInstance from "@/utils/axios";

function NoteContent({
  err,
  notes,
  currentPage,
  setNotes,
  validateFields,
  setError,
  isSynced,
  setRotate,
  setIsSynced,
  contentTimeoutRef,
  handleSync,
  isLoading,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
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
      validateFields(currentTitle, content);
      if (err) setError("");

      console.log("The content is: ", currentTitle, content);

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

  useEffect(() => {
    if (editor && notes[currentPage]) {
      const currentContent = editor.getHTML();
      if (currentContent !== notes[currentPage].content) {
        editor.commands.setContent(notes[currentPage].content || "");
      }
    }
  }, [currentPage, notes, editor]);

  return (
    <>
      <div className="w-full h-[336px] txt-dim p-2 px-3 overflow-auto">
        {isLoading ? (
          <div className="space-y-2 mt-2">
            <div className="h-3 w-full rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-11/12 rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-5/6 rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-4/5 rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-3/4 rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-full rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
            <div className="h-3 w-5/6 rounded opacity-60 animate-pulse" style={{ backgroundColor: 'var(--bg-ter)' }}></div>
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      {err && !isLoading && (
        <span className="text-red-400 text-xs mt-1 absolute bottom-4 left-3">
          {err}
        </span>
      )}
    </>
  );
}

export default NoteContent;
