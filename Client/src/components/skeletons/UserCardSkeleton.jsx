import React from "react";

const UserCardSkeleton = () => {
  return (
    // --- UPDATED FOR GRID LAYOUT ---
    // Removed width constraints like `sm:max-w-[220px]` and `flex-grow`.
    // `w-full` ensures the card perfectly fills the grid column defined by the parent.
    <div
      className="w-full p-4 rounded-[var(--radius)]
                 bg-[var(--bg-sec)]"
    >
      <div className="animate-pulse flex flex-col items-center text-center">
        {/* Avatar Placeholder */}
        <div
          className="w-16 h-16 rounded-full mb-3 bg-[var(--bg-primary)]"
        ></div>

        {/* Name Placeholder */}
        <div
          className="h-4 w-3/4 rounded mb-2 bg-[var(--bg-primary)]"
        ></div>

        {/* Secondary Text Placeholder */}
        <div
          className="h-3 w-1/2 rounded mb-4 bg-[var(--bg-primary)]"
        ></div>

        {/* Button Placeholder */}
        <div
          className="h-9 w-full rounded-md mt-2 bg-[var(--bg-primary)]"
        ></div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;