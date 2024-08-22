import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, EmailIcon } from 'react-share';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const QuestionModel = ({ open, handleClose }) => {

    const database = getDatabase(app);
    const auth= getAuth();

    const initialValues = {
        question: ''
    }

    const validationSchema = Yup.object().shape({

        question: Yup.string()
            .required('Question is required')
            .max(250, 'Question can not have more than 250 character'),
    });

    const handleSubmit = async () => {
        const userid = JSON.parse(localStorage.getItem('userid'));
     
        

        const date = new Date().toString();


        const questionid = uuidv1();

        await set(ref(database, 'questions/' + questionid), {
            userid: userid,
            question: formik.values.question,
            doq: date,
        });


        formik.resetForm();
        handleClose()

    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    })

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true} className='font-Poppins'>
      <DialogTitle>
        Ask a question
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
             
      <form onSubmit={formik.handleSubmit}>

                    <textarea
                        id="question"
                        name="question"
                        value={formik.values.question}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows="3"
                        placeholder="Type your question here..."
                    />
                    {formik.touched.question &&
                        formik.errors.question && (
                            <p
                                style={{
                                    fontSize: "13px",
                                    padding: "",
                                    color: "red",
                                }}
                            >
                                {formik.errors.question}
                            </p>
                        )}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500  text-white  py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </form>


            </DialogContent>
      {/* <DialogActions>
        <button onClick={handleClose}>Close</button>
      </DialogActions> */}
    </Dialog>
  );
};

export default QuestionModel;
