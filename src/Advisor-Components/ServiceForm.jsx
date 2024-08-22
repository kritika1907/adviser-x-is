import React, { useContext, useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { Button, Checkbox, CircularProgress, useStepContext } from '@mui/material';
import Swal from 'sweetalert2';
import AvailabilitySchedule from './AvailabilitySchedule';
import { useLocation, useNavigate } from 'react-router-dom';
import StateContext from '../Context/StateContext';
import { getAuth } from 'firebase/auth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

const ServiceForm = () => {

  const database = getDatabase(app);
  const auth = getAuth();
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adviserData, setAdviserData] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const {handleDialogOpen, updateHeader, setUpdateHeader  } = useContext(StateContext)
  const { handleShareDialogOpen, setShareURL } = useContext(StateContext)

  const { serviceid } = location.state || {}


  function convertSpacesToUnderscores(inputString) {
    return inputString.replace(/\s+/g, '_');
  }


  const durations = [
    { title: "30 minutes", value: 30 },
    { title: "60 minutes", value: 60 },
    { title: "90 minutes", value: 90 },
    { title: "120 minutes", value: 120 },
  ]

  const initialValues = {
    service_name: '',
    about_service: '',
    duration: '',
    price: '',
    // booking_days: '',
    // booking_time:''
    // availability:null
    isPublished:false
  }

  const validationSchema = Yup.object().shape({
    service_name: Yup.string()
      .required('Service name is required')
      .min(2, 'Service name must be at least 2 characters long')
      .matches(/^[^/]*$/, 'Servicename must not contain "/"'),
    about_service: Yup.string()
      .required('About service is required')
      .min(10, 'About service must be at least 10 characters long')
      .max(500, 'About service cannot be more than 500 characters long'),
    duration: Yup.number()
      .required('Duration is required'),
    price: Yup.number()
      .required('Price is required')
      .typeError('Price must be a number')
      .positive('Price must be a positive number')
      .integer('Price must be an integer'),
    isPublished: Yup.boolean()
,
    // booking_days: Yup.string()
    //   .required('Booking days is required'),
    // booking_time: Yup.string()
    //   .required('Booking time is required'),
    // availability: Yup.mixed()
    //   .nullable()
    //   .required('You have to set your availability')
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
          
    setLoading(true)

    //     const user = auth.currentUser;
    // if (!user) {
  
    //     console.error('User is not authenticated.');
    //     setLoading(false);
    //     return;
    // }
    if(serviceid == undefined)
      {

        const serviceid = uuidv1();
        const userid = JSON.parse(localStorage.getItem('adviserid'))
    
       await set(ref(database, 'advisers_service/' + serviceid),{
    
          adviserid:userid,
          service_name:formik.values.service_name,
          about_service:formik.values.about_service,
          duration:formik.values.duration,
          price:formik.values.price,
          isPublished:formik.values.isPublished
          // booking_days:formik.values.booking_days,
          // booking_time:formik.values.booking_time
          // availability:formik.values.availability
    
        });
    
    
        
        const adviserData = await getUser(userid)
        const currentServices = adviserData.services || []; // Retrieve existing IDs or initialize to an empty array
      
        // Add the new ID to the array
        const updatedServices = [...currentServices, serviceid];
      
        // Update the array field in the database
        await update(ref(database, 'advisers/' + userid), { services : updatedServices });

        if(formik.values.isPublished == true)
          {
            const publishedServices = adviserData.published_services || [];

            const updatedpublishedServices = [...publishedServices, serviceid];

            await update(ref(database, 'advisers/' + userid), { published_services : updatedpublishedServices }); 
          }
      
    
         await Swal.fire({
          title: "Success",
          text: "Your Service Added Successfully!!",
          icon: "success"
        });

        setUpdateHeader(!updateHeader)
      }
      else{
        await update(ref(database, 'advisers_service/' + serviceid),{
          service_name:formik.values.service_name,
          about_service:formik.values.about_service,
          duration:formik.values.duration,
          price:formik.values.price,
          isPublished:formik.values.isPublished
          // booking_days:formik.values.booking_days,
          // booking_time:formik.values.booking_time
          // availability:formik.values.availability
    
        });
        await Swal.fire({
          title: "Success",
          text: "Your Service Updated Successfully!!",
          icon: "success"
        });
      }

       setLoading(false)
    formik.resetForm();
    navigate('/adviser/services')

  }

  async function getService(serviceId) {
    const nodeRef = ref(database, `advisers_service/${serviceId}`);
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


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })


  const deleteService = async (serviceId) =>{
    try {
      const adviserId = JSON.parse(localStorage.getItem('adviserid'));
  
      await remove(ref(database, 'advisers_service/' + serviceId));

      const adviserRef = ref(database, 'advisers/' + adviserId);
      const snapshot = await get(adviserRef);
      if (snapshot.exists()) {
        const adviserData = snapshot.val();
        const currentServices = adviserData.services || [];
        const publishedServices = adviserData.published_services || [];
  
  
        const updatedServices = currentServices.filter(id => id !== serviceId);
        const updatedpublishedServices = publishedServices.filter(id => id !== serviceId)


  
        await update(adviserRef, { 
          services: updatedServices,
          published_services: updatedpublishedServices
         });
  
  
        await Swal.fire({
          title: "Success",
          text: "Your Service Deleted Successfully!!",
          icon: "success"
        });
        formik.resetForm()
        navigate('/adviser/services')
      } else {
        console.log('Adviser not found');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the service.",
        icon: "error"
      });
    }
  }



  const deleteHandler = async (serviceId) =>{

    Swal.fire({
      title: "Do you want to delete the service?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteService(serviceId)
      }
    });
  }

  const check = async () =>{
    const adviserid = JSON.parse(localStorage.getItem('adviserid'))

    const user = await getUser(adviserid)
    if(user.availability == undefined)
      {
      await Swal.fire({
          title: "Oops!!",
          text: "You have to set your availability in calender before creating any service in service.",
          icon: "error"
        });
        navigate('/adviser/services')
        handleDialogOpen()

      }
      else if (user.profile_photo == undefined )
        {
         await Swal.fire({
            title: "Oops!!",
            text: "Please add your profile image first",
            icon: "error"
          });
          navigate('/adviser/profile')

        }
        else if (user.professional_bio == undefined )
          {
           await  Swal.fire({
              title: "Oops!!",
              text: "Please add your professional bio first",
              icon: "error"
            });
            navigate('/adviser/profile')

          }

  }

  useEffect (() =>{

    check()
    if(serviceid != undefined)
     {
       getService(serviceid).then((serviceData)=>{
         formik.setValues({
           service_name: serviceData.service_name || '',
           about_service: serviceData.about_service || '',
           duration: serviceData.duration || '',
           price: serviceData.price || '',
           isPublished: serviceData.isPublished || false
         });
       })
     }

 },[])


 useEffect(()=>{
  const adviserid = JSON.parse(localStorage.getItem('adviserid'))
  getUser(adviserid).then((response)=>{
    setAdviserData(response)
  })
 })



  return (
    <div className="flex flex-col p-6 space-y-6 mb-[80px]">
      <p className='font-Poppins text-3xl font-bold s my-2'>Services</p>
      <form className="bg-[#D9D9D942] p-6 rounded-xl shadow-md space-y-6 md:w-3/6 ">
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Service Name</label>
          <input
            name="service_name"
            value={formik.values.service_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='CV Review'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins"
          />
                        {formik.touched.service_name &&
                formik.errors.service_name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.service_name}
                  </p>
                )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins ">About Service</label>
          <textarea
            name="about_service"
            value={formik.values.about_service}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Talent Acquisition Specialist at JindalX || Tech Mahindra || TCS'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins"
            rows="3"
          />
                        {formik.touched.about_service &&
                formik.errors.about_service && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.about_service}
                  </p>
                )}
        </div>
        {/* <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Duration</label>
          <input
            name="duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='1 hour'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.duration &&
                formik.errors.duration && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.duration}
                  </p>
                )}
        </div> */}

