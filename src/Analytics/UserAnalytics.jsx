import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function UserAnalytics() {

  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate();

  const [dayUsers, setDayUsers] = useState([])
  const [weekUsers, setWeekUsers] = useState([])
  const [monthUsers, setMonthUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])

  async function getAllUserslast24Hours() {
    const nodeRef = ref(database, 'users');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago

        const users = [];
        snapshot.forEach(childSnapshot => {
          const userData = childSnapshot.val();
          const createdAt = new Date(userData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            users.push({ data: userData, id: childSnapshot.key });
          }
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

  async function getAllUserslastweek() {
    const nodeRef = ref(database, 'users');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))

        const users = [];
        snapshot.forEach(childSnapshot => {
          const userData = childSnapshot.val();
          const createdAt = new Date(userData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            users.push({ data: userData, id: childSnapshot.key });
          }
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

  async function getAllUserslastmonth() {
    const nodeRef = ref(database, 'users');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

        const users = [];
        snapshot.forEach(childSnapshot => {
          const userData = childSnapshot.val();
          const createdAt = new Date(userData.created_at);
          if (createdAt >= last24Hours && createdAt <= now) {
            users.push({ data: userData, id: childSnapshot.key });
          }
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

  async function getAllUsers() {
    const nodeRef = ref(database, 'users');
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
    getAllUsers().then((response) => {
      setAllUsers(response)
    })

    getAllUserslast24Hours().then((response) => {
      setDayUsers(response)
    })

    getAllUserslastweek().then((response) => {
      setWeekUsers(response)
    })

    getAllUserslastmonth().then((response) => {
      setMonthUsers(response)
    })
  }, [])


  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8  w-full justify-between'>
      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Users in last 24 hrs</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('usersdata/', {
            state: {
              usersdata: dayUsers
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{dayUsers.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Users in last week</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('usersdata/', {
            state: {
              usersdata: weekUsers
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{weekUsers.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Users in last month</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer'
          onClick={() => {
            navigate('usersdata/', {
              state: {
                usersdata: monthUsers
              }
            })
          }}
        >
          <p className='text-xl md:text-3xl font-semibold'>{monthUsers.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Overall Users</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('usersdata/', {
            state: {
              usersdata: allUsers
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{allUsers.length}</p>
        </div>
      </div>
    </div>
  )
}

export default UserAnalytics