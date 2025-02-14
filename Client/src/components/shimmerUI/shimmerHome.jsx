import React from "react";

const ShimmerStudyRoom = () => {
  return (
    <div className="space-y-4">
      {/* Navbar Skeleton */}
      <div className="flex justify-between items-center">
        {/* Left (Links Button) */}
        <div className="w-24 h-8 skeleton rounded-lg"></div>
        {/* Center (Heading) */}
        <div className="w-64 h-8 skeleton rounded-lg"></div>
        {/* Right (Login Button) */}
        <div className="w-24 h-8 skeleton rounded-lg"></div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 w-full flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Timer & StudyStats Container */}
          <div className="bg-gray-800 skeleton rounded-3xl h-[140px]"></div>
          {/* Notes & Goals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 notes-goals-grid">
            <div className="h-[256px] skeleton rounded-3xl"></div>
            <div className="h-[256px] skeleton rounded-3xl"></div>
          </div>
        </div>
        {/* Calendar Section */}
        <div className="h-[384px] w-full lg:w-[256px] skeleton rounded-3xl"></div>
      </div>

      {/* Discussion Rooms */}
      <h1 className="text-2xl font-bold text-gray-400"></h1>
      <div className="grid grid-cols-3 gap-6">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 skeleton p-6 rounded-3xl h-[160px]"
            ></div>
          ))}
      </div>
    </div>
  );
};

export default ShimmerStudyRoom;
