import React, { useEffect } from 'react'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from 'firebase/auth';
import UserAnalytics from './UserAnalytics';
import CreatorAnalytics from './CreatorAnalytics';
import PostAnalytics from './PostAnalytics';

function Home() {
  const database = getDatabase(app);
  const auth = getAuth();

  const adviserid = JSON.parse(localStorage.getItem('adviserid'));




  return (
    <div className='min-h-screen py-[20px] px-[40px] bg-white pt-[100px]'>

      <div className='mb-[40px]'>
        <p className='text-xl md:text-2xl lg:text-3xl  font-bold mb-4'>Users</p>
        <UserAnalytics />
      </div>

      <div className='my-[40px]'>
        <p className='text-xl md:text-2xl lg:text-3xl  font-bold mb-4'>Creators</p>
        <CreatorAnalytics />
      </div>

      <div className='my-[40px]'>
        <p className='text-xl md:text-2xl lg:text-3xl  font-bold mb-4'>Posts</p>
        <PostAnalytics />
      </div>



    </div>
  )
}

export default Home