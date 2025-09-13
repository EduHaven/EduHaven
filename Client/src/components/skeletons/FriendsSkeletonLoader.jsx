import React from "react";
import UserCardSkeleton from "./UserCardSkeleton";

const FriendsSkeletonLoader = ({ count = 9 }) => {
  // Using 9 to create a full 3x3 grid
  return (
    // --- UPDATED FOR 3-COLUMN LAYOUT ---
    // We now use CSS Grid instead of Flexbox.
    // - `grid-cols-1`: 1 column on mobile (default).
    // - `md:grid-cols-2`: 2 columns on medium screens.
    // - `lg:grid-cols-3`: 3 columns on large screens, which achieves your goal.
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <UserCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default FriendsSkeletonLoader;
