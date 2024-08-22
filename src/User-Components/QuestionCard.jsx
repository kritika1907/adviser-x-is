import React, { useEffect, useRef, useState } from 'react';
// import { AiOutlineMenu } from 'react-icons/ai'; // Ensure you have react-icons installed
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import User from '../assets/User.png'


import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const QuestionCard = ({question}) => {


    const database = getDatabase(app);
    const auth= getAuth();

    const inputRef = useRef(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const navigate= useNavigate()



  const [showAnswers, setShowAnswers] = useState(false);
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [updated, setUpdated] = useState(false)
  const [tempAnswers, setTempAnswers] = useState([])

  const handleInputChange = (e) => {

    const userid = JSON.parse(localStorage.getItem('userid'));
    const adviserid = JSON.parse(localStorage.getItem('adviserid'));
    if (userid === null && adviserid === null) {
        navigate('/createaccount'); 
   
    } else {
      setIsDialogOpen(true); // Navigate to login page
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };





  async function getUserDetails(userId) {
    const adviserRef = ref(database, `advisers/${userId}`);
    const userRef = ref(database, `users/${userId}`);
    
    try {
      const adviserSnapshot = await get(adviserRef);
      if (adviserSnapshot.exists()) {
        return { details: adviserSnapshot.val(), type: 'adviser' };
      } else {
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          return { details: userSnapshot.val(), type: 'user' };
        } else {
          console.log('User not found');
          return { details: null, type: null };
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { details: null, type: null };
    }
  }

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

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

  const handleAnswerSubmit = async(questionid) =>{

        if(answer == '')
        {
            handleDialogClose()
            return
        }
      
    try {

        const userid = JSON.parse(localStorage.getItem('userid'));
        const adviserid = JSON.parse(localStorage.getItem('adviserid'));


        if(userid === null && adviserid === null)
        {
            navigate('/createaccount')
            return
        }



      const questionData = await getQuestion(questionid);
      const currentAnswers = questionData.data.answers || [];
      let updatedAnswers = [...currentAnswers];
      const date = new Date().toString();

      let currentAnswer = null
      if(adviserid!= null)
      {
         currentAnswer = {
             answer: answer,
             userid: adviserid,
             upvote: [],
             doa:date,
           };
      }

      else{
         currentAnswer = {
             answer: answer,
             userid: userid,
             upvote: [],
           };
      }
      updatedAnswers.push(currentAnswer);
      await update(ref(database, 'questions/' + questionid), { answers: updatedAnswers });
         
    
      setTempAnswers(updatedAnswers)


      setAnswer('')
      handleDialogClose()
    
    } catch (error) {
      console.error('Error updating answers:', error);
    }

 
}


  useEffect (()=>{


async function getUserDetailsForAnswers(answers) {
  const userPromises = answers.map((answer) => {
    const userPromise = getUserDetails(answer.userid);
    return userPromise.then(user => ({
      ...answer,
      user: user.details,
      userType: user.type,
    }));
  });

  return Promise.all(userPromises);
}

getUserDetailsForAnswers(tempAnswers).then((response)=>{
    setAnswers(response)
})
  },[ tempAnswers])

  useEffect(()=>{
    if(question?.data?.answers)
        {
            setTempAnswers(question.data.answers)

        }
  },[question])

  return (
    <div className="max-w-[900px] w-[325px]  sm:w-[500px]  md:w-[600px] lg:w-[700px]  m-4 p-4 border rounded-xl font-Poppins">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={User}
            alt="User"
            className="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <h3 className="font-bold">{question && question.user?.username ? question.user.username : 'Certified User'}</h3>
            {/* <p className="text-sm text-gray-600">5h ago</p> */}
          </div>
        </div>

      </div>
      <p className="text-xs sm:text-md  md:text-lg mt-4 sm:mt-8">{question && question.data ? question.data.question :''}</p>
      <div className='flex my-4 justify-end'>
      <button
          className="text-gray-700 flex items-center underline"
          onClick={toggleAnswers}
        >
          {showAnswers ?  <div className='text-2xl md:text-3xl lg:text-4xl text-black'>
            <ArrowDropUpIcon fontSize='inherit' />
          </div> : <div className='text-xs sm:text-md  md:text-lg'>
          {answers.length} Answers
          </div> }
        </button>
      </div>
      {showAnswers && (
        <div className="space-y-4">
          {answers.map((item, index) => (
            <div key={index} className="flex items-start">
              <img
                src={item?.user?.profile_photo ? item.user.profile_photo  : User}
                alt=''
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-md  md:text-lg">{item?.user?.username ? item.user.username  : 'Certified User'}</h4>
                {/* <p className="text-sm text-gray-600">{answer.time}</p> */}
                <p className="mt-2 text-xs sm:text-md  md:text-lg">{item?.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center mt-4">
        <div className='relative w-full'>
        <input
         ref={inputRef}
          type="text"
          value={answer}
        //   onChange={(e)=>setAnswer(e.target.value)}
        onChange={handleInputChange}
          placeholder="Type..."
          className=" flex-grow p-2 border bg-gray-300 focus:outline-none rounded-full px-4 w-full  text-xs sm:text-sm md:text-md"
        />
                    {/* {answer && (
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-blue-500"  onClick={()=>handleAnswerSubmit(question.id)}>
                Post
              </button>
            )} */}
            </div>
        <button className="bg-gray-300 p-2 rounded-full mx-2">
          <ThumbUpOffAltIcon />
        </button>
      </div>


      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth={true} className='font-Poppins'>
        <DialogTitle>
          <p className='text-sm sm:text-md md:text-lg font-semibold '>Write Your Answer </p>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
            className="w-full p-2 border bg-gray-100 rounded-md text-xs sm:text-sm md:text-md"
            placeholder="Type your answer here..."
          />
           
              <button className=" bg-blue-500 text-white w-full px-4 py-2 rounded-full cursor-pointer"  onClick={()=>handleAnswerSubmit(question.id)}  >
                Post
              </button>
        
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions> */}
      </Dialog>
    

    </div>
  );
};

const answers = [
  {
    name: 'Kristin Watson',
    time: '1s ago',
    text: 'To create designs that prioritize the needs, preferences, and behaviors of the end-users, ensuring the final product is intuitive and satisfying to use.',
    avatar: 'https://via.placeholder.com/50'
  },
  {
    name: 'Wade Warren',
    time: '3h ago',
    text: 'Focuses on the needs, preferences, and limitations of end users at every stage of the design process.',
    avatar: 'https://via.placeholder.com/50'
  },
  {
    name: 'Jerome Bell',
    time: '5h ago',
    text: 'Provides users with clear, immediate responses to their actions, helping them understand the results of their interactions.',
    avatar: 'https://via.placeholder.com/50'
  },
];

export default QuestionCard;
