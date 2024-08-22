import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import { NavLink, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function UserFooter() {
  const auth = getAuth();

  const location = useLocation()


  const transparentPaths = ['/', ];
  return (
    <div className={`fixed z-50 bottom-0 left-0 w-full ${transparentPaths.includes(location.pathname) ? 'bg-white bg-opacity-50 sm:bg-white' : 'bg-white'}`}>
    <div className='container mx-auto font-Poppins'>
    <div className='w-full flex justify-between p-4 px-[20px]  lg:px-[40px] '>
        <NavLink to="/" exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''} >
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <HomeOutlinedIcon fontSize='inherit'/>
          </div>
          <p className=' text-xs sm:text-md md:text-lg '>Home</p>
        </div>
        </NavLink>

        <NavLink to="/category"  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
            <div className='text-2xl md:text-3xl lg:text-4xl'>
                <PeopleOutlineOutlinedIcon fontSize='inherit' />
            </div>
            <p className='text-xs sm:text-md md:text-lg'>Adviser</p>

        </div>
        </NavLink>

        <NavLink to='/bookedservices'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <HeadsetMicOutlinedIcon fontSize='inherit'/>
          </div>
          <p className='text-xs sm:text-md md:text-lg '>History</p>
        </div>
        </NavLink>
    </div>
    </div>
    </div>
  )
}

export default UserFooter