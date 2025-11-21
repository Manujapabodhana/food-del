import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://rpmanuja123_db_user:4Ec1uKknCt8zyI7S@cluster0.isyai6j.mongodb.net/?appName=Cluster0').then(()=>console.log("DB Connected"));
   
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.