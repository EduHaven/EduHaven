const SessionShimmer = () => {
    return (
      <div >
        {/* Navbar Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-40 bg-gray-700 shimmer-glow rounded-lg"></div>
          <div className="h-10 w-60 bg-gray-700 shimmer-glow rounded-lg"></div>
        </div>
  
        {/* Study Rooms Skeleton (Fixed Size to Prevent Growth) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-gray-700 p-6 rounded-xl shadow-lg shimmer-glow flex flex-col justify-between shimmer-box"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-32 bg-gray-600 shimmer-glow rounded-md"></div>
                <div className="h-7 w-7 bg-gray-600 shimmer-glow rounded-full"></div>
              </div>
              <div className="h-4 w-24 bg-gray-600 shimmer-glow rounded-md mb-4"></div>
              <div className="h-10 w-full bg-gray-600 shimmer-glow rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default SessionShimmer;
  
  
  
