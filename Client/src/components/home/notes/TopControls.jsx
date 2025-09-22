import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

function TopControls({ addNew, next, prev, notes, currentPage }) {
  return (
    <div className="flex gap-1 pr-4 items-center absolute right-0 top-6 z-50">
      <Button
        title="Create new note"
        onClick={addNew}
        variant="transparent"
        size="icon"
        className="p-1.5 rounded-full bg-ter hover:bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus />
      </Button>
      <div className="bg-[var(--bg-sec)] flex gap-2.5 items-center px-2.5 pl-3 rounded-full">
        <span className="opacity-90 text-lg">
          {notes.length > 0 ? `${currentPage + 1}/${notes.length}` : "1/1"}
        </span>
        <div>
          <Button
            onClick={prev}
            variant="transparent"
            size="icon"
            className={`p-1.5 rounded-full hover:bg-ter ${
              currentPage === 0 ? "txt-dim" : ""
            }`}
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={next}
            variant="transparent"
            size="icon"
            className={`p-1.5 rounded-full hover:bg-ter ${
              currentPage === notes.length - 1 ? "txt-dim" : ""
            }`}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TopControls;
