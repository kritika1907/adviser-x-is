import React, { useContext, useEffect, useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { ref as sRef } from 'firebase/storage';
import { CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StateContext from '../Context/StateContext';



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

function CreatePost() {

  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [adviserData, setAdviserData] = useState(null)

  const { handleShareDialogOpen, setShareURL } = useContext(StateContext)
  const adviserid = JSON.parse(localStorage.getItem('adviserid'))




  const initialValues = {
    post_file: null,
    post_description:''

  }

  function convertSpacesToUnderscores(inputString) {
    return inputString.replace(/\s+/g, '_');
  }

  const validationSchema = Yup.object().shape({
    // post_file: Yup
    // .mixed()
    // .test("fileType", "Unsupported file type", (value) => {
    //   if (!value) return true;
    //   const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/avi"];
    //   return allowedTypes.includes(value.type);
    // })
    // .test("fileSize", "File size is too large (max 5MB)", (value) => {
    //   if (!value) return true;
    //   return value.size <= 50 * 1024 * 1024; // 10MB in bytes
    // })
    // .required("file is required"),

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
      .max(250, 'Professional bio must be at most 250 characters'),
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
    const userid = JSON.parse(localStorage.getItem('adviserid'));
    const storage = getStorage();
    const { post_file } = formik.values;
    const date = new Date().toString();



    try {
      let postFileURL = null;
      let fileType = null;

      if (post_file) {
        const fileRef = sRef(storage, `posts/${uuidv1()}`);
        const uploadResult = await uploadBytes(fileRef, post_file);
        postFileURL = await getDownloadURL(uploadResult.ref);


        fileType = post_file.type.startsWith('video/') ? 'video' : 'image';
      }



      const postid = uuidv1();
      const post_description = formik.values.post_description;

      if(post_description && post_description !== '')
      {
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

      else{
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
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  useEffect(() => {
    getUser(adviserid).then((response) => {
      setAdviserData(response)
    })
  })



  return (
    <div className="flex flex-col pt-0 py-6 px-4  sm:px-2 sm:p-6 ">
      <div className='flex justify-between items-center'>
        <p className='font-Poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold s my-2'>Create Post</p>
        <button className="bg-[#489CFF] text-white rounded-md py-2 md:mx-2 px-2 md:px-4 md:text-lg lg:text-xl" onClick={() => navigate('/adviser/createdpost')}>Created Posts</button>
      </div>

      <form className="bg-[#D9D9D942] p-6 rounded-xl shadow-md space-y-6 md:w-3/6  pb-[200px] mt-[60px]">


        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Select video to Post in 9:16 ratio</label>

          <div className='my-4'>
            <label class="block">
              <span class="sr-only">Choose Post</span>
              <input type="file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                name="post_file"
                onChange={(event) => {
                  formik.setFieldValue("post_file", event.target.files[0]);
                }}
              />
            </label>
            {formik.touched.post_file &&
              formik.errors.post_file && (
                <p
                  style={{
                    fontSize: "13px",
                    padding: "",
                    color: "red",
                  }}
                >
                  {formik.errors.post_file}
                </p>
              )}
          </div>
        </div>

        <div>
        <label className="block text-sm font-bold text-gray-700 font-Poppins">Video description</label>
        <textarea
          name='post_description'
          value={formik.values.post_description}
          placeholder=''
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins h-16"
          rows="3"
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

        <div className="flex space-x-4">
          <button type="submit" className="bg-[#489CFF] text-white rounded-md py-2 px-4" onClick={formik.handleSubmit} disabled={loading}>
            {!loading ? 'Create Post' : <CircularProgress color="inherit" />}
          </button>
        </div>
      </form>
      <button

        className="fixed bottom-[160px] md:bottom-[180px] right-[30px] md:right-[70px]  p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
        onClick={() => {
          handleShareDialogOpen()
          setShareURL(`https://www.adviserxiis.com/category/${convertSpacesToUnderscores(adviserData?.username)}/${adviserid}`)
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
  )
}

export default CreatePost