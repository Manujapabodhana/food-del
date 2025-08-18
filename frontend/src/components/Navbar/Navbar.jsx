import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

function Navbar() {
  return (
    <nav className="navbar">
      <img src={assets.logo} alt="Company logo" className="logo" />
      
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Menu</li>
        <li>Mobile App</li>
        <li>Contact Us</li>
      </ul>

      <div className="navbar-right">
        <button className="icon-button" aria-label="Search">
          <img src={assets.search_icon} alt="" />
        </button>
        <div className="navbar-search-icon">
            <img src={assets.basket_icon} alt=""></img>
            <div className="dot"></div>
        </div>
        <button>sign in</button>
      </div>
    </nav>
  );
}

export default Navbar;