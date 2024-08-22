import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { NavLink } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function AdviserFooter() {
  const auth = getAuth();
  return (
    <div className='fixed bottom-0 left-0 w-full bg-white'>
    <div className='container mx-auto font-Poppins'>
    <div className='w-full flex justify-between p-4 px-[20px]  lg:px-[40px] '>
        <NavLink to="/adviser/dashboard" exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''} >
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <HomeOutlinedIcon fontSize='inherit'/>
          </div>
          <p className=' text-xs sm:text-md md:text-lg '>Dashboard</p>
        </div>
        </NavLink>

        <NavLink to="/adviser/createpost"  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
            <div className='text-2xl md:text-3xl lg:text-4xl'>
                <AddCircleOutlineIcon fontSize='inherit' />
            </div>
            <p className='text-xs sm:text-md md:text-lg '>Create</p>

        </div>
        </NavLink>

        <NavLink to='/adviser/services'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <BookOutlinedIcon fontSize='inherit'/>
          </div>
          <p className='text-xs sm:text-md md:text-lg '>Services</p>
        </div>
        </NavLink>

        <NavLink to='/adviser/profile'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <PermIdentityOutlinedIcon fontSize='inherit'/>
          </div>
          <p className='text-xs sm:text-md md:text-lg '>Profile</p>
        </div>
        </NavLink>
    </div>
    </div>
    </div>
  )
}

export default AdviserFooter