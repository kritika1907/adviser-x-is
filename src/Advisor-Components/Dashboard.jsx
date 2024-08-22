import React, { useContext, useEffect, useState } from 'react'
import profile from '../assets/profile.png'
import { equalTo, get, getDatabase, orderByChild, query, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import User from '../assets/User.png'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import StateContext from '../Context/StateContext';
import { Button } from '@mui/base';
import { Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import AppointmentCard from './AppointmentCard';
import AdviserDashboardSkeleton from '../Skeletons/AdviserDashboardSkeleton';

function Dashboard() {
  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate()

  const { handleShareDialogOpen, setShareURL } = useContext(StateContext)

  function convertSpacesToUnderscores(inputString) {
    return inputString.replace(/\s+/g, '_');
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem('adviserid'));

  const [appointmentData, setAppointmantData] = useState([])
  const [lastAppointments, setLastAppointments] = useState([])
  const [upcommingAppoinment, setUpcommingAppointments] = useState([])

  const today = new Date();
  today.setHours(0, 0, 0, 0);



  function convertDateFormat(dateString) {
    // Split the input date string by the hyphen
    const [year, month, day] = dateString.split('-');

    // Return the date in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  }


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

  const fetchPaymentsByAdviserId = async (adviserId) => {
    const payments = [];
    const paymentsRef = ref(database, 'payments');

    try {
      const snapshot = await get(paymentsRef);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().adviserid == adviserId) {
            payments.push(childSnapshot.val());
          }

        });
      } else {
        console.log('No payments available');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }

    return payments;
  };

  const fetchUserById = async (userId) => {
    const userRef = ref(database, `users/${userId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val();

      } else {
        console.log(`No user available for user ID: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching user data for user ID: ${userId}`, error);
      return null;
    }
  };

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

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('adviserid')) == null) {
      Swal.fire({
        title: "Oops!!",
        text: "You need to be loggedin.",
        icon: "error"
      });
      navigate('/adviser')

    }
  }, [])

  useEffect(() => {

    if (userId) {
      getUser(userId).then((userData) => {
        setUser(userData);
        // if(!userData)
        //   {
        //     Swal.fire({
        //       title: "Oops!!",
        //       text: "You must be a loggedin.",
        //       icon: "error"
        //     });
        //         navigate('/adviser')
        //   }
        // if(userData && userData.isVerified != true)
        //   {
        //     Swal.fire({
        //       title: "Oops!!",
        //       text: "You must be a verified user.",
        //       icon: "error"
        //     });
        //         navigate('/adviser')
        //   }
        setLoading(false); // Update loading state after fetching the user data
      });
    } else {
      setLoading(false); // Update loading state even if there's no user ID in localStorage
    }
  }, []);


  useEffect(() => {
    fetchPaymentsByAdviserId(userId).then(async (payments) => {
      const enrichedPayments = await Promise.all(payments.map(async (payment) => {
        const userId = payment.userid;
        const serviceId = payment.serviceid;

        const [user, service] = await Promise.all([
          fetchUserById(userId),
          fetchServiceById(serviceId)
        ]);

        return {
          ...payment,
          user: user ? user : null,
          service: service ? service : null
        };
      }));
      setAppointmantData(enrichedPayments)
      const servicesBeforeToday = enrichedPayments.filter(service => {
        const serviceDate = new Date(service.scheduled_date);
        return serviceDate < today;
      });

      setLastAppointments(servicesBeforeToday)

      const servicesTodayAndAfter = enrichedPayments.filter(service => {
        const serviceDate = new Date(service.scheduled_date);
        return serviceDate >= today;
      });

      setUpcommingAppointments(servicesTodayAndAfter)
      // console.log("Enriched Payments:", enrichedPayments);
    }).catch((error) => {
      console.error('Error fetching enriched payments:', error);
    });



    // fetchUserById('9fd0c4b0-3472-11ef-bbcd-a108b1ffa824')
  }, [])



  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>;
   return <div>
     <AdviserDashboardSkeleton />
   </div> 

  }
  return (
    <div className='max-w-screen mb-[120px] md:mb-[80px] '>
      <div className='overflow-hidden'>
        <div className='pt-0 py-6 px-2 sm:p-6 space-y-6'>
          <p className='font-Poppins text-3xl md:text-4xl lg:text-5xl ml-2 font-bold s my-2'>Dashboard</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-between sm:p-6 space-y-6 max-w-full">

          <div className="flex flex-col justify-center  sm:justify-between  md:items-start w-full md:w-3/6  ">
            <div className="flex items-center space-x-4 w-full my-4 ml-4">

              <img
                src={user && user.profile_photo ? user.profile_photo : User}
                alt=""
                className="rounded-full w-24 h-24 sm:w-32 sm:h-32 lg:h-48 lg:w-48 object-cover"
              />
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-Poppins mb-[10px]">Welcome !!</h1>
                <p className="text-2xl md:text-2xl lg:text-3xl font-bold font-Poppins">{user && user.username ? user.username : 'User'}</p>
              </div>
            </div>

            <div className="mt-[30px]">
              <p className="text-xl lg:text-3xl font-Poppins ml-4 font-bold">Total Earning</p>
              <div className='bg-[#489CFF] text-white rounded-xl p-6 w-[320px] sm:w-[350px] md:w-[400px] m-4 '>
                <h2 className="text-4xl font-bold font-Poppins">₹ {user && user.earnings ? user.earnings : 0}</h2>
                <button className="mt-4 bg-white text-black rounded-[60px] py-2 px-[20px] font-Poppins">Request Withdraw</button>
              </div>
            </div>
          </div>







          <div className="  py-6   px-4  md:w-3/6 my-4 flex flex-col md:items-center">
            <div >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-Poppins">Upcoming Booking</h2>
              <div className="mt-4 space-y-4">
                {
                  upcommingAppoinment.length == 0 && <div className='text-md font-Poppins pl-2 rounded-xl shadow-lg py-2 '>
                    <p className='text-center '>No data available</p>
                  </div>
                }
                {upcommingAppoinment.length > 0 && upcommingAppoinment[0] &&
                  <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center text-sm md:text-lg lg:text-xl">
                    <div>
                      <p className='font-Poppins font-bold'>User Name : {upcommingAppoinment[0].user.username}</p>
                      <p className='font-Poppins'>Service Name : {upcommingAppoinment[0].service.service_name}</p>
                      <p className='font-Poppins'>Appointment Date : {convertDateFormat(upcommingAppoinment[0].scheduled_date)}</p>
                    </div>

                    <button className="bg-[#489CFF] text-white rounded-md py-2 px-4 font-Poppins md:w-24" onClick={() => navigate(`/room/${upcommingAppoinment[0].meetingid}`)}>Join</button>
                  </div>
                }
                {upcommingAppoinment.length > 0 && upcommingAppoinment[1] &&
                  <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center md:text-lg lg:text-xl">
                    <div>
                      <p className='font-Poppins font-bold'>User Name : {upcommingAppoinment[1].user.username}</p>
                      <p className='font-Poppins'>Service Name : {upcommingAppoinment[1].service.service_name}</p>
                      <p className='font-Poppins'>Appointment Date : {convertDateFormat(upcommingAppoinment[1].scheduled_date)}</p>
                    </div>

                    <button className="bg-[#489CFF] text-white rounded-md py-2 px-4 font-Poppins md:w-24" onClick={() => navigate(`/room/${upcommingAppoinment[0].meetingid}`)}>Join</button>
                  </div>
                }
              </div>
            </div>
          </div>



        </div>
      </div>
      {/* <div className="flex flex-col  mt-[50px] sm:mt-[0px] md:ml-4">
  <h2 className="text-xl md:text-2xl lg:text-3xl md:p-6 font-bold font-Poppins">Last Appointments</h2>
      <div className="flex-1 bg-white rounded-md shadow-lg md:p-6 ">

        <table className="min-w-full mt-4 text-center md:text-left font-Poppins overflow-x-auto">
          <thead className='text-[20px]'> 
            <tr>
              <th className="py-2 ">Purchase Date</th>
              <th className="py-2 ">Name</th>
              <th className="py-2">Service</th>
              <th className="py-2">Service date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Price</th>
            </tr>
          </thead>
          <tbody style={{fontSize:"20px"}}>
            { lastAppointments.length > 0 ?      lastAppointments.map((data, idx) => (
                           <tr>
                           <td className="py-2">{convertDateFormat(data.purchased_date)}</td>
                           <td className="py-2">{data.user.name}</td>
                           <td className="py-2">{data.service.service_name}</td>
                           <td className="py-2">{convertDateFormat(data.scheduled_date)}</td>
                           <td className="py-2">{data.scheduled_time}</td>
                           <td className="py-2">{data.service.price}</td>
                         </tr>
            )) : (
              <tr>
              <td className="py-2 text-center" colSpan="6">
                No data available
              </td>
            </tr>
            ) }



          </tbody>
        </table>
      </div>


    </div> */}
      <div className='hidden md:block font-Poppins overflow-x-auto ml-4 my-[20px] py-6 md:p-6 '>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-Poppins">Last Appointments</h2>
        <TableContainer component={Paper} className='mt-5 overflow-x-auto' >
          <Table sx={{ minWidth: 650, fontFamily: 'Poppins' }} aria-label="simple table">
            <TableHead style={{ fontSize: "20px" }}>
              <TableRow >
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Purchase Date</TableCell>
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Name</TableCell>
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Service</TableCell>
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Booking date</TableCell>
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Time</TableCell>
                <TableCell align="center" style={{ fontSize: "20px", fontWeight: "bold" }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lastAppointments.length > 0 ? lastAppointments.map((data, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center" style={{ fontSize: "20px" }}>
                    {convertDateFormat(data.purchased_date)}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "20px" }}>{data.user.username}</TableCell>
                  <TableCell align="center" style={{ fontSize: "20px", fontFamily: "" }} >{data.service.service_name}</TableCell>
                  <TableCell align="center" style={{ fontSize: "20px" }} >{convertDateFormat(data.scheduled_date)}</TableCell>
                  <TableCell align="center" style={{ fontSize: "20px" }}>{data.scheduled_time}</TableCell>
                  <TableCell align="center" style={{ fontSize: "20px" }}>{data.service.price}</TableCell>


                </TableRow>
              )) : <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={6} align="center" style={{ fontSize: "20px" }} >No data available</TableCell>


              </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className='md:hidden font-Poppins overflow-x-auto px-4 my-[20px] py-6 md:p-6 w-screen '>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-Poppins pb-2">Last Appointments</h2>
        {
                  lastAppointments.length == 0 && <div className='text-md font-Poppins pl-2 rounded-xl shadow-lg py-2 '>
                    <p className='text-center'>No data available</p>
                  </div>
                }
      {
       lastAppointments.length>0 && lastAppointments.map((data,idx)=>(
          <AppointmentCard key={idx} data={data}/>
        ))
      }
      </div>

      <button

        className="fixed bottom-[160px] md:bottom-[180px] right-[30px] md:right-[70px]  p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
        onClick={() => {
          handleShareDialogOpen()
          setShareURL(`https://www.adviserxiis.com/category/${convertSpacesToUnderscores(user?.username)}/${userId}`)
        }}
      >
        <ShareOutlinedIcon fontSize="large" />

      </button>

      <button>
        <a
          href='https://api.whatsapp.com/send/?phone=%2B917703874893&text&type=phone_number&app_absent=0'
          target="_blank"
          // rel="noopener noreferrer"
          className="fixed bottom-[80px] md:bottom-[100px] right-[30px] md:right-[70px]  p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition duration-300"
        >
          <WhatsAppIcon fontSize="large" />
        </a>
      </button>
    </div>
  )
}

export default Dashboard