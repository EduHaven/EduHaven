import React from "react";
import UserCardSkeleton from "./UserCardSkeleton";

const FriendsSkeletonLoader = ({ count = 9 }) => {
  // Using 9 to create a full 3x3 grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <UserCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default FriendsSkeletonLoader;