<div >
              <label className="block text-sm font-bold text-gray-700 font-Poppins ">Duration:</label>
              <select className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins" name="duration"
                value={formik.values.duration}
                onChange={(e) => {
                  formik.setFieldValue('duration', Number(e.target.value));
                }}
                // onChange={(e) => {
                //   formik.handleChange(e);
                //   const selectedValue = durations.find(item => item.title === e.target.value)?.value;
                //   formik.setFieldValue('duration', selectedValue);
                // }}
                onBlur={formik.handleBlur}
              >
                <option>Select Duration</option>
                {
                  durations.map((item,idx) => (
                    <option key={idx} value={item.value}>{item.title}</option>
                  ))
                }
      
              </select>
              {formik.touched.duration &&
                formik.errors.duration && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.duration}
                  </p>
                )}
            </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Price</label>
          <input
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            placeholder='499'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.price &&
                formik.errors.price && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.price}
                  </p>
                )}
        </div>
        {/* <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Booking Days</label>
          <input
            name="booking_days"
            value={formik.values.booking_days}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='Mon, Wed, Fri'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm font-Poppins focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.booking_days &&
                formik.errors.booking_days && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.booking_days}
                  </p>
                )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Booking Time</label>
          <input
            name="booking_time"
            value={formik.values.booking_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='8:00pm - 9:00pm, 10:00pm - 12:00pm'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.booking_time &&
                formik.errors.booking_time && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.booking_time}
                  </p>
                )}
        </div> */}

        {/* <div>
        <Button onClick={handleDialogOpen} variant="contained" color="primary">Set Availability</Button>
        <AvailabilitySchedule open={dialogOpen} handleClose={handleDialogClose} formik={formik}/>
        {formik.touched.availability &&
                formik.errors.availability && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.availability}
                  </p>
                )}
        </div> */}

