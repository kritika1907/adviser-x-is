import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import User from '../assets/User.png'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress, useStepContext } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ShareIcon from '@mui/icons-material/Share';
import VideocamIcon from '@mui/icons-material/Videocam';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Swal from "sweetalert2";
// import ShareDialog from "./ShareDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuth } from "firebase/auth";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StateContext from '../Context/StateContext';
import CustomVideo from "../User-Components/CustomVideo";
import CustomVideoShare from "../User-Components/CustomeVideoShare";

function CreatedPosts() {
  const database = getDatabase(app);
  const auth = getAuth();

  const navigate = useNavigate()
  const location = useLocation()

  const [posts, setPosts] = useState([])
  const [adviserData, setAdviserData] = useState(null)
  const [postsWithAdviser, setPostsWithAdviser] = useState([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(false) // state for  re rendering after like changes

  const { handleShareDialogOpen, setShareURL } = useContext(StateContext)

  const { specificpostid } = location.state || {}

  const userid = JSON.parse(localStorage.getItem('userid'));
  const adviserid = JSON.parse(localStorage.getItem('adviserid'));

  function convertSpacesToUnderscores(inputString) {
    return inputString.replace(/\s+/g, '_');
  }

  async function getAllPost() {
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

  const fetchServiceById = async (serviceId) => {
    const serviceRef = ref(database, `advisers_service/${serviceId}`);
    try {
      const snapshot = await get(serviceRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log(`No service available for service ID: ${serviceId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching service data for service ID: ${serviceId}`, error);
      return null;
    }
  };


  async function getUser(userId) {
    const nodeRef = ref(database, `advisers/${userId}`);
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        return ({ data: snapshot.val(), id: snapshot.key });
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return null;
    }
  }

  async function getPost(postid) {
    const nodeRef = ref(database, `advisers_posts/${postid}`);
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

  const deletePost = async (postid) => {
    remove(ref(database, 'advisers_posts/' + postid));

    const adviserRef = ref(database, 'advisers/' + adviserid);
    const snapshot = await get(adviserRef);
    if (snapshot.exists()) {
      const adviserData = snapshot.val();
      const currentPosts = adviserData.posts || [];


      const updatedPosts = currentPosts.filter(id => id !== postid);



      await update(adviserRef, {
        posts: updatedPosts,
      });
    }

    setUpdated(prev => !prev)
  }





  const deleteHandler = async (postid) => {


    Swal.fire({
      title: "Do you want to delete this post?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postid)
      }
    });


  }




  useEffect(() => {
    getAllPost().then((response) => {
      setPosts(response)
      setLoading(false)
    })
  }, [updated])

  useEffect(() => {
    async function fetchAdviserAndServiceDetails() {
      const details = await Promise.all(
        posts.map(async (post) => {
          const adviser = await getUser(post.data.adviserid);
          let firstService = null;
          if (adviser && adviser.data?.services && adviser.data.services.length > 0) {
            firstService = await fetchServiceById(adviser.data.services[0]);
          }
          return { ...post, adviser, firstService };
        })
      );



      // Enhanced sort function to handle date and time properly
      details.sort((a, b) => {
        const dateA = new Date(a.data.dop).getTime();
        const dateB = new Date(b.data.dop).getTime();
        return dateB - dateA; // Sort in descending order (latest posts first)
      });

      if (specificpostid != undefined) {
        const postIndex = details.findIndex(post => post.id === specificpostid);
        console.log("postIndex", postIndex)
        if (postIndex !== -1) {
          const postToMove = details.splice(postIndex, 1)[0];
          details.unshift(postToMove); // Move the post to the beginning of the array
        }
      }
      setPostsWithAdviser(details)
    }

    fetchAdviserAndServiceDetails();
  }, [posts]);


  useEffect(() => {
    getUser(adviserid).then((response) => {
      setAdviserData(response)
    })
  }, [])




  if (loading) {
    return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>; // Show a loading message or spinner while fetching data
  }

  return (

    <div className="min-h-screen pt-[10px] sm:pt-[30px] mb-[80px] ">
      <div className=" md:mx-7xl  font-Poppin">
        <p className='font-Poppins text-3xl md:text-4xl lg:text-5xl font-bold pl-[10px] my-2'>Created Posts</p>
        <div className=" grid grid-cols-1 md:grid-cols-3  gap-4 m-4">
          {postsWithAdviser.map((post, idx) => ((post.data && post.data.adviserid && (post.data.adviserid === adviserid)) &&
            <div className="max-w-[900px] my-4" key={idx}>
              <div className="flex items-center justify-end bg-[#489CFF] p-2 px-4 rounded-tr-xl rounded-tl-xl">
                <div className="cursor-pointer text-2xl md:text-3xl lg:text-4xl">

                  {post.data && post.data.adviserid && (post.data.adviserid === adviserid) ? <DeleteIcon fontSize="inherit" onClick={() => deleteHandler(post.id)
                  } /> : ''}


                </div>
              </div>
              <div>

                {post.data.post_file && (
                  post.data.file_type && post.data.file_type === 'video' ? (
                    // <video controls className="w-full object-cover">
                    //   <source src={post.data.post_file} type="video/mp4" />
                    //   Your browser does not support the video tag.
                    // </video>

                    <CustomVideoShare src={post.data.post_file}  description={post.data.description}/>
                  ) : (
                    <img
                      src={post.data && post.data.post_file ? post.data.post_file : ''}
                      alt="Post Image"
                      className="w-96 h-96 sm:w-[500px] sm:h-[500px]   object-cover"
                    />
                  )
                )}
              </div>

              {
                post?.data?.description && <div className="bg-[#5A88FF] text-xs sm:text-sm  md:text-md  text-white px-2 py-1 p-4 rounded-bl-xl rounded-br-xl ">

                   <p>{post.data.description}</p>
                  </div>
              }


            </div>
          ))}

        </div>

      </div>
      <button

        className="fixed bottom-[160px] md:bottom-[180px] right-[30px] md:right-[70px]  p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
        onClick={() => {
          handleShareDialogOpen()
          setShareURL(`https://www.adviserxiis.com/category/${convertSpacesToUnderscores(adviserData?.data?.username)}/${adviserid}`)
        }}
      >
        <ShareOutlinedIcon fontSize="large" />

      </button>
      <button>
        <a
          href='https://api.whatsapp.com/send/?phone=%2B917703874893&text&type=phone_number&app_absent=0'
          target="_blank"
          className="fixed bottom-[80px] md:bottom-[100px] right-[30px] md:right-[70px]  p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition duration-300"
        >
          <WhatsAppIcon fontSize="large" />
        </a>
      </button>
    </div>
  );
}

export default CreatedPosts;
