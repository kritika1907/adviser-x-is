import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2';
import CustomVideoShare from '../User-Components/CustomeVideoShare';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref as sRef, uploadBytes } from 'firebase/storage';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CircularProgress } from '@mui/material';
import VideoCard from './VideoCard';
import CreatePostSkeleton from '../Skeletons/CreatePostSkeleton';

function VideoUpload() {

  const auth = getAuth();

  const database = getDatabase(app);
  const storage = getStorage();

  const navigate = useNavigate()

  const adviserid = JSON.parse(localStorage.getItem('adviserid'))

  const [posts, setPosts] = useState([])
  const [loading1, setLoading1] = useState(false)
  const [loading, setLoading] = useState(true)


  async function getAdviserAllPosts(adviserid) {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.val().adviserid === adviserid) {
            posts.push({ data: childSnapshot.val(), id: childSnapshot.key });
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

  const handleVideoSelect = async (event) => {
    const file = event.target.files[0];

    if (file) {

      setLoading1(true)
      const postid = uuidv1();;
      const fileRef = sRef(storage, `posts/${postid}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const postFileURL = await getDownloadURL(uploadResult.ref);

      navigate(`/adviser/postpreview`, {
        state: {
          postid,
          postFileURL,
          file
        }
      })
      setLoading1(false)
    }
  };

  useEffect(() => {

    async function fetchAdviserPosts() {
      getAdviserAllPosts(adviserid).then((response) => {

        response.sort((a, b) => {
          const dateA = new Date(a.data.dop).getTime();
          const dateB = new Date(b.data.dop).getTime();
          return dateB - dateA; // Sort in descending order (latest posts first)
        });

        setPosts(response)
        setLoading(false)
      })


    }

    fetchAdviserPosts();
  }, [loading])

  useEffect(()=>{
     if(adviserid == null)
     {
      navigate('/adviser/login')
     }
  },[])

  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>;
    return <div>
      <CreatePostSkeleton />
    </div>


  }

  return (
    <div className='min-h-screen sm:pt-[50px] mb-[120px] font-Poppins'>
      <div className='mx-4 flex justify-between'>
        <p className='text-xl md:text-3xl font-bold'>Create Post</p>
      </div>

      <div className='bg-gray-200 mx-4 py-4 flex justify-center items-center mt-2'>
        <label htmlFor="profileBackgroundInput" className=" p-1 rounded-full cursor-pointer mr-4 ">

          {
            loading1 ? <div className='text-3xl  md:text-5xl  text-gray-600'>
              <CircularProgress fontSize='inherit' color='inherit' />
            </div> : <div className='text-3xl  md:text-5xl'>
              <AddCircleOutlineIcon fontSize='inherit' />
            </div>
          }

        </label>
        <input
          id="profileBackgroundInput"
          type="file"
          accept="video/*"
          className="hidden"
          name="profile_background"
          onChange={handleVideoSelect}
        />
      </div>
      <div className='text-[8px] sm:text-xs  md:text-sm text-gray-500 mx-4'>
        <p>Please upload a video in portrait mode with a 9:16 aspect ratio and a maximum duration of 1 minute.</p>
      </div>
      <div className='mx-4 mt-[30px]'>
        <p className='my-2 md:my-4 text-lg md:text-xl'>Your Posts</p>
        <div>
          <div className=' grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8 font-inter'>
            {posts.map((post, idx) => (
              post.data.post_file && (
                post.data.file_type && post.data.file_type === 'video' && (
                  <div key={idx} className=" md:m-2 bg-white rounded-xl md:rounded-2xl  w-full">
                    {/* <img src={photoCard}
                                          alt=""
                                          className='h-auto w-full object-cover'
                                          /> */}
                    {/* <video controls className="w-32 h-56 sm:w-[500px] sm:h-[500px]  md:w-[450px] md:h-[600px] rounded-xl  object-cover">
                    <source src={post.data.post_file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video> */}
                    <div >
                      <VideoCard src={post?.data?.post_file} postid={post?.id} loading={loading} setLoading={setLoading} description={post?.data?.description} />
                    </div>
                  </div>
                ))
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default VideoUpload