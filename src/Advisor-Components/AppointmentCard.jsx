import React, { useState } from 'react';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';

const AppointmentCard = ({data}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  function convertDateFormat(dateString) {
    // Split the input date string by the hyphen
    const [year, month, day] = dateString.split('-');

    // Return the date in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="border rounded-lg shadow-lg p-4 pt-1 font-Poppins">
      <div className='flex justify-end'>
      <button onClick={toggleExpand} className="focus:outline-none">
          {isExpanded ? <div className='text-2xl md:text-3xl lg:text-4xl text-black '>
            <ArrowDropUpOutlinedIcon fontSize='inherit' />
          </div>
          :  <div  className='text-2xl md:text-3xl lg:text-4xl text-black '> 
             <ArrowDropDownOutlinedIcon fontSize='inherit' />
            </div>}
        </button>
      </div>


      <div className="flex flex-col justify-between items-center text-sm">
       
          <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Purchase Date </p>
          <p className='text-black w-1/2'>{convertDateFormat(data?.purchased_date)}</p>
          </div>

          <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Booking Date </p>
          <p className='text-black w-1/2'>{convertDateFormat(data?.scheduled_date)}</p>
          </div>
      </div>
      {isExpanded && (
        <div className="text-sm">
                    <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Name </p>
          <p className='text-black w-1/2'>{data?.user?.username}</p>
          </div>

          <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Service </p>
          <p className='text-black w-1/2'>{data?.service?.service_name}</p>
          </div>

          <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Time </p>
          <p className='text-black w-1/2'>{data?.scheduled_time}</p>
          </div>

          <div className='flex w-full '>
          <p className="text-gray-500 w-1/2">Price </p>
          <p className='text-black w-1/2'>{data?.service.price}</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
