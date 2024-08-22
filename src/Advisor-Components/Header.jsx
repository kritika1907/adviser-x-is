import { Menu, Popover, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  CreditCardIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import StateContext from "../Context/StateContext";
import { getAuth } from "firebase/auth";

function Header({ setShowSideBar, showSideBar, handleOpen }) {
  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate()

  const { updateHeader, setUpdateHeader  } = useContext(StateContext)

  const [adviser, setAdviser] = useState(null)


  const adviserid = JSON.parse(localStorage.getItem('adviserid'))

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

  const handleVerifyEmail = () =>{
    navigate('/adviser/emailconfirmation',{
      state:{
        adviserid:adviserid,
        fromDashboard:true
      }
    })
  }


  const handleCompleteProfile1 = () =>{
    navigate('/adviser/profile')
  }

  const handleCompleteProfile2 = () =>{
    handleOpen()
  }

  const handleCompleteProfile3 = () =>{
    navigate('/adviser/createservice')
  }

  useEffect(()=>{
       getAdviser(adviserid).then((result)=>{
        setAdviser(result)
       })
  },[updateHeader])

  return (
    <div
      className={`fixed z-50  w-full h-16 flex justify-between lg:justify-center items-center transition-all duration-[400ms] ${
        showSideBar ? "pl-[300px] bg-[#489CFF]" : "bg-[#489CFF]"
      }`}
    >
      {/* <div className="lg:hidden pl-4 md:pl-16">
        <Bars3CenterLeftIcon
          className="h-8 w-8  cursor-pointer text-white"
          onClick={() => setShowSideBar(!showSideBar)}
        />
      </div> */}
      {
        adviser && adviser.isVerified !=true  &&              <div className="flex flex-col md:flex-row justify-center items-center  text-white font-Poppins text-md md:text-xl">
        <div className="hidden lg:block">
        <p>Please verify your email<span className="text-black mx-2">{adviser && adviser.email ? adviser.email: ''}</span></p>
        </div>
        <div>
        <button className="bg-[#63CF9D] px-4 py-2 m-2 mx-4  text-white  rounded-md cursor-pointer" type="button" onClick={handleVerifyEmail} >
          verify email
        </button>
        </div>
      </div> 
      }

{
        adviser && adviser.isVerified  && adviser.profile_photo == undefined  &&              <div className="flex flex-col md:flex-row justify-center items-center  text-white font-Poppins text-md md:text-xl">
        <div className="hidden lg:block">
        <p>Your Profile is complete <span className="text-[#FF4400] mx-2">30%</span></p>
        </div>
        <div>
        <button className="bg-[#63CF9D] px-4 py-2 m-2 mx-4  text-white  rounded-md cursor-pointer" type="button" onClick={handleCompleteProfile1} >
        Complete profile
        </button>
        </div>
      </div> 
      }

{
        adviser && adviser.profile_photo && adviser.availability == undefined  &&              <div className="flex flex-col md:flex-row justify-center items-center  text-white font-Poppins text-md md:text-xl">
        <div className="hidden lg:block">
        <p>Your Profile is complete <span className="text-[#FF4400] mx-2">60%</span></p>
        </div>
        <div>
        <button className="bg-[#63CF9D] px-4 py-2 m-2 mx-4  text-white  rounded-md cursor-pointer" type="button" onClick={handleCompleteProfile2} >
        Complete profile
        </button>
        </div>
      </div> 
      }

      {
        adviser && adviser.profile_photo && adviser.availability && adviser.services == undefined  &&              <div className="flex flex-col md:flex-row justify-center items-center  text-white font-Poppins text-md md:text-xl">
        <div className="hidden lg:block">
        <p>Your Profile is complete <span className="text-[#FF4400] mx-2">80%</span></p>
        </div>
        <div>
        <button className="bg-[#63CF9D] px-4 py-2 m-2 mx-4  text-white  rounded-md cursor-pointer" type="button" onClick={handleCompleteProfile3} >
        Complete profile
        </button>
        </div>
      </div> 
      }
 


    </div>
  );
}

export default Header;
