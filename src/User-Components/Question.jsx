import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


 function  Question () {

    const database = getDatabase(app);
    // let user = firebase.auth().currentUser;

    const auth= getAuth();

    const navigate = useNavigate()


    const initialValues = {
        question: ''
    }

    const validationSchema = Yup.object().shape({

        question: Yup.string()
            .required('Question is required')
            .max(250, 'Question can nott have more than 250 character'),
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
        navigate('/')

    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    })

    async function getQuestion(questionid) {
        const nodeRef = ref(database, `questions/${questionid}`);
        try {
          const snapshot = await get(nodeRef);
          if (snapshot.exists()) {
            return ({data:snapshot.val(),id:snapshot.key});
          } else {
            console.log('No data available');
            return null;
          }
        } catch (error) {
          console.error('Error fetching node details:', error);
          return null;
        }
      }






    async function getAllQuestionsWithUserDetails() {
      const questionsRef = ref(database, 'questions');
      try {
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
          const posts = [];
          const userPromises = [];
          snapshot.forEach(childSnapshot => {
            const postData = { data: childSnapshot.val(), id: childSnapshot.key };
            posts.push(postData);
              
            console.log("postdata", postData.data.userid)
            // Get user details
            const userRef = ref(database, `users/${postData.data.userid}`);
            userPromises.push(get(userRef));
          });
          console.log("posts", posts)
    
          const userSnapshots = await Promise.all(userPromises);
          console.log("userSnap", userSnapshots)
    
          userSnapshots.forEach((userSnapshot, index) => {
            if (userSnapshot.exists()) {
              posts[index].user = userSnapshot.val();
            } else {
              posts[index].user = null;
            }
          });
    
          return posts;
        } else {
          console.log('No data available');
          return [];
        }
      } catch (error) {
        console.error('Error fetching node details:', error);
        return [];
      }
    }


    // useEffect(()=>{

    //     async function getAllQuestions() {
    //         const nodeRef = ref(database, 'questions');
    //         try {
    //           const snapshot = await get(nodeRef);
    //           if (snapshot.exists()) {
    //             const posts = [];
    //             snapshot.forEach(childSnapshot => {
    //               posts.push({ data: childSnapshot.val(), id: childSnapshot.key });
    //             });
    //             return posts;
    //           } else {
    //             console.log('No data available');
    //             return [];
    //           }
    //         } catch (error) {
    //           console.error('Error fetching node details:', error);
    //           return [];
    //         }
    //       }

    //       getAllQuestionsWithUserDetails().then((response)=>{
    //            console.log("response", response)
    //         setQuestions(response)
    //       })
    // },[])

    const handleAnswerSubmit = async(questionid) =>{


           console.log(questionid);

           try {
             // Fetch the current question data
             const questionData = await getQuestion(questionid);
             console.log("questionData", questionData);
         
             // Get the current user ID
             const user = getAuth().currentUser?.uid;
             console.log("user", user);
         
             // Get the current answers array or initialize it to an empty array if it doesn't exist
             const currentAnswers = questionData.data.answers || [];
             console.log("currentAn", currentAnswers)
             let updatedAnswers = [...currentAnswers];
             
             // Get user and adviser IDs from local storage
             const userid = JSON.parse(localStorage.getItem('userid'));
             const adviserid = JSON.parse(localStorage.getItem('adviserid'));
         
             // Create the new answer object

             let currentAnswer = null
             

             if(adviserid!= null)
             {
                currentAnswer = {
                    answer: answer,
                    userid: adviserid,
                    upvote: 0,
                  };
             }

             else{
                currentAnswer = {
                    answer: answer,
                    userid: userid,
                    upvote: 0,
                  };
             }
 
         
             // Append the new answer to the updated answers array
             updatedAnswers.push(currentAnswer);
         
             console.log(updatedAnswers);
         
             // Update the question with the new answers array
             await update(ref(database, 'questions/' + questionid), { answers: updatedAnswers });
           } catch (error) {
             console.error('Error updating answers:', error);
           }

        
    }

    useEffect(()=>{

      const userid = JSON.parse(localStorage.getItem('userid'));
      if(userid === null)
        {
            navigate('/createaccount')
            return
        }
    },[])
    return (
      
            <div className="max-w-[900px] w-[325px]  sm:w-[500px]  md:w-[600px] lg:w-[700px]  m-4 p-4  bg-white rounded-xl border ">
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="question" className="block text-gray-700 text-sm font-bold mb-2">
                        Ask a Question:
                    </label>
                    <textarea
                        id="question"
                        name="question"
                        value={formik.values.question}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows="4"
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
            </div>


          
        
    );
}

export default Question;
