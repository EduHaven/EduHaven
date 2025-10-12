import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImgIcn,
  Italic,
  Link as LinkIcn,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table as TableIcn,
  Underline as UnderlineIcn,
  X,
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNoteStore } from '@/stores/useNoteStore';
import { useUpdateNote } from "@/queries/NoteQueries";

const NoteEditor = ({
  colors,
  editor,
  insertLink,
  insertImage,
  insertTable,
  onClose,
}) => {
  const {
    selectedNote,
    updateNote,
  } = useNoteStore();

  const updateNoteMutation = useUpdateNote();

  const handleUpdateNote = (id, updates) => {
    updateNote(id, updates);
    // Call the mutation
    updateNoteMutation.mutate({ id, ...updates });
  };

  return (
    <motion.div
      className="flex-1 flex flex-col rounded-tl-3xl"
      style={{
        backgroundColor: colors.find((c) => c.name === selectedNote.color)
          ?.style.backgroundColor,
        color: "var(--txt)",
      }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div
        className="p-4 pb-0 flex flex-col gap-3"
        style={{ borderColor: "var(--bg-sec)" }}
      >
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Untitled"
            value={selectedNote.title}
            onChange={(e) =>
              handleUpdateNote(selectedNote._id, { title: e.target.value })
            }
            className="flex-1 border-none outline-none text-2xl font-semibold bg-transparent font-inherit"
            style={{ color: "var(--txt)" }}
          />

          <Button
            onClick={onClose}
            className="p-2 border-none bg-transparent cursor-pointer"
            style={{
              color: "var(--txt-dim)",
              borderRadius: "var(--radius)",
            }}
          >
            <X size={20} />
          </Button>
        </div>

        <div
          className={`flex items-center gap-0.5 flex-wrap p-1.5 rounded-lg`}
          style={{
            backgroundColor: colors.find((c) => c.name === selectedNote.color)
              ?.style.backgroundColor,
          }}
        >
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor?.isActive("heading", { level: 1 })}
            icon={<Heading1 size={16} />}
            title="Heading 1"
          />

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor?.isActive("heading", { level: 2 })}
            icon={<Heading2 size={16} />}
            title="Heading 2"
          />

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor?.isActive("heading", { level: 3 })}
            icon={<Heading3 size={16} />}
            title="Heading 3"
          />

          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: "var(--txt-disabled)" }}
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            icon={<Bold size={16} />}
            title="Bold"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            icon={<Italic size={16} />}
            title="Italic"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            isActive={editor?.isActive("underline")}
            icon={<UnderlineIcn size={16} />}
            title="Underline"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            isActive={editor?.isActive("strike")}
            icon={<Strikethrough size={16} />}
            title="Strikethrough"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            isActive={editor?.isActive("code")}
            icon={<Code size={16} />}
            title="Code"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            isActive={editor?.isActive("highlight")}
            icon={<Highlighter size={16} />}
            title="Highlight"
          />

          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: "var(--txt-disabled)" }}
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            icon={<List size={16} />}
            title="Bullet List"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            title="Numbered List"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
            isActive={editor?.isActive("taskList")}
            icon={
              <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
                ✓
              </div>
            }
            title="Task List"
          />

          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: "var(--txt-disabled)" }}
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            isActive={editor?.isActive("blockquote")}
            icon={<Quote size={16} />}
            title="Quote"
          />

          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            isActive={false}
            icon={<Minus size={16} />}
            title="Horizontal Rule"
          />

          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: "var(--txt-disabled)" }}
          />

          <ToolbarButton
            onClick={insertLink}
            isActive={editor?.isActive("link")}
            icon={<LinkIcn size={16} />}
            title="Insert Link"
          />

          <ToolbarButton
            onClick={insertImage}
            isActive={false}
            icon={<ImgIcn size={16} />}
            title="Insert Image"
          />

          <ToolbarButton
            onClick={insertTable}
            isActive={editor?.isActive("table")}
            icon={<TableIcn size={16} />}
            title="Insert Table"
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </motion.div>
  );
};

export default NoteEditor;