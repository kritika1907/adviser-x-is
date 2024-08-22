import { useEffect, useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { v1 as uuidv1 } from 'uuid';
import Swal from 'sweetalert2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function Login() {

  const navigate = useNavigate()

  const auth = getAuth(app);
  const database = getDatabase(app);

  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const initialValues = {
    email: '',
    password:''
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const comparePassword = async (password, hash) => {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      console.error("Error comparing password:", error);
    }
  };


  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     // Search for user by email
  //     const snapshot = await get(child(ref(database), `advisers`));
  //     if (snapshot.exists()) {
  //       let userFound = false;
  //       snapshot.forEach((childSnapshot) => {
  //         const userData = childSnapshot.val();
  //         if (userData.email === formik.values.email) {
  //           userFound = true;
  //           // Compare the provided password with the stored password

  //           const isMatch =  comparePassword(formik.values.password, userData.password)
  //           if (isMatch) {
  //             setLoading(false);
          
  //             // Save the user's ID in local storage
  //             localStorage.setItem('adviserid',  JSON.stringify(childSnapshot.key));
  //             formik.resetForm();
  //             navigate('/adviser/dashboard');
  //             // You can redirect the user or do something else here
  //           } else {
  //             Swal.fire({
  //               title: "Error",
  //               text: "Invalid Email or Password!!",
  //               icon: "error"
  //             });
  //             setLoading(false);
  //             formik.resetForm();
  //           }
  //         }
  //       });
  
  //       if (!userFound) {
  //         Swal.fire({
  //           title: "Error",
  //           text: "User not found",
  //           icon: "error"
  //         });
  //         setLoading(false);
  //         formik.resetForm();
  //       }
  //     } else {
  //       Swal.fire({
  //         title: "Error",
  //         text: "No data available",
  //         icon: "error"
  //       });
  //       setLoading(false);
  //       formik.resetForm();
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "An error occurred while fetching user data",
  //       icon: "error"
  //     });
  //     setLoading(false);
  //     formik.resetForm();
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Search for user by email
      const snapshot = await get(child(ref(database), `advisers`));
      if (snapshot.exists()) {
        let userFound = false;
        const childSnapshots = [];
        snapshot.forEach((childSnapshot) => {
          childSnapshots.push(childSnapshot);
        });

  
        for (const childSnapshot of childSnapshots) {
          const userData = childSnapshot.val();
        
          if (userData.email === formik.values.email) {

            console.log("userData", userData)
            userFound = true;
            // Compare the provided password with the stored password
            const isMatch = await comparePassword(formik.values.password, userData.password);
            if (isMatch) {
              setLoading(false);
  
              // Save the user's ID in local storage
              localStorage.setItem('adviserid', JSON.stringify(childSnapshot.key));
              formik.resetForm();
              navigate('/adviser/dashboard');
              // You can redirect the user or do something else here
              return;
            } else {
              console.log("bye")
              Swal.fire({
                title: "Error",
                text: "Invalid Email or Password!!",
                icon: "error"
              });
              setLoading(false);
              formik.resetForm();
              return;
            }
          }
        }
  
        if (!userFound) {
          Swal.fire({
            title: "Error",
            text: "User Not Found",
            icon: "error"
          });
          setLoading(false);
          formik.resetForm();
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No Data Available",
          icon: "error"
        });
        setLoading(false);
        formik.resetForm();
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error"
      });
      setLoading(false);
    }
  };


  useEffect(()=>{
        if(open === false)
          {
            navigate('/adviser')
          }
  },[open])
  
  

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white flex justify-center items-center p-4 py-[30px] md:py-[50px]">
              <div className="sm:flex sm:items-center">

                <div className="mt-3 text-center sm:ml-4 p-4  py-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className=" text-center text-xl font-semibold leading-6 text-gray-900 ">
                    Login
                  </DialogTitle>
                  <div className="mt-2">
                    <form className='flex flex-col'>
                  <p className='mt-4 text-center'>Don't have account?  <span className='text-blue-500'><Link to='/adviser/signup'>SignUp Here</Link></span></p>

<TextField
              name='email'
              id="outlined-basic"
              type="text"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[300px] sm:w-[380px]'
            />


<TextField
              name='password'
              id="outlined-basic"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[300px] sm:w-[380px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

<Button
                        variant="contained"
                        // color="secondary"
                        aria-label="Register"
                        margin="normal"
                        onClick={formik.handleSubmit}
                        size="large"
                        className=' text-white font-workSans w-[300px] sm:w-[380px] rounded-xl'
                        style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
                      >
                        {!loading ? 'Login' : <CircularProgress color="inherit" />}
                      </Button>
                    </form>
                    <p className='my-4 text-center cursor-pointer'> <span className='text-blue-500'><Link to='/adviser/changepassword'>Forgot Password</Link></span></p>
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
