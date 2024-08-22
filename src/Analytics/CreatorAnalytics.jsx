import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CreatorAnalytics() {

  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate();

  const [dayCreators, setDayCreators] = useState([])
  const [weekCreators, setWeekCreators] = useState([])
  const [monthCreators, setMonthCreators] = useState([])
  const [allCreators, setAllCreators] = useState([])

  async function getAllCreatorslast24Hours() {
    const nodeRef = ref(database, 'advisers');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago

        const advisers = [];
        snapshot.forEach(childSnapshot => {
          const adviserData = childSnapshot.val();
          const createdAt = new Date(adviserData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            advisers.push({ data: adviserData, id: childSnapshot.key });
          }
        });
        return advisers;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  async function getAllCreatorslastWeek() {
    const nodeRef = ref(database, 'advisers');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        const advisers = [];
        snapshot.forEach(childSnapshot => {
          const adviserData = childSnapshot.val();
          const createdAt = new Date(adviserData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            advisers.push({ data: adviserData, id: childSnapshot.key });
          }
        });
        return advisers;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }


  async function getAllCreatorslastMonth() {
    const nodeRef = ref(database, 'advisers');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        const advisers = [];
        snapshot.forEach(childSnapshot => {
          const adviserData = childSnapshot.val();
          const createdAt = new Date(adviserData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            advisers.push({ data: adviserData, id: childSnapshot.key });
          }
        });
        return advisers;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  async function getAllCreators() {
    const nodeRef = ref(database, 'advisers');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const users = [];
        snapshot.forEach(childSnapshot => {
          users.push({ data: childSnapshot.val(), id: childSnapshot.key });
        });
        return users;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  useEffect(() => {
    getAllCreators().then((response) => {
      setAllCreators(response)
    })

    getAllCreatorslast24Hours().then((response) => {
      setDayCreators(response)
    })

    getAllCreatorslastWeek().then((response) => {
      setWeekCreators(response)
    })

    getAllCreatorslastMonth().then((response) => {
      setMonthCreators(response)
    })
  }, [])


  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8  w-full justify-between'>
      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Creators in last 24 hrs</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('creatorsdata/', {
            state: {
              creatorsdata: dayCreators
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{dayCreators.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Creators in last week</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('creatorsdata/', {
            state: {
              creatorsdata: weekCreators
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{weekCreators.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Creators in last month</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer'
          onClick={() => {
            navigate('creatorsdata/', {
              state: {
                creatorsdata: monthCreators
              }
            })
          }}>
          <p className='text-xl md:text-3xl font-semibold'>{monthCreators.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Overall Creators</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('creatorsdata/', {
            state: {
              creatorsdata: allCreators
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{allCreators.length}</p>
        </div>
      </div>
    </div>
  )
}

export default CreatorAnalytics