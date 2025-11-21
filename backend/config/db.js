import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://rpmanuja123:Weka123@food-del.znvi7q7.mongodb.net/?appName=food-del');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.