import React from 'react'
import UserNavbar from './User-Components/UserNavbar'
import { Outlet } from 'react-router-dom'
import UserFooter from './User-Components/UserFooter'

function UserLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 overflow-y-auto'>
      <UserNavbar />
      <Outlet />
      </div>
      <div>
      <UserFooter />
      </div>
      
    </div>
  )
}

export default UserLayout