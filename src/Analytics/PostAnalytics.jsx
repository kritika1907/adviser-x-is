import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function PostAnalytics() {

  const database = getDatabase(app);
  const auth = getAuth();

  const navigate = useNavigate()

  const [dayPosts, setDayPosts] = useState([])
  const [weekPosts, setWeekPosts] = useState([])
  const [monthPosts, setMonthPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])


  async function getAllPostslast24Hours() {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago

        const posts = [];
        snapshot.forEach(childSnapshot => {
          const postData = childSnapshot.val();
          const createdAt = new Date(postData.dop);
          if (createdAt >= last24Hours && createdAt <= now) {
            posts.push({ data: postData, id: childSnapshot.key });
          }
        });
        return posts;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  async function getAllPostslastWeek() {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 24 hours ago

        const posts = [];
        snapshot.forEach(childSnapshot => {
          const postData = childSnapshot.val();
          const createdAt = new Date(postData.dop);
          if (createdAt >= last24Hours && createdAt <= now) {
            posts.push({ data: postData, id: childSnapshot.key });
          }
        });
        return posts;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  async function getAllPostslastMonth() {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 24 hours ago

        const posts = [];
        snapshot.forEach(childSnapshot => {
          const postData = childSnapshot.val();
          const createdAt = new Date(postData.dop);
          if (createdAt >= last24Hours && createdAt <= now) {
            posts.push({ data: postData, id: childSnapshot.key });
          }
        });
        return posts;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }



  async function getAllPosts() {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach(childSnapshot => {
          posts.push({ data: childSnapshot.val(), id: childSnapshot.key });
        });
        return posts;
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
    getAllPosts().then((response) => {
      setAllPosts(response)
    })

    getAllPostslast24Hours().then((response) => {
      setDayPosts(response)
    })

    getAllPostslastWeek().then((response) => {
      setWeekPosts(response)
    })

    getAllPostslastMonth().then((response) => {
      setMonthPosts(response)
    })
  }, [])


  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8  w-full justify-between'>
      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Posts in last 24 hrs</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('postsdata/', {
            state: {
              postsdata: dayPosts
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{dayPosts.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Posts in last week</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('postsdata/', {
            state: {
              postsdata: weekPosts
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{weekPosts.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Posts in last month</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('postsdata/', {
            state: {
              postsdata: monthPosts
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{monthPosts.length}</p>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg md:text-xl text-center'>Overall Posts</p>
        <div className='flex justify-center items-center w-full bg-gray-200 h-[100px] md:h-[120px] my-2 rounded-xl cursor-pointer' onClick={() => {
          navigate('postsdata/', {
            state: {
              postsdata: allPosts
            }
          })
        }}>
          <p className='text-xl md:text-3xl font-semibold'>{allPosts.length}</p>
        </div>
      </div>
    </div>
  )
}

export default PostAnalytics