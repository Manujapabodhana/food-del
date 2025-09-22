import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

function Navbar() {

  const [menu, setMenu] = useState("home");






  return (
    <nav className="navbar">
      <img src={assets.logo} alt="Company logo" className="logo" />
      
      <ul className="navbar-menu">
        <li onClick={()=>setMenu("home")} className={menu === "home" ? "active" : ""}>Home</li>
        <li onClick={()=>setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</li>
        <li onClick={()=>setMenu("mobile")} className={menu === "mobile" ? "active" : ""}>Mobile App</li>
        <li className={menu === "contact" ? "active" : ""}>Contact Us</li>
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