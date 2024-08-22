import React, { useEffect, useState } from 'react'
import background2 from '../assets/background2.png'
import image3 from '../assets/image3.png'
import logo from '../assets/logo.png'
import { Autocomplete, Button, Checkbox, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Swal from 'sweetalert2'
import bcrypt from 'bcryptjs';
import { getAuth } from 'firebase/auth'






const country = ['India', 'USA', 'Russia']
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir"
];


function SignUp() {
  const database = getDatabase(app);
  const auth= getAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [ loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const initialValues = {
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    // country: '',
    state: '',
    check: false

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


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters long')
      .required('Name is required')
      .matches(/^[^/]*$/, 'Name must not contain "/"'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
      .required('Email is required'),
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
    // country: Yup.string()
    //   .required('Country is required'),
    state: Yup.string()
      .required('State is required'),
    check: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required('Checkbox is required'),
  });


  const isUserExist = async () =>{
    let userFound = false;
    try {
      // Search for user by email
      const snapshot = await get(child(ref(database), `advisers`));
      if (snapshot.exists()) {
    
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.email === formik.values.email) {
            userFound = true;
            Swal.fire({
              title: "Error",
              text: "Adviser with this email already exist!!",
              icon: "error"
            });
          }
          else if( userData.mobile_number === formik.values.mobile_number)
            {
              userFound = true;
              Swal.fire({
                title: "Error",
                text: "Adviser with this mobile number already exist!!",
                icon: "error"
              });
            }
        });
      } 
    } catch (error) {
     await Swal.fire({
        title: "Error",
        text: "Something Went Wrong!!",
        icon: "error"
      });
    }

    return userFound
  }


  const handleSubmit = async() => {
     setLoading(true)
     

     const hashedPassword = await hashPassword(formik.values.password)
     const isUser = await isUserExist()

     if(isUser)
      {
        // await Swal.fire({
        //   title: "Error",
        //   text: "User alredy exist with this email or mobile number",
        //   icon: "error"
        // });
        setLoading(false)
        return
      }

    const userid = uuidv1();
    const date = new Date().toString();

   await set(ref(database, 'advisers/' + userid), {
      username: formik.values.name,
      email: formik.values.email,
      mobile_number: formik.values.mobile_number,
      password: hashedPassword,
      // country: formik.values.country,
      state: formik.values.state,
      created_at:date
    });

   
   localStorage.setItem("adviserid",JSON.stringify(userid))
    // alert("Your data saved successfully.")
    // await Swal.fire({
    //   title: "Success",
    //   text: "Your Data Saved Successfullly!!",
    //   icon: "success"
    // });
    setLoading(true)
    formik.resetForm()
    navigate('/adviser/emailconfirmation',{
      state:{
        adviserid:userid
      }
    })



  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })



  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='hidden  w-full md:w-3/6 bg-cover sm:flex justify-center items-center ' style={{ backgroundImage: `url(${background2})` }} >
        <img className="object-contain h-auto max-w-full" style={{ paddingTop: "80px" }} src={image3} alt="" />
      </div>
      <div className='min-h-screen w-full md:w-3/6 flex flex-col items-center'>
        <div className='flex items-center justify-center' style={{ marginTop: "70px" }}>
          <img className="object-cover" src={logo} alt="" />
        </div>

        <div style={{ marginTop: "30px" }}>
          <p className='font-workSans text-3xl font-bold text-center'>Create Account</p>
          <p className='font-workSans text-md mt-4 text-center text-[#03014C]'>Follow the instructions to make it easier to<br /> register and you will be able to explore inside.
          </p>
        </div>

        <div style={{ marginTop: "15px" }}>
          <form className='flex flex-col mb-[100px] items-center '>

            <TextField
              name='name'
              id="outlined-basic"
              type="text"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[340px] sm:w-[380px]'
            />

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
              className=' font-workSans w-[340px] sm:w-[380px]'
            />

            <TextField
              name='mobile_number'
              id="outlined-basic"
              label="Phone number"
              type="number"
              value={formik.values.mobile_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
              helperText={formik.touched.mobile_number && formik.errors.mobile_number}
              variant="outlined"
              margin="dense"
              className=' font-workSans w-[340px] sm:w-[380px]'
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
            />



            {/* <Autocomplete
              options={country}
              value={formik.values.country}
              onChange={(event, newValue) => {
                formik.setFieldValue("country", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin='dense'
                  label="Country"
                  name="country"
                  className=' font-workSans w-[340px] sm:w-[380px]'
                  variant="outlined"
                  required
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                />
              )}
            /> */}
            <Autocomplete
              options={states}
              value={formik.values.state}
              className=' font-workSans w-[340px] sm:w-[380px]'
              onChange={(event, newValue) => {
                formik.setFieldValue("state", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin='dense'
                  label="State"
                  name="state"
                  className=' font-workSans w-[340px] sm:w-[380px]'
                  variant="outlined"
                  required
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.state && Boolean(formik.errors.state)
                  }
                  helperText={formik.touched.state && formik.errors.state}
                />
              )}
            />
            <div>
              <div className='flex'>
                <Checkbox
                  name='check'
                  value={formik.values.check}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.check && Boolean(formik.errors.check)}
                  helperText={formik.touched.check && formik.errors.check} /> <p className='font-workSans text-md pt-2'>I Agree all <span className='text-[#489CFF]'>Term&Conditions</span></p>
              </div>
              {formik.touched.check &&
                formik.errors.check && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.check}
                  </p>
                )}
            </div>
            <Button
              variant="contained"
              // color="secondary"
              aria-label="Register"
              type="submit"
              margin="normal"
              onClick={formik.handleSubmit}
              // onClick={()=>navigate('/emailconfirmation') }
              size="large"
              disabled={loading}
              className='bg-[#F6F6F6] font-workSans w-[340px] sm:w-[380px]'
              style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
            >
                { !loading ? 'Create Account' : <CircularProgress  color="inherit"  />}
            </Button>
          </form>
        </div>
      </div>
       
  
    </div>
  )
}

export default SignUp