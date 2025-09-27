import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'


const Footer = () => {
  return (
    <footer className='footer' id='footer'>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img src={assets.logo} alt="Tomato Logo" />
              <h3>Tomato</h3>
            </div>
            <p className="footer-description">
              Experience the finest flavors delivered fresh to your door. 
              We're passionate about connecting you with amazing food from the best local restaurants.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <img src={assets.facebook_icon} alt="Facebook" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <img src={assets.twitter_icon} alt="Twitter" />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <img src={assets.linkedin_icon} alt="LinkedIn" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><a href="#">Food Delivery</a></li>
              <li><a href="#">Restaurant Partners</a></li>
              <li><a href="#">Corporate Catering</a></li>
              <li><a href="#">Gift Cards</a></li>
              <li><a href="#">Promotions</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-section footer-contact">
            <h3 className="footer-title">Get in Touch</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>hello@tomato.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Food Street, Taste City, TC 12345</span>
              </div>
            </div>
            <div className="newsletter">
              <h4>Stay Updated</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 Tomato Food Delivery. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
