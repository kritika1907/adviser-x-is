import { useEffect, useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { CircularProgress, TextField } from '@mui/material'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { v1 as uuidv1 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UserLogin() {

  const auth = getAuth(app);
  const database = getDatabase(app);
  const navigate = useNavigate()

  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const initialValues = {
    mobile_number: '',
    name:''
  }

  const validationSchema = Yup.object().shape({
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters long')
      .matches(/^[^/]*$/, 'Name must not contain "/"'),
  });


  const onCapchaVerify = () => {
    setLoading(false)

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }

    if (!window.recaptchaVerifier) {
       // Clear the existing verifier if any

       window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
          // setLoading(false)
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': () => {
          // setLoading(false)
          console.log("bii3")
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      });
    }


  
  }

  const sendOTP = async () => {
    // console.log("hii1");
      onCapchaVerify();
    
  
    // console.log("hii2")
    setLoading(true);

    setOtpSent(false)
    setVerified(false)

    const phoneNumber = "+91" + formik.values.mobile_number;
    const appVerifier = window.recaptchaVerifier;


    try {
      // console.log("hii3")
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      // alert("OTP has been sent")

      setOtpSent(true);
    } catch (error) {
      // Error; SMS not sent
      console.error("Error in sending OTP:", error);
      await Swal.fire({
        title: "Error",
        text: "Something Went Wrong!!",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  }






  // const verifyOTP =  async () =>{
  //   setLoading(true)
  //   const code = otp;
  //  await window.confirmationResult.confirm(code).then((result) => {
  // // User signed in successfully.
  // const user = result.user;
  // alert("verification done")
  // setVerified(true)
  // setLoading(false)
  // // ...
  // }).catch((error) => {
  // alert("invalid OTP")
  // setLoading(false)
  // // User couldn't sign in (bad verification code?)
  // // ...
  // });
  // }


  const verifyOTP = async () => {
    setLoading(true);
    const code = otp;

    try {
      const result = await window.confirmationResult.confirm(code);
      // User signed in successfully.
      const user = result.user;
      // await Swal.fire({
      //   title: "Success",
      //   text: "Verification done!",
      //   icon: "success"
      // });
      setVerified(true);
      handleSubmit()
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Invalid OTP",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  // const handleSubmit = async () => {
  //      setLoading(true)
  //   try {
  //     // Search for user by email
  //     const snapshot = await get(child(ref(database), `users`));
  //     if (snapshot.exists()) {
  //       snapshot.forEach((childSnapshot) => {
  //         const userData = childSnapshot.val();
  //         if (userData.mobile_number === formik.values.mobile_number) {
  //           console.log("hi")
  //           localStorage.setItem('userid',  JSON.stringify(childSnapshot.key));
  //           formik.resetForm();
  //           navigate('/category');
  //         }
  //         else{
  //           console.log("Hello")
  //            const userid = uuidv1();
  //            set(ref(database, 'users/' + userid), {
  //             mobile_number: formik.values.mobile_number,
  //           });
  //           localStorage.setItem("userid",JSON.stringify(userid))
  //           setLoading(false)
  //           formik.resetForm();
  //           navigate('/category')
  //         }
  //       });
  
  //     } else {
  //       console.log("bye")
  //       const userid = uuidv1();
  //       set(ref(database, 'users/' + userid), {
  //        mobile_number: formik.values.mobile_number,
  //      });
  //      localStorage.setItem("userid",JSON.stringify(userid))
  //      setLoading(false)
  //      formik.resetForm();
  //      navigate('/category')
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //     Swal.fire({
  //       title: "Error",
  //       text: "Something Went wrong!!",
  //       icon: "error"
  //     });
  //     setLoading(false);
  //     formik.resetForm();
  //   }

  //   // alert('Login Successfully !!')
 

  // }


  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Search for user by mobile number
      const snapshot = await get(child(ref(database), `users`));
      let userExists = false;
      const date = new Date().toString();
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.mobile_number === formik.values.mobile_number) {
            localStorage.setItem('userid', JSON.stringify(childSnapshot.key));
            const userid = childSnapshot.key
            if(formik.values.name !== '')
            {
            update(ref(database, 'users/' + userid), {
              username:formik.values.name
            });
          }

            userExists = true;
            return true; // Exit loop early
          }
        });
        
        if (!userExists) {
          const userid = uuidv1();
         
          if(formik.values.name !== '')
          {
          set(ref(database, 'users/' + userid), {
            mobile_number: formik.values.mobile_number,
            username:formik.values.name,
            created_at:date,
          });
        }
        else{
          set(ref(database, 'users/' + userid), {
            mobile_number: formik.values.mobile_number,
            created_at:date,
          });
        }
          localStorage.setItem("userid", JSON.stringify(userid));
        }
  
      } else {
        const userid = uuidv1();
        if(formik.values.name !== '')
          {
          set(ref(database, 'users/' + userid), {
            mobile_number: formik.values.mobile_number,
            username:formik.values.name,
            created_at:date,
          });
        }
        else{
          set(ref(database, 'users/' + userid), {
            mobile_number: formik.values.mobile_number,
            created_at:date,
          });
        }
        localStorage.setItem("userid", JSON.stringify(userid));
      }
      
      formik.resetForm();
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: "Something Went wrong!!",
        icon: "error",
      });
      setLoading(false);
      formik.resetForm();
    }
  };
  

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  useEffect(()=>{
    if(open === false)
      {
        navigate('/')
      }
},[open])

  return (
    <Dialog className="relative z-10 " open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto mb-[80px] sm:mb-0">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white flex justify-center items-center p-4 py-[30px] md:py-[50px]">
              <div className="sm:flex sm:items-center">

                <div className="mt-3 text-center sm:ml-4 p-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className=" text-center text-xl font-semibold leading-6 text-gray-900 ">
                    Login/SignUp
                  </DialogTitle>

                  {/* <p className='mt-4 text-center'>Don't have account?  <span className='text-blue-500'><Link to='/user/signup'>SignUp Here</Link></span></p> */}
                  <div className="mt-2">
                    <form className='flex flex-col'>
                      <TextField
                        name='mobile_number'
                        id="outlined-basic"
                        label="Whatsapp Number"
                        type="number"
                        value={formik.values.mobile_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
                        helperText={formik.touched.mobile_number && formik.errors.mobile_number}
                        variant="outlined"
                        margin="dense"
                        className=' font-workSans w-[300px] sm:w-[380px]'
                      />

                      {(otpSent && !verified) && <TextField
                        name='OTP'
                        id="outlined-basic"
                        type="number"
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        variant="outlined"
                        margin="dense"
                        className=' font-workSans w-[300px] sm:w-[380px]'
                      />}

<TextField
              name='name'
              id="outlined-basic"
              type="text"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[300px] sm:w-[380px]'
            />

                      {
                        (!verified && !otpSent) && <div id="sign-in-button"  style={{ width: "100%", marginTop: "10px", }} className='sm:mt-4 w-[300px] sm:w-[380px] hidden'></div>
                      }



                      {(!otpSent && !verified) && <Button
                        variant="contained"
                        // color="secondary"
                        aria-label="Register"
                        margin="normal"
                        onClick={sendOTP}
                        // onClick={()=>navigate('/emailconfirmation') }
                        size="large"
                        className=' text-white font-workSans w-[300px] sm:w-[380px] rounded-xl'
                        style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
                      >
                        {!loading ? 'Send OTP' : <CircularProgress color="inherit" />}
                      </Button>}





                      {(otpSent && !verified) && <Button
                        variant="contained"
                        // color="secondary"
                        aria-label="Register"
                        margin="normal"
                        onClick={verifyOTP}
                        // onClick={()=>navigate('/emailconfirmation') }
                        size="large"
                        className=' text-white font-workSans w-[300px] sm:w-[380px] rounded-xl'
                        style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
                      >
                        {!loading ? 'Verify' : <CircularProgress color="inherit" />}
                      </Button>}

                      {/* {(otpSent && verified) && <Button
                        variant="contained"
                        // color="secondary"
                        aria-label="Register"
                        margin="normal"
                        onClick={formik.handleSubmit}
                        // onClick={()=>navigate('/emailconfirmation') }
                        size="large"
                        className=' text-white font-workSans w-[300px] sm:w-[380px] rounded-xl'
                        style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
                      >
                        {!loading ? 'Create Account' : <CircularProgress color="inherit" />}
                      </Button>} */}




                    </form>
{/* 
                    <div className='pt-4'>
                      <p className='text-center cursor-pointer hover:underline' onClick={sendOTP}>Resend OTP</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
