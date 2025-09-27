import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'


const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="Logo" />
                <p>Delivering deliciousness to your doorstep, one bite at a time.</p>
                <div className="footer-social icons">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.instagram_icon} alt="Instagram" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                </div>

            </div>

            <div className="footer-content-center">

            </div>
            <div className="footer-content-right">

            </div>
        </div>
      <p>&copy; 2023 Food Delivery. All rights reserved.</p>
    </div>
  )
}

export default Footer
