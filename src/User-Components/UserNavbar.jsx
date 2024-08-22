import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Swal from 'sweetalert2'
import User from '../assets/User.png'




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function UserNavbar() {
  const userid = JSON.parse(localStorage.getItem('userid'))

  const navigate= useNavigate()

  const location = useLocation()

  const handleLogOut = async () => {
  
    Swal.fire({
      title: "Do you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("userid", JSON.stringify(null));
        navigate('/');
      }
    });
  

  };

  const handleClickOnProfile = () =>{
    if( userid == null)
    {
      navigate('/createaccount')
    }
    else{
      handleLogOut()
    }
  }

  const transparentPaths = ['/', ];
  
  return (
    <Disclosure as="nav" className={`fixed z-50 h-[80px] w-full ${transparentPaths.includes(location.pathname) ? 'bg-transparent sm:bg-white' : 'bg-white'}`}>
      {({ open }) => (
        <>
          <div className=" container mx-auto  px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between ">
              <div className="absolute inset-y-0 left-0  items-center hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-[#489CFF] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1  items-center justify-between px-[10px] sm:px-0 sm:items-stretch sm:justify-start ">
                <div className="flex flex-shrink-0 items-center">
                  <Link  to="/">
                  <img
                    className="h-16 w-auto pt-4"
                    src={logo}
                    alt=""
                  />
                  </Link>
                </div>

                <div className='h-[80px] flex items-center pt-4 pr-2 sm:hidden' onClick={handleClickOnProfile}>
                  <img 
                   src={User}
                   alt=""
                   className='h-12 w-12 rounded-full border border-gray-500 cursor-pointer'
                  />

                </div>

              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 pt-4">

                

       <NavLink to="/">
             <div className={`font-Poppins text-lg  h-full flex items-center mx-3`}>
               <p>HOME</p>
              </div>
        </NavLink> 

        <NavLink to="/category">
             <div className={`font-Poppins text-lg  h-full flex items-center mx-3`}>
               <p>ADVISER</p>
              </div>
        </NavLink>

        { userid == null &&         <NavLink to="/createaccount">
             <div className={`font-Poppins text-lg  h-full flex items-center mx-3 px-4 py-2 rounded-lg text-white bg-[#0069B4]`}>
               <p>LOGIN/SIGNUP</p>
              </div>
        </NavLink>}

        { userid != null &&         <div  onClick={handleLogOut} className='cursor-pointer' >
             <div className={`font-Poppins text-lg  h-full flex items-center mx-3 px-4 py-2 rounded-lg text-white bg-[#0069B4]`}>
               <p>LOGOUT</p>
              </div>
        </div>}



        {/* <NavLink to="/adviser">
             <div className={`font-Poppins text-lg  h-full flex items-center mx-3`}>
               <p>ADVISER</p>
              </div>
        </NavLink> */}

                  </div>
                </div>
              </div>
              

            
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white">
            <div className="">
                <Disclosure.Button>
                  <NavLink to="/" >
             <div className={`py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}>
               <p>HOME</p>
              </div>
        </NavLink>

        <NavLink to="/category" >
             <div className={`py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}>
               <p>ADVISER</p>
              </div>
        </NavLink>
        
        {userid== null &&         <NavLink to="/createaccount" >
             <div className={`py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}>
               <p>LOGIN/SIGNUP</p>
              </div>
        </NavLink> }

        {userid != null &&         <div onClick={handleLogOut} className='cursor-pointer'>
             <div className={`py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}>
               <p>LOGOUT</p>
              </div>
        </div> }



{/* 
        <NavLink to="/adviser" >
             <div className={`py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}>
               <p>ADVISER</p>
              </div>
        </NavLink> */}
            
                </Disclosure.Button>


            
              
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
