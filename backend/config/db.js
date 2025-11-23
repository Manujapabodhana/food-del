import mongoose from "mongoose";

export const connectDB = async () => {
    // Check if we should use local database for development
    if (process.env.USE_LOCAL_DB === 'true') {
        try {
            await mongoose.connect('mongodb://localhost:27017/food-del', {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("✅ DB Connected Successfully (Local MongoDB)");
            return;
        } catch (error) {
            console.error("❌ Local DB Connection Failed:", error.message);
            console.log("📋 To use local MongoDB:");
            console.log("1. Install MongoDB locally");
            console.log("2. Start MongoDB service: mongod");
            console.log("3. Or install MongoDB Community Server from https://www.mongodb.com/try/download/community");
            // Continue to try Atlas connection
        }
    }

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error("❌ MONGODB_URI is not defined in environment variables. Please add it to .env or environment.");
        const failFast = process.env.DB_FAIL_FAST !== 'false';
        if (failFast) {
            // Fail fast — don't start server without DB credentials in production.
            process.exit(1);
        } else {
            console.warn('Continuing without DB connection because DB_FAIL_FAST=false');
            return;
        }
    }

    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 30000,
            maxPoolSize: 10,
            connectTimeoutMS: 15000,
        });
        console.log("✅ DB Connected Successfully to MongoDB Atlas");
        return;
    } catch (error) {
        console.error("❌ Primary DB Connection Error:", error.message);
        
        // Try fallback connection
        const fallback = process.env.MONGODB_URI_FALLBACK;
        if (fallback) {
            console.log('🔄 Attempting to connect using MONGODB_URI_FALLBACK...');
            try {
                await mongoose.connect(fallback, { 
                    serverSelectionTimeoutMS: 15000, 
                    socketTimeoutMS: 30000,
                    maxPoolSize: 10,
                    connectTimeoutMS: 15000,
                });
                console.log('✅ DB Connected Successfully using fallback connection');
                return;
            } catch (err2) {
                console.error('❌ Fallback connection also failed:', err2.message);
            }
        }
        
        // If all connections fail, provide helpful error messages
        console.log("\n📋 MongoDB Connection Troubleshooting:");
        if (error.message && error.message.includes('querySrv ENOTFOUND')) {
            console.log("🔍 DNS SRV Issue detected:");
            console.log("1. Your network may be blocking DNS SRV lookups");
            console.log("2. Try using a VPN or different network");
            console.log("3. Use a non-SRV connection string from Atlas");
        }
        
        if (error.message && (error.message.includes('IP') || error.message.includes('not authorized'))) {
            console.log("🔍 IP Whitelist Issue detected:");
            console.log("1. Go to MongoDB Atlas Dashboard");
            console.log("2. Navigate to Network Access");
            console.log("3. Add your current IP address or use 0.0.0.0/0 for development");
        }
        
        console.log("4. Alternative: Set USE_LOCAL_DB=true in .env to use local MongoDB");
        console.log("5. Check your username/password in the connection string\n");

        const failFast = process.env.DB_FAIL_FAST !== 'false';
        if (failFast) {
            console.log("❌ Exiting because DB_FAIL_FAST is enabled. Set DB_FAIL_FAST=false to continue without DB.");
            process.exit(1);
        } else {
            console.warn('⚠️ Continuing without DB connection because DB_FAIL_FAST=false');
            console.warn('⚠️ Some features may not work without database connection');
            return;
        }
    }
};

// NOTE: Do NOT commit credentials into source control. Store your MongoDB connection
// string in environment variables or a local .env file (ignored by git).