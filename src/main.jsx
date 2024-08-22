import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './Advisor-Components/Login.jsx'
import SignUp from './Advisor-Components/SignUp.jsx'
import ConfirmEmail from './Advisor-Components/ConfirmEmail.jsx'
import ProfessionalDetails from './Advisor-Components/ProfessionalDetails.jsx'
import BankDetails from './Advisor-Components/BankDetails.jsx'
import UploadDocuments from './Advisor-Components/UploadDocuments.jsx'
import Services from './Advisor-Components/Services.jsx'
import Profile from './Advisor-Components/Profile.jsx'
import Logout from './Advisor-Components/Logout.jsx'
import Layout from './Layout.jsx'
import Dashboard from './Advisor-Components/Dashboard.jsx'
import ServiceForm from './Advisor-Components/ServiceForm.jsx'
import UserLandingPage from './User-Components/UserLandingPage.jsx'
import UserLayout from './UserLayout.jsx'
import UserCategory from './User-Components/UserCategory.jsx'
import UserAdviserProfile from './User-Components/UserAdvisorProfile.jsx'
import UserCheckoutPage from './User-Components/UserCheckoutPage.jsx'
import UserSignUp from './User-Components/UserSignUp.jsx'
import UserLogin from './User-Components/UserLogin.jsx'
import VideoCall from './Advisor-Components/VideoCall.jsx'
import { MeetingRoom } from '@mui/icons-material'
import Room from './Advisor-Components/Room.jsx'
import Payment from './Advisor-Components/Payment.jsx'
import CreatePost from './Advisor-Components/CreatePost.jsx'
import BookedServices from './User-Components/BookedServices.jsx'
import ChangePassword from './Advisor-Components/ChangePassword.jsx'
import Post from './User-Components/Post.jsx'
import CreatedPosts from './Advisor-Components/CreatedPosts.jsx'
import AdvisorProfile from './User-Components/AdviserProfile.jsx'
import Question from './User-Components/Question.jsx'
import Home from './Analytics/Home.jsx'
import AnalyticsLayout from './AnalyticsLayout.jsx'
import CreatorsData from './Analytics/CreatorsData.jsx'
import UsersData from './Analytics/UsersData.jsx'
import PostsData from './Analytics/PostsData.jsx'
import ShareAdvisorProfile from './User-Components/ShareAdviserProfile.jsx'
import VideoUpload from './Advisor-Components/VideoUpload.jsx'
import VideoPreview from './Advisor-Components/VideoPreview.jsx'
import PrivacyPolicy from './Privacy-Policy/PrivacyPolicy.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <>

<Route path="/" element={<UserLayout />} >
            <Route path="/"  element={<UserLandingPage />} />
            <Route path="/createaccount" element={<UserLogin />} />
            <Route path="/category" element={<UserCategory />} />
            {/* <Route path="/category/:advisername" element={<UserAdviserProfile />} /> */}
            <Route path="/category/:advisername/:adviserid" element={<ShareAdvisorProfile />} />,
            <Route path="/category/:advisername" element={<AdvisorProfile />} />
            <Route path="/category/:advisername/checkout/:servicename" element={<UserCheckoutPage />} />
            <Route path="/bookedservices" element={<BookedServices />} />
            <Route path="/post/:postid" element={<Post />} />
            
     </Route>

    


    <Route path ="/adviser" element={<App />} />,
    <Route path="/adviser/login" element={<Login />} />,
    <Route path="/adviser/signup" element={<SignUp />} />,
    <Route path="/adviser/changepassword" element={<ChangePassword />} />,
    <Route path="/adviser/emailconfirmation" element={<ConfirmEmail />} />,
    <Route path="/adviser/professionaldetails" element={<ProfessionalDetails />} />,
    <Route path="/adviser/bankdetails" element={<BankDetails />} />,
    <Route path="/adviser/documentupload" element={<UploadDocuments />} />,


    <Route path='/adviser' element={<Layout />}>
      <Route path="/adviser/dashboard" element={<Dashboard />} />
      <Route path="/adviser/services" element={<Services />} />
      <Route path="/adviser/createservice" element={<ServiceForm />} />
      <Route path="/adviser/editservice" element={<ServiceForm />} />
      <Route path="/adviser/profile" element={<Profile />} />
      <Route path="/adviser/createpost" element={<VideoUpload />} />
      <Route path="/adviser/postpreview" element={<VideoPreview />} />
      <Route path="/adviser/createdpost" element={<CreatedPosts />} />
      <Route path="/adviser/logout" element={<Logout />} />
     </Route>,

     <Route path="/videocall" element={<VideoCall />} />,
     <Route path="/room/:meetingid" element={<Room />} />,

     <Route path="/payment" element={<Payment />} />,

     <Route path="/privacypolicy" element={<PrivacyPolicy />} />,

     {/* <Route path="/createquestion" element={<Question />} />, */}

     <Route path="/analytics" element={<AnalyticsLayout />} >
       <Route path="/analytics" element={<Home />} />,
       <Route path="/analytics/creatorsdata" element={<CreatorsData />} />,
       <Route path="/analytics/usersdata" element={<UsersData />} />,
       <Route path="/analytics/postsdata" element={<PostsData />} />
     </Route>,
     

    


  </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  ,
)
