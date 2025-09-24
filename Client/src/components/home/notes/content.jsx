import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

function NoteContent({
  notes,
  currentPage,
  onContentChange,
  contentTimeoutRef,
  err,
}) {
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
      if (onContentChange) {
        onContentChange(content);
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
        <EditorContent editor={editor} />
      </div>
      {err && (
        <span className="text-red-400 text-xs mt-1 absolute bottom-4 left-3">
          {err}
        </span>
      )}
    </>
  );
}

export default NoteContent;
