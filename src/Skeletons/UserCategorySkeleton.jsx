import React from "react";

const UserCategorySkeleton = () => {
  return (
    <div className=" bg-gray-100 pt-[80px] mb-[80px]">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-2 sm:mt-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-pulse"
        >
          <div className="flex items-center space-x-4 nb-2 sm:mb-4">
            {/* Profile Picture */}
            <div className="bg-gray-300 rounded-full h-16 w-16"></div>
            <div className="flex-1">
              {/* Name */}
              <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-2"></div>
              {/* Title */}
              <div className="bg-gray-300 h-3 w-1/2 rounded-md"></div>

              <div className="space-y-2 my-4">
            <div className="bg-gray-300 h-3 w-full sm:w-5/6 rounded-md"></div>
            <div className="bg-gray-300 h-3 w-full sm:w-5/6 rounded-md"></div>
            <div className="bg-gray-300 h-3 w-full sm:w-5/6 rounded-md"></div>
          </div>
            </div>
          </div>
          {/* Description */}

          {/* Price Button */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-300 h-10 w-24 sm:w-32 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default UserCategorySkeleton;
