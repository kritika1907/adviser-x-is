import React, { useState } from 'react'
import background2 from '../assets/background2.png'
import image3 from '../assets/image3.png'
import logo from '../assets/logo.png'
import background3 from '../assets/background3.png'
import { Autocomplete, Button, Checkbox, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'



function ProfessionalDetails() {

  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

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
    professional_title: '',
    experience: '',
    education: '',
    industry: '',
    professional_bio: '',
  }

  const validationSchema = Yup.object().shape({
    professional_title: Yup.string()
      .required('Professional title is required')
      .min(2, 'Professional title must be at least 2 characters')
      .max(50, 'Professional title must be at most 50 characters'),
    experience: Yup.number()
      .required('Experience is required')
      .typeError('Experience must be a number')
      .positive('Experience must be a positive number')
      .integer('Experience must be an integer')
      .min(0, 'Experience must be at least 0 years')
      .max(50, 'Experience must be at most 50 years'),
    education: Yup.string()
      .required('Education is required'),
    industry: Yup.string()
      .required('Category is required'),
    professional_bio: Yup.string()
      .required('Professional bio is required')
      .min(10, 'Professional bio must be at least 10 characters')
      .max(1000, 'Professional bio must be at most 1000 characters'),
  });

  const handleSubmit = async () => {
     setLoading(true)
    const userid = JSON.parse(localStorage.getItem('adviserid'))

   await update(ref(database, 'advisers/' + userid),{
      professional_title:formik.values.professional_title,
      years_of_experience:formik.values.experience,
      education:formik.values.education,
      industry:formik.values.industry,
      professional_bio:formik.values.professional_bio

    });

    // alert('Your data saved successfully!!');
    // await Swal.fire({
    //   title: "Success",
    //   text: "Your Data Saved Successfully!!",
    //   icon: "success"
    // });
       setLoading(false)
    formik.resetForm();

    navigate('/adviser/bankdetails')

  }


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div
        className="hidden sm:block absolute top-0 right-0 w-full h-full bg-no-repeat bg-right-top"
        style={{ backgroundImage: `url(${background3})`, backgroundSize: '60% auto' }}
      ></div>
      <div className='min-h-screen w-full md:w-3/6 flex flex-col items-center mt-[60px] sm:mt-[40px] '>
        <div className='flex items-center justify-center' >
          <img className="object-cover" src={logo} alt="" />
        </div>

        <div className="relative z-10 w-full max-w-md p-8  ">
          {/* <h2 className="text-2xl font-bold mb-6 text-center">PROFESSIONAL INFORMATION</h2> */}
          <p className='font-workSans text-md mt-4  text-[#489CFF] mb-[10px] sm:mb-[20px]  md:mt-[10px] ' >PROFESSIONAL INFORMATION
          </p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-workSans">Professional Title:</label>
              <input
                name="professional_title"
                value={formik.values.professional_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
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
              <label className="block text-gray-700 font-workSans">Year of Experience:</label>
              <input
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
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
              <label className="block text-gray-700 font-workSans">Education:</label>
              <select className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans" name="education"
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
              <label className="block text-gray-700 font-workSans">Category:</label>
              <select className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans" name="industry"
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
            <div className="mb-6">
              <label className="block text-gray-700 font-workSans">Professional BIO:</label>
              <textarea
                name="professional_bio"
                value={formik.values.professional_bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md font-workSans"
                placeholder="This will be displayed everywhere"
              ></textarea>
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-workSans h-[50px]"
              // onClick={()=> navigate('/bankdetails')}
              onClick={formik.handleSubmit}
            >
              { !loading ? 'Next' : <CircularProgress  color="inherit"  />}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default ProfessionalDetails;