import React from "react";
import { Calendar, Eye, Folder } from "lucide-react";

function Footer({ isLoading, repoData }) {
  const TextSkeleton = ({ width = "full", height = "4" }) => (
    <div
      className={`bg-sec rounded h-${height} w-${width} animate-pulse`}
    ></div>
  );
  return (
    <div className="pt-6 flex-shrink-0 flex justify-around border-t border-[var(--bg-ter)]">
      {/* left */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 txt-dim">
          <Calendar size={18} /> project started:{" "}
          {isLoading ? (
            <TextSkeleton width="24" />
          ) : (
            new Date(repoData?.created_at).toLocaleDateString()
          )}
        </div>
        <div className="flex items-center gap-2 txt-dim">
          <Calendar size={18} /> Last updated:{" "}
          {isLoading ? (
            <TextSkeleton width="24" />
          ) : (
            new Date(repoData?.updated_at).toLocaleDateString()
          )}
        </div>
        <div className="flex gap-2 txt-dim">
          <Eye size={18} />
          Watchers:{" "}
          {isLoading ? <TextSkeleton width="16" /> : repoData?.watchers_count}
        </div>
        <div className="flex gap-2 txt-dim">
          <Folder size={18} />
          Size:{" "}
          {isLoading ? <TextSkeleton width="16" /> : `${repoData?.size} KB`}
        </div>
      </div>
      {/* right */}
      <div className="flex flex-col space-y-1.5">
        <a
          href="https://forms.gle/SKL45KczPnVBkY276"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-400"
        >
          Share your Feedback
        </a>

        <a href="/privacy" className="text-blue-400 hover:underline">
          Privacy Policy
        </a>
        <p className=" txt-dim">© 2025 EduHaven</p>
        <div className="flex gap-2 txt-dim">
          License:{" "}
          {isLoading ? (
            <TextSkeleton width="24" />
          ) : (
            repoData?.license?.name || "No license specified"
          )}
        </div>
      </div>
    </div>
  );
}

export default Footer;
