import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full mx-auto p-4">
      {/* Profile Header Skeleton */}
      <div className="relative w-full h-28 md:h-40 bg-gray-300 animate-pulse flex justify-end items-center">
      </div>

      {/* Profile Image Skeleton */}
      <div className="flex justify-start -mt-12">
        <div className="rounded-full overflow-hidden border-4 border-white bg-gray-400 w-24 h-24  md:w-48 md:h-48 animate-pulse ml-[15px] md:ml-[20px]"></div>
      </div>

      <div className="mb-4 flex justify-end">
          <div className="h-8 bg-gray-300 rounded w-28 md:w-32 mb-2"></div>
        </div>

      {/* Form Section Skeleton */}
      <div className="md:w-3/6 bg-gray-100 shadow-md rounded-md p-8 mt-4 animate-pulse">
        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-24 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-32 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-36 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-40 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-28 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-400 rounded w-24 mb-2"></div>
          <div className="w-full h-8 bg-gray-300 rounded"></div>
        </div>

        <div className="bg-gray-300 h-10 w-48 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
