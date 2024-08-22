import React from "react";

const AdviserServiceSkeleton = () => {
  return (
    <div className="pt-[20px]  mb-[80px]">

<div className="flex flex-col  md:flex-row justify-between items-start md:items-center mx-4">
      <div className="bg-gray-300 h-12 w-48 rounded-md animate-pulse"></div>
        <div className='mt-4 sm:mt-0 flex space-x-4 '>
        <div className="bg-gray-300 h-12 w-32 md:w-48 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-12 w-32 md:w-48 rounded-md animate-pulse"></div>

        </div>
      </div>

    <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-2 sm:mt-4 md:pr-[50px]">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-pulse"
        >
          <div className="flex items-center space-x-4 nb-2 sm:mb-4">
            {/* Profile Picture */}
            {/* <div className="bg-gray-300 rounded-full h-16 w-16"></div> */}
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
          <div className="flex items-center justify-start">
            <div className="bg-gray-300 h-10 w-24 sm:w-32 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default AdviserServiceSkeleton;
