import { CircularProgress, Rating } from '@mui/material'
import React, { useEffect, useState } from 'react'
import insta from '../user-assets/insta.png'
import fb from '../user-assets/fb.png'
import twitter from '../user-assets/twitter.png'
import checkicon from '../user-assets/checkicon.png'
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { useNavigate } from 'react-router-dom'
import User from '../assets/User.png'
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { getAuth } from 'firebase/auth'
import UserCategorySkeleton from '../Skeletons/UserCategorySkeleton'

const Categories = ["Career", "Business", "Health", "Technology", "Education", "Legal", "Marketing"]

function BookedServices() {
  const database = getDatabase(app);
  const navigate = useNavigate()

  const auth = getAuth();

  const [bookedServices, setBookedServices] = useState([])
  const [serviceWithAdviser, setServiceWithAdviser] = useState([])
  const [loading, setLoading] = useState(true)

  const userid = JSON.parse(localStorage.getItem('userid'))

  function convertDateFormat(dateString) {
    // Split the input date string by the hyphen
    const [year, month, day] = dateString.split('-');
  
    // Return the date in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  }

  async function getPayements() {
    const nodeRef = ref(database, 'payments');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const payments = [];
        snapshot.forEach(childSnapshot => {
            if(childSnapshot.val().userid === userid)
            {
                payments.push({ data: childSnapshot.val(), id: childSnapshot.key });
            }
          
        });
        return payments;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  const fetchServiceById = async (serviceId) => {
    const serviceRef = ref(database, `advisers_service/${serviceId}`);
    try {
      const snapshot = await get(serviceRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log(`No service available for service ID: ${serviceId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching service data for service ID: ${serviceId}`, error);
      return null;
    }
  };

  function daysUntil(upcomingDate) {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the upcoming date
    const [year, month, day] = upcomingDate.split('-').map(Number);
    const upcoming = new Date(year, month - 1, day);
    
    // Calculate the difference in time (milliseconds)
    const timeDifference = upcoming - today;
    
    // Convert time difference to days
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    // Return the difference, ensuring it is non-negative
    return Math.max(dayDifference, 0);
  }


  async function getAdviser(userId) {
    const nodeRef = ref(database, `advisers/${userId}`);
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return null;
    }
  }


  useEffect(() => {
    getPayements().then((response) => {
      setBookedServices(response)
      setLoading(false)
     // Update loading state after fetching the user data
    });

  }, []);

  useEffect(() => {
    
    if (bookedServices.length > 0) {
      async function fetchPaymentAndAdviser() {
        const updatedBookedServices = await Promise.all(
          bookedServices.map(async (service) => {
            let adviser = null;
            if (service.data.adviserid) {
              adviser = await getAdviser(service.data.adviserid);
            }
            return { ...service, adviser };
          })
        );
        setServiceWithAdviser(updatedBookedServices);
        setLoading(false);
      }
  
      fetchPaymentAndAdviser();
    }
  }, [bookedServices]);








  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>; // Show a loading message or spinner while fetching data
    return <div>
      <UserCategorySkeleton />
    </div>
  }



  return (
    <div className="min-h-screen flex flex-col font-inter pt-[80px] mb-[80px] ">

      <div className="flex-grow bg-gray-50 py-8">
        <section className="container mx-auto px-4">

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
            { serviceWithAdviser.length>0 ? serviceWithAdviser.map((item, idx) => (
                            <div className="bg-white rounded-lg shadow p-2 px-[20px]  cursor-pointer" key={idx}>
                            <div className='flex justify-between py-2'>
                                <p className='font-bold text-sm sm:text-md md:text-lg '>Adviser Booked</p>
                                <div className='flex'>
                                <p className='text-xs sm:text-sm  text-[#5A88FF] flex justify-center items-center mr-1'>{item.data && item.data.scheduled_date? convertDateFormat(item.data.scheduled_date):''}<span><CalendarMonthIcon fontSize='small' /></span></p>
                                <p className='text-xs sm:text-sm  text-[#5A88FF] flex justify-center items-center'>{item.data && item.data.scheduled_time ? item.data.scheduled_time : ''}<span><AccessAlarmsIcon fontSize='small'/></span></p>
                                </div>
                            </div>
                           <div className='flex'>
                            <div className='w-2/7 sm:w-1/5 flex flex-col pt-[15px]'>
                              <img
                                src={item && item.adviser ? item.adviser.profile_photo : User}
                                alt=""
                                className="rounded-full h-20 w-24 sm:h-28 sm:w-28 object-cover my-[10px]"
                              />
        
                              <div>
                                {/* <Rating name="read-only" value={5} readOnly /> */}
                              </div>
                              {/* <p className='text-center text-sm'>English, Hindi</p> */}
                              {/* <p className='text-center text-sm'>₹ 5/min</p> */}
                            </div>
                            <div className="w-full sm:w-4/6 ml-4 mt-[10px] ">
                              <div className='flex  justify-between'>
                                <div className='w-4/6 md:w-4/5'>
                                <h2 className="text-md sm:text-xl md:text-2xl font-bold ">{item && item.adviser ? item.adviser.username : ''}</h2>
                                <p className="text-[13px] sm:text-md">{item && item.adviser ? item.adviser.professional_title : ''}</p>
                                </div>
                                <div className='w-2/6 md:1/5'>
                                <p className="text-xs sm:text-sm  md:text-md font-bold">
                                Exp: <span className="block sm:inline">    {item && item.adviser ? item.adviser.years_of_experience : ''} years</span></p>
                                </div>
                              </div>
            
                              <div  className='mt-2'>
                                <p className='text-gray-500 text-sm sm:text-md' >{item && item.adviser ? item.adviser.professional_bio : ''}</p>
                              </div>
            
                                <div className=' my-4 w-4/5 md:w-3/5'>
                                <div className="flex items-center justify-center border border-[#5A88FF] text-[#5A88FF] px-4 py-1  rounded-full text-md sm:text-lg">
                                        {daysUntil(item.data.scheduled_date)} Days left !!
                                      </div>
                                </div>                  
                            </div>
                            </div>
            
            
                          </div>
            )) : <div className='w-full h-full'>
            <p className='font-Poppins text-2xl md:text-4xl text-gray-500'>No data available !!</p>
          
          </div>}





          </div>

        </section>
      </div>
      {/* <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center my-[20px]">
          <div className="flex justify-between space-x-4 mb-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Help</a>
          </div>
          <div className="flex justify-center space-x-4 md:space-x-8">
            <a href="#" >
              <img
                src={insta}
                alt=""
                className="h-8 w-8"
              />
            </a>
            <a href="#" >
              <img
                src={fb}
                alt=""
                className="h-8 w-8"
              />
            </a>
            <a href="#" >
              <img
                src={twitter}
                alt=""
                className="h-8 w-8"
              />
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default BookedServices