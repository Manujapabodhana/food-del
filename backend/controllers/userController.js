import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d' });
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        console.log('Login attempt for:', email);
        
        const user = await userModel.findOne({email})

        if(!user){
            console.log('User not found:', email);
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            console.log('Password mismatch for:', email);
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        console.log('Login successful for:', email);
        res.json({success:true,token})
    } catch (error) {
        console.log('Login error:', error);
        res.json({success:false,message:"Server error during login"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        console.log('Registration attempt for:', email);
        
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            console.log('User already exists:', email);
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            console.log('Invalid email format:', email);
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            console.log('Password too short for:', email);
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        console.log('Registration successful for:', email);
        res.json({success:true,token})

    } catch(error){
        console.log('Registration error:', error);
        res.json({success:false,message:"Server error during registration"})
    }
}

export {loginUser, registerUser}