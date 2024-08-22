import React, { useState } from 'react'
import background2 from '../assets/background2.png'
import image3 from '../assets/image3.png'
import logo from '../assets/logo.png'
import image4 from '../assets/image4.png'
import { Autocomplete, Button, Checkbox, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'



function BankDetails() {

  const database = getDatabase(app);
  const auth= getAuth();
  const [loading, setLoading] = useState(false)

  const initialValues = {
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
  }


  const validationSchema = Yup.object().shape({
    bank_name: Yup.string()
      .required('Bank name is required')
      .min(3, 'Bank name must be at least 3 characters long')
      .max(50, 'Bank name must be at most 50 characters long'),
    account_holder_name: Yup.string()
      .required('Account holder name is required')
      .min(3, 'Account holder name must be at least 3 characters long')
      .max(50, 'Account holder name must be at most 50 characters long'),
    account_number: Yup.string()
      .required('Account number is required')
      .matches(/^[0-9]{9,18}$/, 'Account number must be between 9 to 18 digits'),
    ifsc_code: Yup.string()
      .required('IFSC code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code must be valid and follow the format XXXX0YYYYYY'),
    branch_name: Yup.string()
      .required('Branch name is required')
      .min(3, 'Branch name must be at least 3 characters long')
      .max(50, 'Branch name must be at most 50 characters long'),
  });

  const handleSubmit =  async () => {
     setLoading(true)
    const userid = JSON.parse(localStorage.getItem('adviserid'))

   await update(ref(database, 'advisers/' + userid),{
      bank_name:formik.values.bank_name,
      account_holder_name:formik.values.account_holder_name,
      account_number:formik.values.account_number,
      ifsc_code:formik.values.ifsc_code,
      branch_name:formik.values.branch_name

    });

    // alert('Your data saved successfully!!');
    // await Swal.fire({
    //   title: "Success",
    //   text: "Your Data Saved Successfully!!",
    //   icon: "success"
    // });

    formik.resetForm();
     setLoading(false);
    navigate('/adviser/documentupload')
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })



  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col  md:flex-row-reverse'>
      <div className='hidden w-full md:w-3/6 bg-cover sm:flex justify-center items-center ' style={{ backgroundImage: `url(${background2})` }} >
        <img className="object-contain h-auto max-w-full" style={{ paddingTop: "80px" }} src={image4} alt="" />
      </div>
      <div className='min-h-screen w-full md:w-3/6 flex flex-col items-center'>
        <div className='flex items-center justify-center' style={{ marginTop: "40px" }}>
          <img className="object-cover" src={logo} alt="" />
        </div>

        <div className="relative z-10 w-full max-w-md p-8 ">
          <p className='font-workSans text-md mt-4  text-[#489CFF]' style={{ marginTop: "20px", marginBottom: "20px" }}>BANK DETAILS
          </p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-workSans">Bank Name:</label>
              <input
                name="bank_name"
                value={formik.values.bank_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="RBI"
              />
              {formik.touched.bank_name &&
                formik.errors.bank_name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.bank_name}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-workSans">Account Holder Name:</label>
              <input
                name="account_holder_name"
                type="text"
                value={formik.values.account_holder_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="Amit Kumar"
              />
              {formik.touched.account_holder_name &&
                formik.errors.account_holder_name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.account_holder_name}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-workSans">Account Number:</label>
              <input
                name="account_number"
                value={formik.values.account_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="C9876543"
              />
              {formik.touched.account_number &&
                formik.errors.account_number && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.account_number}
                  </p>
                )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-workSans">IFSC Code:</label>
              <input
                name="ifsc_code"
                type="text"
                value={formik.values.ifsc_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="RBI23141"
              />
              {formik.touched.ifsc_code &&
                formik.errors.ifsc_code && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.ifsc_code}
                  </p>
                )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-workSans">Branch Name:</label>
              <input
                name="branch_name"
                type="text"
                value={formik.values.branch_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="Khalid Bin Waleed Road, Al Hamriya, Bur Dubai"
              />
              {formik.touched.branch_name &&
                formik.errors.branch_name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.branch_name}
                  </p>
                )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-[50px] font-workSans"
              // onClick={()=> navigate('/documentupload')}
              onClick={formik.handleSubmit}
            >
              { !loading ? 'Next' : <CircularProgress  color="inherit"  />}
            </button>
            <button
              // type="submit"
              className="w-full py-2 mt-4 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-[50px] font-workSans"
              onClick={()=> navigate('/adviser/documentupload')}
            >
              Skip
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default BankDetails