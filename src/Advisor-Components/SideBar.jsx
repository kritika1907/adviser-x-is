import React, { Fragment, forwardRef, useState } from "react";
import { HomeIcon, CreditCardIcon, UserIcon, ChevronDownIcon, PencilIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import { Menu, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import AvailabilitySchedule from "./AvailabilitySchedule";
import { useMediaQuery } from '@mui/material';

const SideBar = forwardRef(({ showSideBar,handleOpen, setShowSideBar }, ref) => {
  const navigate = useNavigate()
  // const [dialogOpen, setDialogOpen] = useState(false);

  const matches = useMediaQuery('(max-width:1024px)'); 

  const handleLinkClick = () => {
    if (matches) {
      setShowSideBar(false); // Set sidebar to false only on mobile devices
    }
  };

  const handleLogOut = async () => {
    handleLinkClick()
    Swal.fire({
      title: "Do you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("adviserid", JSON.stringify(null));
        navigate('/adviser');
      }
    });

  };

  const handleClickOnCalender = () =>{
      handleLinkClick();
      handleOpen();
  }





  return (
    <div ref={ref} className="fixed w-[300px] h-full bg-white">
            <div className="flex  ">
            <div className='flex items-center justify-center pl-[50px] mt-[70px]  lg:mb-[20px] '>
              <Link to='/adviser' className="cursor-pointer">
              <img className="object-cover h-24" src={logo} alt="" />
              </Link>
          
        </div>
      </div>
      <div className=" bg-[#489CFF] h-full rounded-tr-[100px]">


      <div className="flex flex-col pt-[40px] pl-[30px]">

        <NavLink
          to="/adviser/dashboard"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins "
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl " style={{fontSize:"20px"}}>Dashboard</p>
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/adviser/services"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Services</p>
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/adviser/profile"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Profile</p>
            </div>
          </div>
        </NavLink>

        <div
           onClick={handleClickOnCalender}
           className="text-gray-300 hover:text-white font-Poppins"
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Calender</p>
            </div>
            {/* <AvailabilitySchedule open={dialogOpen} handleClose={handleDialogClose} /> */}
          </div>
        </div>

        <NavLink
          to="/adviser/createpost"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Create Post</p>
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/adviser/createdpost"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Created Posts</p>
            </div>
          </div>
        </NavLink>



        <div
           onClick={handleLogOut}
           className="text-gray-300 hover:text-white font-Poppins"
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}>Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>



    </div>
  );
});

export default SideBar;
