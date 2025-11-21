import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Your actual MongoDB Atlas connection string
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://rpmanuja123:Weka123@food-del.znvi7q7.mongodb.net/food-del?appName=food-del&retryWrites=true&w=majority';

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ DB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error.message);
        console.log("Server will continue without database connection...");
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.