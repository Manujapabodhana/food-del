import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config(); // Load environment variables from .env

// Set DNS resolver to use Google's DNS to avoid local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

export async function connectDB() {
  const uri = process.env.MONGO_URI; // Get URI from .env

  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
  };

  let retries = 3;
  
  while (retries > 0) {
    try {
      await mongoose.connect(uri, options);
      console.log("✅ MongoDB Connected Successfully");
      return;
    } catch (error) {
      retries--;
      console.error(`❌ MongoDB Connection Error (${3 - retries}/3):`, error.message);
      
      if (retries === 0) {
        console.error("Failed to connect after 3 attempts. Exiting...");
        process.exit(1);
      }
      
      console.log(`Retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