{ serviceid == undefined && <div>
              <div className='flex'>
                <Checkbox
                  name='isPublished'
                  value={formik.values.isPublished}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.isPublished && Boolean(formik.errors.isPublished)}
                  helperText={formik.touched.isPublished && formik.errors.isPublished} /> <p className='font-workSans text-md pt-2'>Do you want to publish it now?</p>
              </div>
              {formik.touched.isPublished &&
                formik.errors.isPublished && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.isPublished}
                  </p>
                )}
            </div>}

        <div className="flex space-x-4">
        { serviceid == undefined &&           <button className="bg-[#489CFF] text-white rounded-md py-2 px-4 font-Poppins" onClick={formik.handleSubmit} type="submit" disabled={loading}>
          { !loading ? 'Create' : <CircularProgress  color="inherit"  />}
          </button>}
    
         { serviceid != undefined && <button className="bg-[#489CFF] text-white rounded-md py-2 px-4 font-Poppins" onClick={formik.handleSubmit} type="submit" disabled={loading}>
          { !loading ? 'Update' : <CircularProgress  color="inherit"  />}
          </button>}

        { serviceid != undefined && <button type="button" className="bg-[#FF5348] text-white rounded-md py-2 px-4 font-Poppins" onClick={()=>deleteHandler(serviceid)}>Delete</button>}
        </div>
      </form>
      <button

className="fixed bottom-[160px] md:bottom-[180px] right-[30px] md:right-[70px]  p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
onClick={() => {
  const adviserid = JSON.parse(localStorage.getItem('adviserid'))
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
            <WhatsAppIcon fontSize="large"/>
        </a>
        </button>
    </div>
  );
};

export default ServiceForm;
