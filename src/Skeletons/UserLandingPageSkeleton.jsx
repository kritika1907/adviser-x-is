import React from "react";

const UserLandingPageSkeleton = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white">
      <div className="animate-pulse flex flex-col items-center w-full h-full sm:w-[500px] sm:h-[600px] md:w-[600px] md:h-[700px] lg:w-[700px] lg:h-[800px] bg-gray-300">
        {/* Video/Image Area */}
        <div className="bg-gray-300 h-3/4 w-full"></div>
        
        {/* Bottom UI */}
        <div className="flex items-center w-full px-4 py-2 space-x-4 ">
          {/* Profile Picture */}
          <div className="bg-gray-200 rounded-full h-12 w-12"></div>

          {/* Text placeholders */}
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
          </div>

          {/* Icons/Actions */}
          <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserLandingPageSkeleton;
