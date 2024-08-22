import React from "react";

const AdviserDashboardSkeleton = () => {
  return (
    <div className="max-w-screen h-screen mx-auto p-4">
      {/* Header Skeleton */}
      {/* <div className="bg-blue-400 h-12 w-full rounded-md animate-pulse mb-4"></div> */}

      <div className='overflow-hidden'>
        <div className='pt-0 py-6 px-2 sm:p-6 space-y-6'>
        <div className="bg-gray-300 h-8 w-32 md:w-48  md:h-12  rounded-md mb-2 animate-pulse"></div>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-between sm:p-6 space-y-6 max-w-full">

          <div className="flex flex-col justify-center  sm:justify-between  md:items-start w-full md:w-3/6  ">
            <div className="flex items-center space-x-4 w-full my-4 ml-4 ">

              <div
                className="rounded-full w-24 h-24 sm:w-32 sm:h-32 lg:h-48 lg:w-48 object-cover bg-gray-300 animate-pulse"
              ></div>
              <div>
              <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>
              <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>
              </div>
            </div>

            <div className="mt-[30px]">
            <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse ml-2 md:ml-4"></div>
              <div className='bg-gray-300 text-white rounded-xl p-6 w-[320px] sm:w-[350px] md:w-[400px] m-4 '>
              <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>
              <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>
              </div>
            </div>
          </div>







          <div className="  py-6   px-4  md:w-3/6 my-4 flex flex-col md:items-center">
            <div >
            <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>
              <div className="mt-4 space-y-4">
                
        
                  <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center text-sm md:text-lg lg:text-xl">
                    <div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    </div>

                    <div className="bg-gray-300 rounded-md py-2 px-4 font-Poppins h-8 w-16 md:w-24 ml-2 animate-pulse" ></div>
                  </div>
                
                
                  <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center text-sm md:text-lg lg:text-xl">
                    <div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    <div className="bg-gray-300 h-4 w-32 sm:w-64 rounded-md mb-2 animate-pulse"></div>
                    </div>

                    <div className="bg-gray-300 rounded-md py-2 px-4 font-Poppins h-8 w-16 md:w-24 ml-2 animate-pulse" ></div>
                  </div>
                
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* Last Appointments Table Skeleton */}
      <div className="mt-8">
        <div className="w-48 h-6 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 m-2 h-4 bg-gray-200 animate-pulse"></th>
                <th className="px-4 py-2 m-2 h-4 bg-gray-200 animate-pulse"></th>
                <th className="px-4 py-2 m-2 h-4 bg-gray-200 animate-pulse"></th>
                <th className="px-4 py-2 m-2 h-4 bg-gray-200 animate-pulse"></th>
                <th className="px-4 py-2 m-2 h-4 bg-gray-200 animate-pulse"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 m-2 h-4 bg-gray-100 animate-pulse"></td>
                <td className="px-4 py-2 m-2 h-4 bg-gray-100 animate-pulse"></td>
                <td className="px-4 py-2 m-2 h-4 bg-gray-100 animate-pulse"></td>
                <td className="px-4 py-2 m-2 h-4 bg-gray-100 animate-pulse"></td>
                <td className="px-4 py-2 m-2 h-4 bg-gray-100 animate-pulse"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default AdviserDashboardSkeleton;
