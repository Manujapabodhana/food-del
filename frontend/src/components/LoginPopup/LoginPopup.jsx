import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({setShowLogin}) => {

    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [lastMessage, setLastMessage] = useState("")

    const { setToken, loadCartData, url } = useContext(StoreContext);

    // Test function to check backend connectivity
    const testBackend = async () => {
        console.log('🧪 Testing backend connectivity...');
        console.log('🌐 Backend URL:', url);

        try {
            const response = await axios.get(url + '/test', {
                timeout: 5000
            });
            console.log('✅ Backend test successful:', response.data);
            toast.success('Backend connection successful!');
        } catch (error) {
            console.log('❌ Backend test failed:', error);
            if (error.code === 'ECONNREFUSED') {
                toast.error('Backend server is not running!');
            } else if (error.response?.status === 404) {
                toast.info('Backend is running but test endpoint not found (that\'s okay)');
            } else {
                toast.error('Backend connection error: ' + error.message);
            }
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        console.log('🚀 Form submission started');
        console.log('📝 Current state:', currState);
        console.log('📋 Form data:', data);
        console.log('🌐 Backend URL:', url);

        // Validate required fields
        if (currState === "Sign Up" && !data.name.trim()) {
            console.log('❌ Name validation failed');
            toast.error('Please enter your name');
            return;
        }
        if (!data.email.trim()) {
            console.log('❌ Email validation failed');
            toast.error('Please enter your email');
            return;
        }
        if (!data.password.trim()) {
            console.log('❌ Password validation failed');
            toast.error('Please enter your password');
            return;
        }
        if (currState === "Sign Up" && data.password.length < 8) {
            console.log('❌ Password length validation failed');
            toast.error('Password must be at least 8 characters long');
            return;
        }

        console.log('✅ All validations passed');

        try {
            setLoading(true)
            let new_url = url;
            if (currState === "Login") {
                new_url += "/api/user/login";
            }
            else {
                new_url += "/api/user/register"
            }

            console.log('🎯 Making request to:', new_url);
            console.log('📤 Request data:', data);

            // Show loading toast
            toast.info(currState === "Login" ? "Logging in..." : "Creating account...");

            const response = await axios.post(new_url, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            console.log('📥 Response received:', response.data);
            setLastMessage(JSON.stringify(response.data))

            if (response.data.success) {
                console.log('🎉 Success! Setting token...');
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                await loadCartData({token:response.data.token})
                setShowLogin(false)
                toast.success(currState === "Login" ? "Login successful!" : "Account created successfully!")

                // Clear form data after successful registration/login
                setData({
                    name: "",
                    email: "",
                    password: ""
                })
            }
            else {
                console.log('❌ Server returned error:', response.data.message);
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('💥 Login/Register error:', error);
            let errMsg = 'Network error. Please try again.'
            if (error.response) {
                console.log('📧 Error response:', error.response.data);
                console.log('🔢 Status code:', error.response.status);
                errMsg = error.response.data?.message || 'Server error. Please try again.'
                toast.error(errMsg)
            } else if (error.request) {
                console.log('🌐 Network error:', error.request);
                errMsg = 'Unable to connect to server. Please check your internet connection.'
                toast.error(errMsg)
            } else {
                console.log('⚙️ Request error:', error.message);
                errMsg = error.message
                toast.error(errMsg)
            }
            setLastMessage(errMsg)
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className='login-popup'>
        <form className="login-popup-container" onSubmit={onLogin}>
            <div className="login-popup-close">
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="Close" />
            </div>
            
            <div className="login-popup-header">
                <div className="login-popup-icon">🍽️</div>
                <h2>{currState === "Login" ? "Welcome Back!" : "Join Us Today!"}</h2>
                <p className="login-popup-subtitle">
                    {currState === "Login" 
                        ? "Login to access your account and orders" 
                        : "Create an account to start ordering"}
                </p>
            </div>

            <div className="login-popup-inputs">
                {currState==="Sign Up" && (
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder='Enter your full name'
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                )}
                
                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Enter your email'
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={currState === "Sign Up" ? 'Create a password (min 8 characters)' : 'Enter your password'}
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
            >
                {loading ? (
                    <span className="loading-spinner">⏳ {currState === "Login" ? "Logging in..." : "Creating account..."}</span>
                ) : (
                    <span>{currState === "Login" ? "Login" : "Create Account"}</span>
                )}
            </button>
            {currState === "Sign Up" && (
                <div className="login-popup-condition">
                    <input type="checkbox" id="terms-checkbox" required />
                    <label htmlFor="terms-checkbox">I agree to the terms of use & privacy policy</label>
                </div>
            )}
            
            <div className="login-popup-footer">
                <p>
                    {currState === "Login" 
                        ? "Don't have an account? " 
                        : "Already have an account? "}
                    <span onClick={()=>setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
                        {currState === "Login" ? "Sign Up" : "Login"}
                    </span>
                </p>
            </div>
        </form>
    </div>
  )
}

export default LoginPopup
