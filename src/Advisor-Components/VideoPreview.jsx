import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomVideoShare from '../User-Components/CustomeVideoShare';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { deleteObject, getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { ref as sRef } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { PowerSettingsNewRounded } from '@mui/icons-material';

Yup.addMethod(Yup.mixed, 'aspectRatio', function (ratio, message) {
  return this.test('aspect-ratio', message, async (value) => {
    if (!value) return true;

    const video = document.createElement('video');
    video.src = URL.createObjectURL(value);

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const [expectedWidth, expectedHeight] = ratio.split(':').map(Number);
        const expectedAspectRatio = expectedWidth / expectedHeight;

        resolve(Math.abs(videoAspectRatio - expectedAspectRatio) < 0.01); // Tolerance for floating-point errors
      };
    });
  });
});

const VideoPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const database = getDatabase(app);
  const auth = getAuth();
  const storage = getStorage()

  const [loading, setLoading] = useState(false);
  const [croppedArea, setCroppedArea] = useState(null);
  const { postid, postFileURL, file } = location.state || {};

  async function deleteFileFromStorage(postid) {
    try {
      // Reference to the file you want to delete
      const fileRef = sRef(storage, `posts/${postid}`);

      // Delete the file
      await deleteObject(fileRef);
      // console.log(`File with postid ${postid} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    navigate('/adviser/createpost')
  }



  useEffect(() => {
    if (!postFileURL) {
      navigate('/adviser/createpost') // Redirect if no file is selected
    }
    else {
      // console.log(postFileURL, postid)
      formik.setValues({
        post_file: file,
      });
    }

  }, [postFileURL]);


  const initialValues = {
    post_description: ''
  }

  const validationSchema = Yup.object().shape({
    post_file: Yup.mixed()
      .required('File is required')
      .test('fileType', 'Unsupported file type', (value) => {
        if (!value) return false; // File is required, so no file should be an error
        return value.type.startsWith('video/');
      })

      // .test('fileSize', 'File size is too large (max 50MB)', (value) => {
      //   if (!value) return true;
      //   return value.size <= 50 * 1024 * 1024; // 50MB in bytes
      // })
      .test('fileDuration', 'Video must not be more than 60 seconds', async (value) => {
        if (!value) return true;
        const video = document.createElement('video');
        video.src = URL.createObjectURL(value);
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video.duration <= 60);
          };
        });
      })
      .aspectRatio('9:16', 'Video must have an aspect ratio of 9:16')
      .required('Video is required'),
    post_description: Yup.string()
      .max(250, 'Post description must be at most 250 characters'),
  });

  async function getUser(userId) {
    const nodeRef = ref(database, `advisers/${userId}`);
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

  const handleSubmit = async () => {
    setLoading(true);
    const adviserid = JSON.parse(localStorage.getItem('adviserid'))
    const storage = getStorage();
    const date = new Date().toString();

    try {
      //   let postFileURL = null;
      //   let fileType = null;

      //   if (post_file) {
      //     const fileRef = sRef(storage, `posts/${uuidv1()}`);
      //     const uploadResult = await uploadBytes(fileRef, post_file);
      //     postFileURL = await getDownloadURL(uploadResult.ref);
      // }

      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const postid = uuidv1();
      const post_description = formik.values.post_description;

      if (post_description && post_description !== '') {
        await set(ref(database, 'advisers_posts/' + postid), {
          adviserid: adviserid,
          post_file: postFileURL,
          file_type: fileType,
          description: post_description,
          dop: date,
          views: 0,
          likes: [],
        });
      }
      else {
        await set(ref(database, 'advisers_posts/' + postid), {
          adviserid: adviserid,
          post_file: postFileURL,
          file_type: fileType,
          dop: date,
          views: 0,
          likes: [],
        });
      }
      const adviserData = await getUser(adviserid)
      const currentPosts = adviserData.posts || []; // Retrieve existing IDs or initialize to an empty array

      // Add the new ID to the array
      const updatedPosts = [...currentPosts, postid];

      // Update the array field in the database
      await update(ref(database, 'advisers/' + adviserid), { posts: updatedPosts });


      setLoading(false)
      await Swal.fire({
        title: "Success",
        text: "Post Created Successfully!!",
        icon: "success",
      });
      formik.resetForm()
      navigate('/adviser/createpost')
    } catch (error) {
      console.log("Error", error)
      await Swal.fire({
        title: "Error",
        text: "Something Went Wrong!!",
        icon: "error",
      });
    } finally {
      setLoading(false)
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };



  return (
    <div className='min-h-screen sm:pt-[20px] mb-[120px] font-Poppins'>
      <div className='mx-4 flex flex-col md:flex-row '>
        {/* <p className='text-lg md:text-3xl font-bold'>Preview and Edit Video</p> */}

        <div className='md:w-1/2'>
          <div className='text-lg md:text-2xl mb-2'>
            <ArrowBackOutlinedIcon fontSize='inherit' className='cursor-pointer' onClick={() => deleteFileFromStorage(postid)} />
          </div>
          <div className='flex flex-col  justify-center  items-center'>
            <div className='w-[260px] h-[360px] sm:w-[500px] sm:h-[600px] md:w-[600px] md:h-[700px]  bg-gray-200'>
              {postFileURL && (
                <CustomVideoShare src={postFileURL} />
              )}
            </div>
            {
              formik.errors.post_file && (
                <p
                  style={{
                    fontSize: "13px",
                    paddingTop: "5px",
                    color: "red",
                  }}
                >
                  {formik.errors.post_file}
                </p>
              )}
          </div>
        </div>



        <div className='md:w-1/3 md:mt-[40px] md:mx-[50px]'>
          <form onSubmit={formik.handleSubmit} className='mt-2 px-4'>
            <div>
              <label className="block text-sm md:text-lg text-gray-500 font-Poppins">Write caption...</label>
              <textarea
                name='post_description'
                value={formik.values.post_description}
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-2 py-1 border-b border-black focus:outline-none focus:border-b focus:border-gray-500 rounded-none font-Poppins h-12"
                rows="2"
              />
              {formik.touched.post_description &&
                formik.errors.post_description && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.post_description}
                  </p>
                )}
            </div>
            <div className='flex justify-between'>
              <button type='button' className='w-1/2 mt-4 text-gray-500 border border-gray-500 px-4 py-2 rounded-md mx-2' onClick={() => deleteFileFromStorage(postid)}>Cancel</button>
              <button type='submit' className='w-1/2  mt-4 bg-blue-500 text-white px-4 py-2 rounded-md mx-2' disabled={loading}>
                {!loading ? 'Post' : <CircularProgress color="inherit" />}
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
};

export default VideoPreview;
