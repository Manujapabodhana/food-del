import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://rpmanuja123_db_user:4Ec1uKknCt8zyI7S@cluster0.isyai6j.mongodb.net/food-del?appName=Cluster0';
        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.