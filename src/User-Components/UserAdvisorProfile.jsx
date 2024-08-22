import React, { useEffect, useState } from 'react'
import insta from '../user-assets/insta.png'
import fb from '../user-assets/fb.png'
import twitter from '../user-assets/twitter.png'
import profile from '../assets/profile.png'
import backicon from '../user-assets/backicon.png';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress } from '@mui/material'
import User from '../assets/User.png'
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'

function UserAdviserProfile() {

  const location = useLocation()
  const database = getDatabase(app);
  const auth= getAuth();
  const { adviserid, advisername } = location.state || {}
  const navigate = useNavigate()

  const userid = JSON.parse(localStorage.getItem('userid'))

  const [adviser, setAdviser] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)



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


  async function getUser(userId) {
    const nodeRef = ref(database, `users/${userId}`);
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

  async function getServiceDetails(serviceIds) {
    const serviceDetails = [];

    for (const serviceId of serviceIds) {
      const serviceRef = ref(database, `advisers_service/${serviceId}`);
      try {
        const snapshot = await get(serviceRef);
        if (snapshot.exists()) {
          serviceDetails.push({ data: snapshot.val(), id: snapshot.key });
        } else {
          console.log(`No data available for service ID: ${serviceId}`);
        }
      } catch (error) {
        console.error(`Error fetching service details for service ID: ${serviceId}`, error);
      }
    }

    return serviceDetails;
  }

  const followHandler = async () => {
    if (userid == null) {
      await Swal.fire({
        title: "Error",
        text: "You must be logged in to follow the adviser!",
        icon: "error"
      });
      navigate('/createaccount');
      return;
    }



    const adviser = await getAdviser(adviserid);
    const user = await getUser(userid);

    const currentFollowers = adviser.followers || [];
    let updatedFollowers = [...currentFollowers];
    if (!currentFollowers.includes(userid)) {
      updatedFollowers = [...currentFollowers, userid];
    }

    const currentFollowings = user.followings || [];
    let updatedFollowings = [...currentFollowings];
    if (!currentFollowings.includes(adviserid)) {
      updatedFollowings = [...currentFollowings, adviserid];
    }

    // Optimistically update the state for follows
    const updatedAdviser = { ...adviser, followers: updatedFollowers }
    setAdviser(updatedAdviser);


    try {
      await update(ref(database, 'advisers/' + adviserid), { followers: updatedFollowers });
      await update(ref(database, 'users/' + userid), { followings: updatedFollowings });
    } catch (error) {
      // Revert the state if the update fails for follows
      const revertedFollowers = currentFollowers;
      const revertedAdviser = { ...adviser, followers: revertedFollowers }
      setAdviser(revertedAdviser);

      console.error('Error updating follows:', error);
    }
  };

  const unfollowHandler = async () => {
    if (userid == null) {
      await Swal.fire({
        title: "Error",
        text: "You must be logged in to unfollow the adviser!",
        icon: "error"
      });
      navigate('/createaccount');
      return;
    }
  

  
    const adviser = await getAdviser(adviserid);
    const user = await getUser(userid);
  
    const currentFollowers = adviser.followers || [];
    let updatedFollowers = currentFollowers.filter(followerId => followerId !== userid);
  
    const currentFollowings = user.followings || [];
    let updatedFollowings = currentFollowings.filter(followingId => followingId !== adviserid);
  
    // Optimistically update the state for unfollows
    const updatedAdviser = { ...adviser, followers: updatedFollowers };
    setAdviser(updatedAdviser);
  
    try {
      await update(ref(database, 'advisers/' + adviserid), { followers: updatedFollowers });
      await update(ref(database, 'users/' + userid), { followings: updatedFollowings });
    } catch (error) {
      // Revert the state if the update fails for unfollows
      const revertedFollowers = currentFollowers;
      const revertedAdviser = { ...adviser, followers: revertedFollowers };
      setAdviser(revertedAdviser);
  
      console.error('Error updating unfollows:', error);
    }
  };

  useEffect(() => {
    if (adviserid) {
      getAdviser(adviserid).then((adviserData) => {
        setAdviser(adviserData)
        getServiceDetails(adviserData.services).then((servicesData) => {
          setServices(servicesData)
        });
        setLoading(false); // Update loading state after fetching the user data
      });
    }
    else {
      setLoading(false)
    }


  }, [adviserid])


  const handleClick = (serviceid, servicename) => {
    navigate(`/category/${advisername}/checkout/${servicename}`, {
      state: {
        adviserid: adviserid,
        serviceid: serviceid,
        advisername: advisername
      }
    })
  }


  if (loading) {
    return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>; // Show a loading message or spinner while fetching data
  }


  return (
    <div className="container mx-auto font-inter pt-[80px] md:pt-[80px] mb-[50px]  bg-gray-100 md:bg-white">
      <div className='min-h-screen'>
        <div className="flex  flex-col md:flex-row  my-8 ">

          <div className='md:mr-[100px] md:ml-[40px] px-4'>
            <button className="bg-[#489CFF] text-white py-2 px-4 rounded-full cursor-pointer" onClick={() => navigate('/category')} >
              <img
                src={backicon}
                alt=""
                className='h-8 w-4 rounded-full '
              />
            </button>
          </div>

          <div className='flex   w-full p-4 '>
            <div className="w-2/6 sm:w-1/6 mr-[30px] md:mr-[50px] flex flex-col items-center justify-center">
              <img
                src={adviser && adviser.profile_photo ? adviser.profile_photo : User}
                alt=""
                className="h-32 w-32 rounded-full "
                style={{ objectFit: "cover" }}
              />

              {adviser && adviser.followers && adviser.followers.includes(userid) ?
                <button className=' bg-gradient-to-b from-[#0165E1] to-[#17A9FD] text-white py-2 px-4 rounded cursor-pointer my-2' onClick={unfollowHandler}>
                  Unfollow
                </button> :
                <button className=' bg-gradient-to-b from-[#0165E1] to-[#17A9FD] text-white py-2 px-4 rounded cursor-pointer my-2' onClick={followHandler}>
                  Follow
                </button>
              }

            </div>
            <div className='w-4/6 sm:w-5/6 pt-[10px] break-words'>
              <h1 className="text-md sm:text-xl md:text-2xl font-bold  mb-[5px]">{adviser && adviser.username ? adviser.username : ''}</h1>
              <p className="text-gray-500 text-xs sm:text-sm md:text-md ">{adviser && adviser.professional_bio ? adviser.professional_bio : ''
              }</p>
            </div>
          </div>
        </div>
        <div className=" md:ml-[150px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 px-[20px]">
          {services.map((service, index) => (
            ((service.data.isPublished || service.data.isPublished == undefined) && <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md  px-[20px] py-[30px]">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 break-words">{service.data.service_name}</h2>
              <p className="text-gray-500 mb-4 break-words text-xs sm:text-sm  md:md ">{service.data.about_service}</p>

              <div className='flex items-center '>
                <button className="w-4/6  bg-gradient-to-b from-[#0165E1] to-[#17A9FD] text-white py-2 px-4 rounded cursor-pointer " onClick={() => handleClick(service.id, service.data.service_name)}>Book</button>
                <p className="w-2/6 text-lg  sm:text-xl font-bold ml-2">Rs {service.data.price}/-</p>
              </div>

            </div>)

          ))}
        </div>
        {/* <div className="flex justify-center my-8">
      <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">
        &larr;
      </button>
    </div> */}
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

export default UserAdviserProfile