import React, { useEffect, useState } from 'react'
import background2 from '../assets/background2.png'
import image3 from '../assets/image3.png'
import logo from '../assets/logo.png'
import { Autocomplete, Button, Checkbox, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import bcrypt from 'bcryptjs';
import { getAuth } from 'firebase/auth'



function ChangePassword() {
  const database = getDatabase(app);
  const auth= getAuth();
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adviserId, setAdviserId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  let userid = null

  const initialValues = {
    email: '',
    password: '',
    confirm_password:''
  }

  const validationSchema = Yup.object().shape({

    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
      .required('Email is required'),
      password: Yup.string()
      .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),

  });

  const isUserExist = async () => {
    try {
      const snapshot = await get(child(ref(database), 'advisers'));
      if (snapshot.exists()) {
        let userId = null;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.email === formik.values.email) {
            userId = childSnapshot.key; // Retrieve the Firebase node ID
            return true; // Exit forEach loop early if user is found
          }
        });
        return userId; // Return node ID if user exists, otherwise null
      } else {
        return null; // Return null if no advisers node exists
      }
    } catch (error) {
      console.log('Error:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Something Went Wrong!!',
        icon: 'error'
      });
      return null; // Return null on error
    }
  };


  const sendOTP = async () => {
    setOtpSent(false)
    try {
      // setLoading(true);
      const res = await fetch(`https://adviserxiis-backend-three.vercel.app/sendemail/${userId}`);
      if (res.status === 200) {
        // await Swal.fire({
        //   title: "Success",
        //   text: "OTP Sent Successfully!!",
        //   icon: "success"
        // });


        setOtpSent(true);
      } else {
        await Swal.fire({
          title: "Error",
          text: "Failed to send OTP.",
          icon: "error"
        });
      }
    } catch (error) {
      console.log("error", error)
      await Swal.fire({
        title: "Error",
        text: "Something went wrong!!",
        icon: "error"
      });
    } finally {
      // setLoading(false);
    }
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

  const verifyOTP = async () => {
    setLoading(true)
    console.log("userid", adviserId)
    const user = await getUser(adviserId);

    if (otp == user.change_password_otp) {
      setVerified(true)
      // await Swal.fire({
      //   title: "Success",
      //   text: "OTP Verified Successfully!!",
      //   icon: "success"
      // });
      setOtp('')
      setLoading(false)
    }

    else {
      await Swal.fire({
        title: "Error",
        text: "Wrong OTP!!",
        icon: "error"
      });
      setLoading(false)
    }

  }

  const handleSubmit = async () => {
    setLoading(true)
    userid = await isUserExist()
    setAdviserId(userid)
    if (userid != null) {
      try {
        const res = await fetch(`https://adviserxiis-backend-three.vercel.app/changepassword/${userid}`);
        if (res.status === 200) {
          await Swal.fire({
            title: "Success",
            text: "OTP has been sent to your email.",
            icon: "success"
          });
          setOtpSent(true);
        } else {
          await Swal.fire({
            title: "Error",
            text: "Failed to send OTP.",
            icon: "error"
          });
        }
      } catch (error) {
        console.log("error", error)
        await Swal.fire({
          title: "Error",
          text: "Something went wrong!!",
          icon: "error"
        });
      }finally{
        setLoading(false)
      }
    }
    else {
      Swal.fire({
        title: "Error",
        text: "Adviser does not exist with this email!!",
        icon: "error"
      });
      setLoading(false)
    }

  }

  const hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  };


  const savePassword = async () =>{
    if(formik.values.password.length < 6)
    {
      await Swal.fire({
        title: "Error",
        text: "Password must be at least 6 characters long",
        icon: "error"
      });
       return
    }

    if(formik.values.password !== formik.values.confirm_password)
    {
      await Swal.fire({
        title: "Error",
        text: "Password and Confirm Password doesn't match!!",
        icon: "error"
      });
       return
    }
       setLoading(true)
       const hashedPassword = await hashPassword(formik.values.password)
    await update(ref(database, 'advisers/' + adviserId),{
      password: hashedPassword,
    });

          await Swal.fire({
        title: "Success",
        text: "Password Changed Successfully!!",
        icon: "success"
      });
      navigate('/adviser/login')
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })




  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className=' w-full md:w-3/6 bg-cover flex justify-center items-center ' style={{ backgroundImage: `url(${background2})` }} >
        <img className="object-contain h-auto max-w-full" style={{ paddingTop: "80px" }} src={image3} alt="" />
      </div>
      <div className='min-h-screen w-full md:w-3/6 flex flex-col items-center'>
        <div className='flex items-center justify-center' style={{ marginTop: "70px" }}>
          <img className="object-cover" src={logo} alt="" />
        </div>

        <div style={{ marginTop: "60px" }}>
          <p className='font-workSans text-3xl font-bold text-center'>Change Password</p>
          <p className='font-workSans text-md mt-4 text-center text-[#03014C]' style={{ marginTop: "50px" }}>Enter your email address to get the OTP
          </p>



        </div>

        <div className='flex flex-col' style={{ marginTop: "30px" }}>

          <form className='flex flex-col mb-[100px] items-center '>


          {
            !verified &&              <TextField
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
            className=' font-workSans w-[340px] sm:w-[380px]'
          />
          }


            { !verified && otpSent && 
              <TextField
                name='OTP'
                id="outlined-basic"
                type="number"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
                margin="dense"
                className=' font-workSans w-[340px] sm:w-[380px]'
              />}

{verified && <TextField
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
              className=' font-workSans w-[340px] sm:w-[380px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> }

{verified && <TextField
              name='confirm_password'
              id="outlined-basic"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.touched.confirm_password && formik.errors.confirm_password}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[340px] sm:w-[380px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> }






              {!verified &&  otpSent &&           <Button variant="contained"
            aria-label="Register"
            margin="normal"
            type="button"
            onClick={verifyOTP}
            size="large"
            className='bg-[#F6F6F6] font-workSans w-[340px] sm:w-[380px]'
            style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
          >
            {!loading ? 'Verify' : <CircularProgress color="inherit" />}
          </Button> }

     { !verified &&  !otpSent &&  <Button
              variant="contained"
              aria-label="Register"
              type="submit"
              margin="normal"
              onClick={formik.handleSubmit}
              size="large"
              className='bg-[#F6F6F6] font-workSans w-[340px] sm:w-[380px]'
              style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
            >
              {!loading ? 'Send OTP' : <CircularProgress color="inherit" />}
            </Button>}

            { verified  &&  <Button
              variant="contained"
              aria-label="Register"
              type="button"
              margin="normal"
              onClick={savePassword}
              size="large"
              className='bg-[#F6F6F6] font-workSans w-[340px] sm:w-[380px]'
              style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
            >
              {!loading ? 'Change Password' : <CircularProgress color="inherit" />}
            </Button>}

          </form>






        </div>

      </div>

    </div>
  )
}

export default ChangePassword