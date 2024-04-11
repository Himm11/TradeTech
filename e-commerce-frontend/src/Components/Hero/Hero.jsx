import React from 'react'
import './Hero.css'
import upes from '../Assets/upes.jpg'
import upes_logo from "../Assets/upes2.png"

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>TradeTech</h2>
        <div>
            <p>A community to</p>
            <p>trade and share</p>
        </div>
      </div>
      <div className="hero-right">
        <img src={upes_logo} alt="" />
      </div>
    </div>
  )
}

export default Hero
