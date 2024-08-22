import React from "react";

const CreatePostSkeleton = () => {
  return (
    <div className="pt-[20px] mb-[80px] min-h-screen bg-white ">


      <main className="p-4">
      <div className="relative  h-8 my-2 w-32 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="flex justify-center items-center h-32 bg-gray-300 rounded-md animate-pulse my-2"></div>
          <div className="relative  h-8 my-2 mt-4 w-32 bg-gray-300 animate-pulse rounded-md"></div>

        <section>


          <div className=" grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8 ">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-md shadow-md p-4 md:p-6 h-[250px] md:h-[400px] animate-pulse "
              >

              </div>
            ))}
          </div>
        </section>
      </main>


    </div>
  );
};

export default CreatePostSkeleton;
