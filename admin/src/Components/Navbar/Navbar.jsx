import React from 'react'
import './Navbar.css'
import navlogo from './logo.jpg'
import navprofileIcon from './admin.jpg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} className='nav-logo' alt="" />
      <img src={navprofileIcon} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar
