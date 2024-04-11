import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import cart_icon from './cart_icon.png'
import list_product_icon from './Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={cart_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to='/listproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>
      
    </div>
  )
}

export default Sidebar
