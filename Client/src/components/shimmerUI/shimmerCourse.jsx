import React from 'react';

const CourseRoomShimmer = () => {
  return (
    <div>
      {/* Navbar Skeleton */}
      <div className="flex justify-between items-center p-4 mb-6 bg-gray-800">
        <div className="h-8 w-40 bg-gray-700 shimmer-glow rounded-lg"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-32 bg-gray-700 shimmer-glow rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-700 shimmer-glow rounded-full"></div>
        </div>
      </div>

      {/* Filter and Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-700 shimmer-glow rounded-lg"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-24 bg-gray-700 shimmer-glow rounded-lg"></div>
          <div className="h-8 w-24 bg-gray-700 shimmer-glow rounded-lg"></div>
        </div>
      </div>

      {/* Course Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div key={id} className="bg-gray-800 p-4 rounded-xl shimmer-glow">
            <div className="h-48 bg-gray-700 shimmer-glow rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-700 shimmer-glow rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-600 shimmer-glow rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-600 shimmer-glow rounded-lg mb-2"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 w-20 bg-gray-700 shimmer-glow rounded-lg"></div>
              <div className="h-6 w-16 bg-gray-700 shimmer-glow rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRoomShimmer;


