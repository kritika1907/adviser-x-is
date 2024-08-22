import React from "react";

const AdviserProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-white  py-[80px] font-inter ">
    <div className="relative w-full h-28 sm:h-48 md:h-64 bg-gray-300 animate-pulse">
            
    </div>


    <div className="md:mx-[200px] relative flex flex-col  -mt-12 md:-mt-24 px-4 md:px-16">
      <div className="flex flex-col md:flex-row justify-between ">

        <div className='flex '>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-48 md:h-48 bg-gray-300 rounded-full border-4 border-white object-cover animate-pulse" ></div>
          </div>

          <div className="ml-4 md:ml-8 mt-[45px] md:mt-[100px] md:w-[600px] break-words">

            <div className='flex items-center mt-2 md:mt-4'>
              <div className="bg-gray-300 h-4 w-32 sm:w-3/4 rounded-md mb-2 animate-pulse"></div>

              <div className="hidden md:flex space-x-4 mx-4">
                
                  <div className="bg-gray-300 h-16 w-48 rounded-md animate-pulse"></div>

                  <div className="bg-gray-300 h-16 w-16 rounded-md animate-pulse"></div>
              </div>
            </div>


            <div className="flex space-x-2 md:space-x-4 mt-1 md:mt-4">
            <div className="bg-gray-300 h-4 w-1/4 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-1/4 rounded-md mb-2 animate-pulse"></div>
            </div>

            <div className='hidden md:block'>
            <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-2 animate-pulse"></div>
            </div>



          </div>
        </div>


        <div className="hidden md:block mt-[110px] space-y-4 mr-[40px] ">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-300 m-2 animate-pulse"></div>
            <div>
            <div className="bg-gray-300 h-4 w-32 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-32 rounded-md mb-2 animate-pulse"></div>

            </div>

          </div>
          <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-300 m-2 animate-pulse"></div>
            <div>
            <div className="bg-gray-300 h-4 w-32 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-32 rounded-md mb-2 animate-pulse"></div>

            </div>

          </div>

        </div>

        <div className="md:hidden mt-4  flex  justify-between mx-2 px-4 py-2 bg-gray-100 rounded-full">
        <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gray-300 m-2 animate-pulse"></div>
            <div>
            <div className="bg-gray-300 h-4 w-16 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-16 rounded-md mb-2 animate-pulse"></div>

            </div>

          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gray-300 m-2 animate-pulse"></div>
            <div>
            <div className="bg-gray-300 h-4 w-16 rounded-md mb-2 animate-pulse"></div>
            <div className="bg-gray-300 h-4 w-16 rounded-md mb-2 animate-pulse"></div>

            </div>

          </div>

        </div>

        <div className='md:hidden block mx-2 my-2'>
        <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-2 animate-pulse"></div>
        <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-2 animate-pulse"></div>
        </div>

        <div className='md:hidden flex mt-4 space-x-2'>
                
        <div className="bg-gray-300 h-12 w-48 rounded-md animate-pulse"></div>

<div className="bg-gray-300 h-12 w-16 rounded-md animate-pulse"></div>
        </div>


      </div>

    </div>



    <div className="mt-16  px-2 md:px-[100px]">
      <div className="flex justify-center space-x-4 border-b border-gray-300 animate-pulse">
        {[...Array(2)].map((_, idx) => (
          <button
            key={idx}
          >
            <div className="rounded-md bg-gray-300 w-28 sm:w-32 h-8 my-2 animate-pulse"></div>
          </button>
        ))}
      </div>
      <div className="my-8 mx-2 md:mx-4 bg-white w-screen h-full animate-pulse"></div>
    </div>
  </div>
  );
};

export default AdviserProfileSkeleton;
