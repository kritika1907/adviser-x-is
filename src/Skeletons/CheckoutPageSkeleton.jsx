import React from "react";

const CheckoutPageSkeleton = () => {
  return (
    <div className="w-full mx-auto p-4 pt-[50px]">
    
    <div className="container mx-auto">

      {/* Profile Image Skeleton */}
      <div className=" flex justify-center mt-12 items-center md:px-[50px]">
        <div className=" rounded-full overflow-hidden border-4 border-white bg-gray-400 w-24 h-24  md:w-48 md:h-48 animate-pulse ml-[15px] md:ml-[20px]"></div>
         
         <div className="w-3/6 pl-4 md:pl-[20px]2">
         <div className="h-4 bg-gray-300 rounded w-4/6 mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
         </div>


      </div>

      <div className="flex justify-center flex-col sm:flex-row md:px-[50px] mt-4">

        <div className="sm:w-1/6 ml-[15px] md:ml-[20px]">
        <div className="h-2 sm:h-4 bg-gray-300 rounded w-4/6 mb-2"></div>
        <div className="h-2 sm:h-4 bg-gray-300 rounded w-4/6 mb-2"></div>
        <div className="h-2 sm:h-4 bg-gray-300 rounded w-4/6 mb-2"></div>
        <div className="h-2 sm:h-4 bg-gray-300 rounded w-4/6 mb-2"></div>
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

  

        <div className="bg-gray-300 h-10 w-48 rounded"></div>
      </div>


      </div>

      </div>
    </div>

  );
};

export default CheckoutPageSkeleton;
