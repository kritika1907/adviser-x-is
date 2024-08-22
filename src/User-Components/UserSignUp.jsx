import { useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { CircularProgress, TextField } from '@mui/material'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { v1 as uuidv1 } from 'uuid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function UserSignUp() {

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
  }

  const validationSchema = Yup.object().shape({
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
  });


  const onCapchaVerify = () => {
    setLoading(true)
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        setLoading(false)
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': () => {
        setLoading(false)
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
  }


  const sendOTP = async () => {
    onCapchaVerify();
    setLoading(true);

    const phoneNumber = "+91" + formik.values.mobile_number;
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // alert("OTP has been sent")
      await Swal.fire({
        title: "Success",
        text: "OTP Sent Successfully!!",
        icon: "success"
      });
      setOtpSent(true);
    } catch (error) {
      // Error; SMS not sent
      // console.error("Error in sending OTP:", error);
      await Swal.fire({
        title: "Error",
        text: "Something Went Wrong!!",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  }


  const verifyOTP = async () => {
    setLoading(true);
    const code = otp;

    try {
      const result = await window.confirmationResult.confirm(code);
      // User signed in successfully.
      const user = result.user;
      await Swal.fire({
        title: "Success",
        text: "Verification done!",
        icon: "success"
      });
      setVerified(true);
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

  const handleSubmit = async () => {
    setLoading(true)
    const userid = uuidv1();

    await set(ref(database, 'users/' + userid), {
      mobile_number: formik.values.mobile_number,

    });

    // alert('SignUp Successfully !!')
    await Swal.fire({
      title: "Success",
      text: "SignUp Successfully!!",
      icon: "success"
    });
    localStorage.setItem("userid",JSON.stringify(userid))
    setLoading(false)
    navigate('/category')
    

  }

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
                    SignUp
                  </DialogTitle>
                  <div className="mt-2">
                    <form className='flex flex-col'>
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

                      {
                        (!verified && !otpSent) && <div id="recaptcha-container" style={{ width: "100%", marginTop: "10px", }} className='sm:mt-4'></div>
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
                        className=' text-white font-workSans w-[360px] sm:w-[380px] rounded-xl'
                        style={{ margin: "0 auto", marginTop: "5px", height: "50px", backgroundColor: "#489CFF" }}
                      >
                        {!loading ? 'Verify' : <CircularProgress color="inherit" />}
                      </Button>}

                      {(otpSent && verified) && <Button
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
                        {!loading ? 'SignUp' : <CircularProgress color="inherit" />}
                      </Button>}




                    </form>
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
