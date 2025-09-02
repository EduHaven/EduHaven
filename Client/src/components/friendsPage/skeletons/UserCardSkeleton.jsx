// components/friendsPage/skeletons/UserCardSkeleton.jsx
import React from 'react';

const UserCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 animate-pulse w-80 h-48">
      {/* Profile picture skeleton - matches circular avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full mb-3"></div>
        
        {/* Name skeleton */}
        <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
        
        {/* Username/additional info skeleton (optional line) */}
        <div className="h-3 bg-gray-600 rounded w-20"></div>
      </div>
      
      {/* Action button skeleton - matches purple "Add Friend" button */}
      <div className="w-full h-10 bg-gray-600 rounded-lg"></div>
    </div>
  );
};

export default UserCardSkeleton;

// components/friendsPage/skeletons/SearchBarSkeleton.jsx
export const SearchBarSkeleton = () => {
  return (
    <div className="mb-4">
      <div className="w-full h-12 bg-gray-600 dark:bg-gray-600 rounded-full animate-pulse"></div>
    </div>
  );
};

// components/friendsPage/skeletons/FriendsListSkeleton.jsx
export const FriendsListSkeleton = ({ showSearch = true, cardCount = 6 }) => {
  return (
    <div>
      {showSearch && <SearchBarSkeleton />}
      <div className="flex flex-wrap gap-6 mt-4">
        {Array.from({ length: cardCount }, (_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};