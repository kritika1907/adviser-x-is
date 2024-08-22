import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v1 as uuidv1 } from 'uuid';

function VideoCall() {


 const [meetingId , setMeetingId] = useState('')
 const navigate = useNavigate()
 const auth = getAuth();


 const handleClick = ()=>{
    console.log("Meeting id", meetingId)
      navigate(`/room/${meetingId}`)
 }

 useEffect(()=>{
    const meetingID = uuidv1();
    setMeetingId(meetingID)
 },[])

  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='py-[30px] px-[10px] md:px-[30px] roundex-xl shadow-xl bg-gray-200'>
            
            <div>
                <p className='text-xl sm:text-2xl md:text-3xl  font-Poppins font-bold text-center my-[30px] '>Enter Meeting Id to join room</p>
            </div>

            <div className='flex flex-col justify-center items-center'>
                {/* <label className='w-[300px] sm:-[w-380px]'><p className='text-left'>Meeting ID</p></label> */}
                {/* <input 
                type="text"
                placeholder='Enter meeting Id'
                value={meetingId}
                // onChange={(e)=>setMeetingId(e.target.value)}
                className='h-12 p-2 w-[300px] sm:w-[380px] border border-black rounded-xl text-lg text-center'
                readOnly
                /> */}
                <p className='text-lg'>Meeting ID - {meetingId}</p>

                <button className='bg-blue-500 text-white h-12 mt-4 w-[300px] sm:w-[380px] rounded-xl' onClick={handleClick}>
                    Join Metting
                </button>
            </div>
        </div>
    </div>
  )
}

export default VideoCall