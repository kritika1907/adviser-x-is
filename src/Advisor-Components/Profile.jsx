import React, { useContext, useEffect, useState } from 'react'
import profile from '../assets/profile.png'
import User from '../assets/User.png'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress, useStepContext } from '@mui/material';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { v1 as uuidv1 } from 'uuid';
import { getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { ref as sRef } from 'firebase/storage';
import StateContext from '../Context/StateContext';
import EditIcon from '@mui/icons-material/Edit';
import profile_background from '../assets/profile_background.jpg'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ProfileSkeleton from '../Skeletons/ProfileSkeleton';

function Profile() {
 
  

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const [ isUpdated, setIsUpdated] = useState(false)
  const [adviserData, setAdviserData] = useState(null)


  

  const database = getDatabase(app);
  const navigate = useNavigate();
  const adviserId = JSON.parse(localStorage.getItem('adviserid'));


  const { updateHeader, setUpdateHeader , handleShareDialogOpen, setShareURL  } = useContext(StateContext)

  const industries = [
    "Information Technology (IT) and Software Development",
    "Healthcare and Medical Services",
    "Education and EdTech",
    "Finance and FinTech",
    "Marketing and Advertising",
    "Manufacturing and Industry 4.0",
    "Legal Services",
    "Media and Entertainment",
    "Real Estate and Property Management",
    "Retail and E-commerce",
    "Hospitality and Tourism",
    "Human Resources and Talent Management",
    "Sales and Business Development",
    "Automotive and Mobility",
    "Aerospace and Defense",
    "Energy and Utilities",
    "Food and Agriculture",
    "Biotechnology and Pharmaceuticals",
    "Construction and Real Estate Development",
    "Transportation and Logistics"
  ];

  const categories = [
    "Actor",
    "Artist",
    "Athlete",
    "Author",
    "Blogger",
    "Chef",
    "Coach",
    "Comedian",
    "Content Creator",
    "Dancer",
    "Designer",
    "Digital Creator",
    "Director",
    "Educator",
    "Entrepreneur",
    "Fitness Trainer",
    "Gamer",
    "Graphic Designer",
    "Influencer",
    "Makeup Artist",
    "Model",
    "Musician/Band",
    "Photographer",
    "Public Figure",
    "Speaker",
    "Stylist",
    "Tattoo Artist",
    "Travel Blogger",
    "Videographer",
    "Writer"
  ];

  const initialValues = {
    name: '',
    professional_bio:'',
    professional_title: '',
    experience:0,
    education: '',
    industry: '',
    profile_photo:null,
    profile_background:null
  }
  function convertSpacesToUnderscores(inputString) {
    return inputString.replace(/\s+/g, '_');
  }

  const handleLogOut = async () => {
  
    Swal.fire({
      title: "Do you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("adviserid", JSON.stringify(null));
        navigate('/adviser');
      }
    });

  };


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters long')
      .required('Name is required'),
    professional_bio: Yup.string()
      .required('Professional bio is required')
      .min(10, 'Professional bio must be at least 10 characters')
      .max(1000, 'Professional bio must be at most 1000 characters'),
      professional_title: Yup.string()
      .required('Professional title is required')
      .min(2, 'Professional title must be at least 2 characters')
      .max(50, 'Professional title must be at most 50 characters'),
    experience: Yup.number()
      .required('Experience is required')
      .min(0, 'Experience must be at least 0 years'),
    education: Yup.string()
      .required('Education is required'),
    industry: Yup.string()
      .required('Industry is required'),
      profile_photo: Yup
      .mixed()
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true;
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File size is too large (max 5MB)", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024; // 5MB in bytes
      }),
    profile_background: Yup
      .mixed()  
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true;
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File size is too large (max 5MB)", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024; // 5MB in bytes
      })


  });

  const handleSubmit = async () => {
    
    setLoading(true);

    // const user = auth.currentUser;
    // if (!user) {
      
    //     console.error('User is not authenticated.');
    //     setLoading(false);
    //     return;
    // }

    const userid = JSON.parse(localStorage.getItem('adviserid'));
    const storage = getStorage();
    const { profile_photo, name, professional_bio, professional_title, experience, education ,industry, profile_background } = formik.values;
  
    try {
      let profilePhotoURL = null;
      let profileBackgroundURL = null
  
      if (profile_photo) {
        const imgRef = sRef(storage, `images/${uuidv1()}`);
        const uploadResult = await uploadBytes(imgRef, profile_photo);
        profilePhotoURL = await getDownloadURL(uploadResult.ref);
      }

      if (profile_background) {
        const imgRef = sRef(storage, `images/${uuidv1()}`);
        const uploadResult = await uploadBytes(imgRef, profile_background);
        profileBackgroundURL = await getDownloadURL(uploadResult.ref);
      }
  
      // const updateData = {
      //   username: name,
      //   professional_bio: professional_bio,
      // };
  
      if (profilePhotoURL && profileBackgroundURL) {

        await update(ref(getDatabase(), 'advisers/' + userid),{
          username: name,
          professional_bio: professional_bio,
          profile_photo:profilePhotoURL,
          profile_background:profileBackgroundURL,
          professional_title:professional_title,
          years_of_experience:experience,
          education:education,
          industry:industry,
        });
      }
      else if( profilePhotoURL){

        await update(ref(getDatabase(), 'advisers/' + userid),{
          username: name,
          professional_bio: professional_bio,
          professional_title:professional_title,
          profile_photo:profilePhotoURL,
          years_of_experience:experience,
          education:education,
          industry:industry,
        });
      }
      else if (profileBackgroundURL){

        await update(ref(getDatabase(), 'advisers/' + userid),{
          username: name,
          professional_bio: professional_bio,
          professional_title:professional_title,
          profile_background:profileBackgroundURL,
          years_of_experience:experience,
          education:education,
          industry:industry,
        });
      }
      else{
        await update(ref(getDatabase(), 'advisers/' + userid),{
          username: name,
          professional_bio: professional_bio,
          professional_title:professional_title,
          years_of_experience:experience,
          education:education,
          industry:industry,
        });
      }

  
      await Swal.fire({
        title: "Success",
        text: "Profile Updated Successfully!!",
        icon: "success",
      });
      setUpdateHeader(!updateHeader)
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Something Went Wrong!!",
        icon: "error",
      });
    } finally {
      setLoading(false);
      setIsUpdated(! isUpdated)
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })





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

  useEffect(() => {
    
    if (adviserId) {
      getUser(adviserId).then((userData) => {
        setUser(userData);
        formik.setValues({
          name: userData?.username || '',
          professional_bio: userData?.professional_bio || '',
          professional_title: userData?.professional_title || '',
          experience: parseInt(userData?.years_of_experience, 10) || 0,
          education: userData?.education || '',
          industry: userData?.industry || ''
        });

        setLoading(false); // Update loading state after fetching the user data
      });
    } else {
      setLoading(false); // Update loading state even if there's no user ID in localStorage
    }
  }, [isUpdated]);

  useEffect(()=>{
        getUser(adviserId).then((response)=>{
          setAdviserData(response)
        })
  },[])

  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress  /></div>; 
    return <div>
      <ProfileSkeleton />
    </div>

  }

  return (
    <div className="flex flex-col pt-0 py-6 px-2 sm:p-6  mb-[80px]">
    {/* <p className='font-Poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold s my-2'>Profile</p> */}
    <div className='relative h-28 md:h-56 w-full bg-black'>
      <img src={user && user.profile_background ? user.profile_background : profile_background}
       alt="" 
       className='h-full w-full object-cover'
        />
    <label htmlFor="profileBackgroundInput" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer mr-4">
              <EditIcon />
            </label>
            <input
              id="profileBackgroundInput"
              type="file"
              accept="image/*"
              className="hidden"
              name="profile_background"
              onChange={(event) => {
                  formik.setFieldValue("profile_background", event.target.files[0]);
              }}
            />
                  {formik.errors.profile_background && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "red",
                                            }}
                                            className='text-right'
                                        >
                                            {formik.errors.profile_background}
                                        </p>
                                    )}
    </div>

    <div className="relative flex -mt-12 md:-mt-24 ml-2 md:ml-8 items-center space-x-4 w-full my-4 md:w-4/6 lg:w-3/6 ">
       <div className='relative '>
        <img 
          src={user && user.profile_photo ? user.profile_photo : User} 
          alt="" 
          className="rounded-full w-32 h-32 lg:h-48 lg:w-48 object-cover"
        />
        
                    <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
              <EditIcon />
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              name="profile_photo"
              onChange={(event) => {
                  formik.setFieldValue("profile_photo", event.target.files[0]);
              }}
              // onChange={handleImageChange}
            />
        </div>
        {/* <div className=' flex flex-col justify-center items-center ' style={{marginLeft:"30px"}}>
          <p className="text-lg md:text-xl lg:text-2xl font-bold font-Poppins">Followers</p>
          <p className='text-lg md:text-xl lg:text-2xl font-bold font-Poppins'>{user && user.followers ? user.followers.length : 0}</p>
        </div> */}
        

      </div>

      {formik.errors.profile_photo && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "red",
                                            }}
                                            className='ml-[25px] md:ml-[50px] lg:ml-[65px]'
                                        >
                                            {formik.errors.profile_photo}
                                        </p>
                                    )}

