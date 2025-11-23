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
                }
            });
            console.log('📥 Response received:', response.data);
            
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
            if (error.response) {
                console.log('📧 Error response:', error.response.data);
                console.log('🔢 Status code:', error.response.status);
                toast.error(error.response.data?.message || 'Server error. Please try again.')
            } else if (error.request) {
                console.log('🌐 Network error:', error.request);
                toast.error('Unable to connect to server. Please check your internet connection.')
            } else {
                console.log('⚙️ Request error:', error.message);
                toast.error('Network error. Please try again.')
            }
        }
    }


  return (
    <div className='login-popup'>
        <form className="login-popup-container" onSubmit={onLogin}>
            <div className="login-popup-title">
                <h2>{currState}</h2> 
                <div>
                    <button type="button" onClick={testBackend} style={{marginRight: '10px', fontSize: '12px', padding: '5px'}}>
                        Test Backend
                    </button>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
            </div>
            <div className="login-popup-inputs">
                {currState==="Sign Up" ? (
                    <input 
                        type="text" 
                        name="name" 
                        placeholder='Your name' 
                        value={data.name} 
                        onChange={onChangeHandler} 
                        required 
                    />
                ) : null}
                <input 
                    type="email" 
                    name="email" 
                    placeholder='Your email' 
                    value={data.email} 
                    onChange={onChangeHandler} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder='Password' 
                    value={data.password} 
                    onChange={onChangeHandler} 
                    required 
                />
            </div>
            <button type="submit" disabled={!data.email || !data.password || (currState === "Sign Up" && !data.name)}>
                {currState==="Login"?"Login":"Create account"}
            </button>
            <div className="login-popup-condition">
                <input type="checkbox" id="terms-checkbox" />
                <label htmlFor="terms-checkbox">By continuing, I agree to the terms of use & privacy policy.</label>
            </div>
            {currState==="Login"
                ?<p>Create a new account? <span onClick={()=>setCurrState('Sign Up')}>Click here</span></p>
                :<p>Already have an account? <span onClick={()=>setCurrState('Login')}>Login here</span></p>
            }
        </form>
    </div>
  )
}

export default LoginPopup
