import {
  Trash,
  Palette,
  UserPlus,
  Maximize,
  Check,
  Download,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function BottomControls({ isSynced, rotate, notes, currentPage, onDelete }) {
  return (
    <div className="flex justify-between items-center w-full px-3 p-2 absolute bottom-0 left-0 group-hover:bg-gradient-to-t from-[var(--bg-sec)] via-[var(--bg-sec)] to-transparent">
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          title="Change color"
          onClick={() => console.log("clicked color")}
          variant="transparent"
          size="icon"
          className=" hover:bg-[var(--bg-ter)] rounded-full"
        >
          <Palette className="size-5" />
        </Button>
        <Button
          title="Download note"
          onClick={() => console.log("clicked download")}
          variant="transparent"
          size="icon"
          className=" hover:bg-[var(--bg-ter)] rounded-full"
        >
          <Download className="size-5" />
        </Button>
        <Button
          title="Add people"
          onClick={() => console.log("clicked user")}
          variant="transparent"
          size="icon"
          className=" hover:bg-[var(--bg-ter)] rounded-full"
        >
          <UserPlus className="size-5" />
        </Button>
        <Button
          title="Open in full screen"
          onClick={() => console.log("clicked maximize")}
          variant="transparent"
          size="icon"
          className=" hover:bg-[var(--bg-ter)] rounded-full"
        >
          <Maximize className="size-5" />
        </Button>
        {notes[currentPage]?.content !== "" &&
          notes[currentPage]?.title !== "" && (
            <>
              <Button
                title="Move to archive"
                onClick={() => onDelete(notes[currentPage]?._id)}
                variant="transparent"
                size="icon"
                className=" hover:bg-[var(--btn)] rounded-full"
              >
                <Archive className="size-5" />
              </Button>
              <Button
                title="Move to trash"
                onClick={() => onDelete(notes[currentPage]?._id)}
                variant="transparent"
                size="icon"
                className=" hover:bg-red-500 rounded-full"
              >
                <Trash className="size-5" />
              </Button>
            </>
          )}
        {!isSynced && (
          <Button variant="transparent" size="default" className="p-0">
            {rotate ? (
              <Check className="text-green-400 size-5" />
            ) : (
              <div className="size-2 rounded-full bg-yellow-300 border"></div>
            )}
          </Button>
        )}
      </div>

      <div className="bg-[var(--bg-sec)] txt-disabled p-1 px-2 rounded-full">
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

export default BottomControls;