<div className='flex justify-end'>
          <button className="bg-[#489CFF] text-white rounded-md py-2 md:mx-2 px-2 md:px-4 md:text-lg lg:text-xl m-4" onClick={handleLogOut}>Logout</button>
          </div>

    <form className="bg-[#D9D9D942] p-6 rounded-xl shadow-md space-y-6 md:w-4/6 lg:w-3/6 pb-[200px]  ">
      <div>
        <label className="block text-sm font-bold text-gray-700 font-Poppins">Name</label>
        <input
          name="name"
          type="text"
          value={formik.values.name}
          placeholder='Utkarsh Pandey'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins"
        />
                      {formik.touched.name &&
                formik.errors.name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.name}
                  </p>
                )}
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 font-Poppins">Professional BIO </label>
        <textarea
          name='professional_bio'
          value={formik.values.professional_bio}
          placeholder=''
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins h-16"
          rows="3"
        />
                              {formik.touched.professional_bio &&
                formik.errors.professional_bio && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.professional_bio}
                  </p>
                )}
      </div>
      <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 font-Poppins">Professional Title:</label>
              <input
                name="professional_title"
                value={formik.values.professional_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins"
                placeholder="Sr. UI & UX Designer"
              />
              {formik.touched.professional_title &&
                formik.errors.professional_title && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.professional_title}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 font-Poppins">Year of Experience:</label>
              <input
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins"
                placeholder="5"
              />
              {formik.touched.experience &&
                formik.errors.experience && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.experience}
                  </p>
                )}
            </div>
                       <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 font-Poppins">Education:</label>
              <select className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins" name="education"
                value={formik.values.education}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue('education', e.target.value);
                }}
                onBlur={formik.handleBlur}
              >
                <option>Select Education</option>
                <option>12th Pass</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctrate</option>
                {/* Add other options here */}
              </select>
              {formik.touched.education &&
                formik.errors.education && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.education}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 font-Poppins">Category:</label>
              <select className="w-full mt-1 p-2 border border-gray-300 rounded-md font-Poppins" name="industry"
                value={formik.values.industry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option>Select Category</option>
                 {categories.map((item, idx) => (
                  <option key={idx} value={item}>{item}</option>
                 ))}
                {/* Add other options here */}
              </select>
              {formik.touched.industry &&
                formik.errors.industry && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.industry}
                  </p>
                )}
            </div>
      {/* <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 font-Poppins">Change Profile Photo:</label>

                            <div className='my-4'>
                                <label class="block">
                                    <span class="sr-only">Choose profile photo</span>
                                    <input type="file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        name="profile_photo"
                                        onChange={(event) => {
                                            formik.setFieldValue("profile_photo", event.target.files[0]);
                                        }}
                                    />
                                </label>
                                {formik.touched.profile_photo &&
                                    formik.errors.profile_photo && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                padding: "",
                                                color: "red",
                                            }}
                                        >
                                            {formik.errors.profile_photo}
                                        </p>
                                    )}
                            </div>
                        </div> */}
 
      <div className="flex space-x-4">
        <button type="submit" className="bg-[#489CFF] text-white rounded-md py-2 px-4" onClick={formik.handleSubmit}>
         Update
        </button>
      </div>
    </form>
    <button

className="fixed bottom-[160px] md:bottom-[180px] right-[30px] md:right-[70px]  p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
onClick={() => {
  handleShareDialogOpen()
  setShareURL(`https://www.adviserxiis.com/category/${convertSpacesToUnderscores(adviserData?.username)}/${adviserId}`)
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
            <WhatsAppIcon fontSize="large"/>
        </a>
        </button>
  </div>
  )
}

export default Profile