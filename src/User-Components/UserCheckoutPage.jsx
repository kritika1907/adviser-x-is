import React, { useEffect, useState } from 'react'
import insta from '../user-assets/insta.png'
import fb from '../user-assets/fb.png'
import twitter from '../user-assets/twitter.png'
import profile from '../assets/profile.png'
import backicon from '../user-assets/backicon.png';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress } from '@mui/material'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { isBefore, startOfDay } from 'date-fns';
import Swal from 'sweetalert2'
import User from '../assets/User.png'
import ScheduleModal from './ScheduleModal'
import logo from '../assets/logo.png'
import { getAuth } from 'firebase/auth'
import CheckoutPageSkeleton from '../Skeletons/CheckoutPageSkeleton'

function UserCheckoutPage() {
  const database = getDatabase(app);
  const auth= getAuth();

  const navigate = useNavigate()
  const location = useLocation()

  const { adviserid,serviceid, advisername } = location.state ||{}

  const userid = JSON.parse(localStorage.getItem('userid'))


  const [user, setUser] = useState(null)
  const [adviser, setAdviser] = useState(null)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loading1, setLoading1] = useState(false)
  const [paymentId, setPaymentId] = useState(null)


  const [isModalOpen, setIsModalOpen] = useState(false);




  useEffect(() => {
    if (JSON.parse(localStorage.getItem('userid')) == null) {
      Swal.fire({
        title: "Oops!!",
        text: "You need to be loggedin.",
        icon: "error"
      });
      navigate('/createaccount')

    }
  }, [])
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };





  const createOrder = async () => {
    const username = 'rzp_live_fHsSBLQQOxeKlA';
    const password = 'jbycwjZLOrVfRDs77i2kHM6x';
    const credentials = btoa(`${username}:${password}`); // Base64 encode the username and password

    let data = null;
    const orderData = {
      amount: service.price * 100,
      currency: "INR",
      receipt: "qwsaq1"
    };

    try {
      const res = await fetch('https://adviserxiis-backend-three.vercel.app/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      data = await res.json();
      console.log('Order created:', data);
    } catch (error) {
      console.error('Error creating order:', error);
    }


    var options = {
      "key": "rzp_live_fHsSBLQQOxeKlA", // Enter the Key ID generated from the Dashboard
      "amount": orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Adviserxiis", //your business name
      "description": "Service Transaction",
      "image": {logo},
      "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": async function (response) {

        const body = { ...response };

        const validateResponse = await fetch('https://adviserxiis-backend-three.vercel.app/order/validate', {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        })

        const jsonRes = await validateResponse.json();
        if (validateResponse.status == 200) {
          await Swal.fire({
            title: "Success",
            text: "Payment Successfull!!",
            icon: "success"
          });

          await set(ref(database, 'payments/' + jsonRes.paymentId), {
            serviceid: serviceid,
            userid: userid,
            adviserid: adviserid,
            scheduled_date: formik.values.date,
            scheduled_time: formik.values.time,
            purchased_date: getCurrentDate()
          });

          await update(ref(database, 'users/' + userid), {
            username: `${user.name ? user.name : formik.values.name}`,
            email: formik.values.email
          });

          try {
            const userRef = ref(database, `advisers/${adviserid}`);

            // Fetch current data
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              const userData = snapshot.val();

              // Calculate new earnings
              const currentEarnings = userData.earnings || 0;
              const updatedEarnings = currentEarnings + service.price;

              // Update earnings
              await update(userRef, {
                earnings: updatedEarnings
              });

              console.log('Earnings updated successfully');
            } else {
              console.error('No data available for the specified user');
            }
          } catch (error) {
            console.error('Error updating earnings:', error);
          }

          await Swal.fire({
            title: "Success",
            text: "Service Booked Successfully!!",
            icon: "success"
          });
          formik.resetForm()
          setLoading1(false)

        }

        else {
          await Swal.fire({
            title: "Error",
            text: "Something went wrong!!",
            icon: "error"
          });
          formik.resetForm()
          setLoading1(false)

        }
        const payload = {
          userid: userid,
          adviserid: adviserid,
          serviceid: serviceid,
          paymentid: jsonRes.paymentId,
        };


        try {
          const response = await fetch('https://adviserxiis-backend-three.vercel.app/sendconfirmationemail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.error('Error in sending emails', error);
        }

      },


      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        "name": `${user.name}`, //your customer's name
        "email": `${user.email}`,
        "contact": `${user.mobile_number}`  //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.prventDefault()
  };

  const initialValues = {
    date: '',
    time: '',
    name: '',
    email: ''
  }

  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required('Date is required'),
      // .test('is-today-or-later', 'Date must be today or later', (value) => {
      //   return !isBefore(value, startOfDay(new Date()));
      // }),
    time: Yup.string()
      .required('Time is required'),
      // .matches(
      //   /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
      //   'Time must be in HH:mm format'
      // ),
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
      .required('Email is required'),
  });


  const handleSubmit = async () => {

    if (!user.name && formik.values.name == '') {
      Swal.fire({
        title: "Error",
        text: "Please fill the name",
        icon: "error"
      });

      return
    }

    setLoading1(true)
    createOrder()

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  const handleClickOnBackIcon = () =>{
    navigate(`/category/${advisername}`, { 
      state:{
        adviserid: adviserid,
        advisername: advisername
      }
})
  }


  async function getUser(userId) {
    const nodeRef = ref(database, `users/${userId}`);
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

  async function getAdviser(adviserId) {
    const nodeRef = ref(database, `advisers/${adviserId}`);
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



  useEffect(() => {
    getUser(userid).then((userData) => {
      setUser(userData)
      getAdviser(adviserid).then((adviserData) => {
        setAdviser(adviserData)
        getService(serviceid).then((serviceData) => {
          setService(serviceData)
        })
      });
      setLoading(false); // Update loading state after fetching the user data
    });

  }, [])

  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>
    return <div>
      <CheckoutPageSkeleton />
    </div>
  }

  return (
    <div className="container mx-auto  font-inter pt-[80px] mb-[80px]  bg-gray-100 md:bg-white">
      <div className='min-h-screen'>
        <div className="flex flex-col md:flex-row  my-8 ">

          <div className='md:mr-[100px] md:ml-[40px] px-4'>
            <button className="bg-[#489CFF] text-white py-2 px-4 rounded-full cursor-pointer " onClick={handleClickOnBackIcon }>
              <img
                src={backicon}
                alt=""
                className='h-8 w-4 rounded-full'
              />
            </button>
          </div>

          <div className='flex justify-center items-center  w-full p-4 '>
            <div className="w-2/6 sm:w-1/6 mr-[30px] md:mr-[50px] ">
              <img
                src={adviser && adviser.profile_photo ? adviser.profile_photo : User}
                alt=""
                className="h-32 w-32 rounded-full "
                style={{objectFit:"cover"}}
              />
            </div>
            <div className='w-4/6 sm:w-5/6 pt-[10px] break-words pr-[10px]'>
              <h1 className="text-2xl font-semibold">{adviser && adviser.username ? adviser.username : ''}</h1>
              <p className="text-gray-500 text-sm sm:text-sm md:text-md lg:text-xl ">{adviser && adviser.professional_bio ? adviser.professional_bio : ''}</p>
            </div>
          </div>
        </div>

        <div className='md:ml-[250px] flex flex-col md:flex-row '>
          <div className='w-full md:w-1/6 md:mr-[30px] px-[20px]'>
            <h2 className="text-xl font-semibold mb-2">Service Description</h2>
            <p className="text-gray-500 text-sm sm:text-md ">{service && service.about_service ? service.about_service : ''}</p>
          </div>
          
          <div className='mx-4 '>
          <div className="w-full mt-[20px]   bg-gray-200 p-6 rounded-lg shadow-md">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Service</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" value={service && service.service_name ? service.service_name : ''} readOnly />
              </div>
              <div>
                <label className="block text-gray-700">Whatsapp number</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" placeholder={user && user.mobile_number ? user.mobile_number : ''} readOnly />
                <small className="text-gray-500">Will update you the booking details on this number</small>
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <input name="email" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" placeholder='Enter Your Email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email &&
                  formik.errors.email && (
                    <p
                      style={{
                        fontSize: "13px",
                        padding: "",
                        color: "red",
                      }}
                    >
                      {formik.errors.email}
                    </p>
                  )}
              </div>


              {user && !user.name && <div>
                <label className="block text-gray-700">Name</label>
                <input name="name" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" placeholder='Enter Name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              }
              {/* <div>
                <label className="block text-gray-700">Schedule date</label>
                <input name="date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" placeholder='Enter Data'
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date &&
                  formik.errors.date && (
                    <p
                      style={{
                        fontSize: "13px",
                        padding: "",
                        color: "red",
                      }}
                    >
                      {formik.errors.date}
                    </p>
                  )}
              </div>


              <div>
                <label  className="block text-gray-700">Select Time</label>
                <input name="time" type="time" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" placeholder="Enter Time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.time &&
                  formik.errors.time && (
                    <p
                      style={{
                        fontSize: "13px",
                        padding: "",
                        color: "red",
                      }}
                    >
                      {formik.errors.time}
                    </p>
                  )}
              </div> */}


              <div>
                <label className="block text-gray-700">Price</label>
                <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 p-2" value={service && service.price ? service.price : ''} readOnly />
              </div>
              <div className="py-6">
                <div>
                <button
                  name="date"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  Select Time Slot
                </button>
                { formik.touched.date && (formik.errors.date ||
                  formik.errors.time) && (
                    <p
                      style={{
                        fontSize: "13px",
                        padding: "",
                        color: "red",
                      }}
                    >
                      {formik.errors.date ? formik.errors.date : formik.errors.time}
                    </p>
                  )}
                
                </div>
                <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} adviserData={adviser} serviceData={service} formik={formik}/>
              </div>
              <button type="submit" className="bg-[#489CFF] text-white py-2 px-4 rounded-2xl w-full h-12 p-2" onClick={formik.handleSubmit} disabled={loading}>{!loading1 ? 'Proceed' : <CircularProgress color="inherit" />}</button>
            </form>
          </div>
          </div>
        </div>
      </div>
      {/* <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center my-[20px]">
          <div className="flex justify-between space-x-4 mb-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Help</a>
          </div>
          <div className="flex justify-center space-x-4 md:space-x-8">
            <a href="#" >
              <img
                src={insta}
                alt=""
                className="h-8 w-8"
              />
            </a>
            <a href="#" >
              <img
                src={fb}
                alt=""
                className="h-8 w-8"
              />
            </a>
            <a href="#" >
              <img
                src={twitter}
                alt=""
                className="h-8 w-8"
              />
            </a>
          </div>
        </div>
      </footer> */}

    </div>
  )
}

export default UserCheckoutPage