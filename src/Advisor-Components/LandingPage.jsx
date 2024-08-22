import React from 'react';
import background from '../assets/background.png';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import logo2 from '../assets/logo2.png';
import logo from '../assets/logo.png'
import imgText1 from '../assets/imgText1.png'
import imgText2 from '../assets/imgText2.png'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function LandingPage() {
 const adviserid = JSON.parse(localStorage.getItem('adviserid'))
 const navigate = useNavigate()

 const auth= getAuth();

  return (
    <div className="bg-cover bg-center min-h-screen " style={{ backgroundImage: `url(${background})` }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-[80px]">
        <div className="flex flex-col md:flex-row justify-center lg:mb-[100px] lg:mt-[60px]">
          <div className="flex flex-col  text-center md:text-left items-center justify-center py-4 lg:ml-[70px] md:w-2/5">
            <div>
              <p className='font-Poppins text-4xl sm:text-5xl  lg:text-7xl font-bold sm:leading-normal lg:leading-tight my-2 pt-[30px] sm:pt-[0px]'>
                Start your <br />
                Side hustle <br />
                today
              </p>
              <p className='font-Poppins text-md sm:text-xl  lg:text-2xl pt-2 pb-4 '>
                Join our Army of 1000+ <br />
                Advisers
              </p>
              { adviserid == null && <button className='bg-[#489CFF] text-white px-2 py-2 sm:px-4 sm:py-2 rounded-md cursor-pointer font-Poppins my-3' onClick={()=> navigate('/adviser/login')}>Create My Page</button>}
              
            </div>
          </div>
          <div className=" md:w-3/5 flex items-center justify-center">
            <img className="object-contain h-auto max-w-full" src={image1} alt="" />
          </div>
        </div>

        <div className='flex flex-row  justify-center  lg:mb-[100px] my-[40px] sm:mt-[0px]'>
          <div className='  h-full w-3/6 flex justify-center lg:mr-[130px] items-center'>
            <div>
              {/* <p className='font-Poppins  text-3xl sm:text-5xl stroke-black text-transparent font-bold my-2 '>Advisers<br />
                Onboarded</p> */}
                <img src={imgText1}
                     alt=""
                     className='h-24 md:h-48 lg:h-64'
                     />
         
            </div>
          </div>
          <div className='  h-full w-3/6 flex lg:justify-start justify-end items-center lg:mb-[100px]'>
            <div>
            <img src={imgText2}
                     alt=""
                     className='h-24 md:h-48 lg:h-64'
                     />
            </div>
          </div>
        </div>


        <div  className='px-4 sm:ml-[40px] lg:ml-[150px] sm:mt-[120px] mt-[60px] '  >
          <p className='font-Poppins text-3xl sm:text-5xl font-bold text-center sm:text-left  my-2'>Benefits to Join Adviserxiis</p>
        </div>

        <div className='flex flex-col  md:flex-row mt-[20px] sm:mt-[50px]' >
          <div className='h-full w-full md:w-2/6 flex flex-col justify-center  sm:ml-[40px] lg:ml-[150px] '>
            <div className=' flex pl-3 items-center bg-gradient-to-b from-[#0165E1] to-[#17A9FD] text-xl text-center text-white font-Poppins   h-12 sm:h-16  rounded-lg my-2'>
              Personal Profile
            </div>
            <div className=' flex pl-3 items-center bg-white font-Poppins  h-12 sm:h-16  rounded-lg my-2'>
              Unlimited Earning
            </div>
            <div className=' flex pl-3 items-center  bg-white font-Poppins h-12 sm:h-16  rounded-lg my-2'>
              Unlimited Services
            </div>
            <div className=' flex pl-3 items-center bg-white font-Poppins  h-12 sm:h-16  rounded-lg my-2'>
              Unlimited Audience
            </div>
            <div className=' flex pl-3 items-center bg-white font-Poppins  h-12 sm:h-16 rounded-lg my-2'>
              Easy to Use
            </div>
          </div>
          <div className='mt-[40px] sm:mt-[10px] w-full md:w-4/6 h-full flex justify-center items-center '>
            <img className="object-cover h-[300px] md:h-[300px] lg:h-[600px]" src={image2} alt="" />
          </div>
        </div>
      </div>

      <div style={{ height: "550px" }} className='bg-gradient-to-r from-[#000000E5] to-[#489CFFE5] flex justify-center items-center mt-[100px] sm:mt-[150px]  md:mt-[200px]'>
        <div>
          <p className='font-Poppins text-center text-3xl sm:text-5xl lg:text-6xl text-white font-bold my-2 '>
            Don’t Miss out the chance<br /> of becoming <span className='text-black text-center'>TOP 1 %</span>
          </p>
          <div className='flex justify-center'>
            {
              adviserid == null && <button className='bg-[#489CFF] text-white px-2 py-2 sm:px-4 sm:py-2 rounded-md cursor-pointer md:text-2xl font-Poppins md:h-16 md:w-64 my-3' onClick={()=> navigate('/adviser/login')}>Create My Page</button>
            }
            
          </div>
        </div>
      </div>


      <div className='container mx-auto lg:px-[150px] lg:my-[150px]'>
        <div style={{ marginTop: "50px", marginLeft: "40px" }} className='flex flex-col sm:flex-row'>
          <div className='w-full sm:w-3/6'>
            <p className='font-Poppins text-2xl sm:text-5xl font-bold sm:leading-normal my-2'>
              Pricing
            </p>

            <p className='font-Poppins text-xl sm:text-3xl  sm:leading-normal mt-2'>
              We earn only when you earn
            </p>

            <div className=' w-full  h-full flex justify-start md:justify-end mt-4' style={{paddingRight:"120px"}}>
              <img className="object-cover h-24" src={logo2} alt="" />
            </div>

          </div>
          <div className='w-full sm:w-3/6 flex flex-col justify-center lg:ml-[40px] sm:mt-[40px]'>
            <p className='font-Poppins text-xl sm:text-2xl ' style={{marginTop:"60px"}}>We charge a small commission on your<br /> earnings. <span className='font-bold'>7% Commission</span>
            </p>
           <p className='font-Poppins text-xl sm:text-2xl font-bold' style={{marginTop:"40px"}}>No CC required. No upfront fees. No <br />recurring charges.</p>
          </div>
        </div>
      </div>


      <div className='bg-[#F6F6F6CC] h-[400px] lg:h-[500px] flex justify-center' style={{marginTop:"100px"}}>
        <div className='container mx-auto flex flex-col sm:flex-row justify-center r '>
          <div className='sm:w-3/6 flex flex-col justify-center md:ml-[40px]  lg:ml-[150px] pl-2 mb-[30px]'>
          <div >
          <div className=' flex items-center]'>
              <img className="object-cover h-24 md:h-32" src={logo} alt="" />
            </div>
            <p className='font-Poppins text-md md:text-xl pl-4'>Adviserxiis  the world of advisers</p>
          </div>
          </div>
          <div className="flex flex-col justify-center p-4 pl-[30px] sm:pi-[0px] sm:w-3/6">
            <div>
              <p className='font-Poppins text-3xl sm:text-5xl font-bold sm:leading-normal my-2'>
                Start your <br />
                Side hustle <br />
                today
              </p>
              { adviserid == null &&     <button className='bg-[#489CFF] text-white px-4  py-1 sm:px-4 sm:py-2 rounded-md cursor-pointer font-Poppins my-3 text-lg sm:text-xl' onClick={()=> navigate('/adviser/login')}>Get Started</button> }

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LandingPage;
