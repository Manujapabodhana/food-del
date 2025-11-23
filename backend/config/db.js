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
        
        // Try multiple fallback connections
        const fallbacks = [
            process.env.MONGODB_URI_FALLBACK,
            process.env.MONGODB_URI_FALLBACK2
        ].filter(Boolean); // Remove undefined/null values
        
        for (let i = 0; i < fallbacks.length; i++) {
            const fallback = fallbacks[i];
            console.log(`🔄 Attempting to connect using fallback ${i + 1}...`);
            try {
                await mongoose.connect(fallback, { 
                    serverSelectionTimeoutMS: 15000, 
                    socketTimeoutMS: 30000,
                    maxPoolSize: 10,
                    connectTimeoutMS: 15000,
                });
                console.log(`✅ DB Connected Successfully using fallback ${i + 1}`);
                return;
            } catch (err2) {
                console.error(`❌ Fallback ${i + 1} connection also failed:`, err2.message);
            }
        }
        
        // If all connections fail, provide helpful error messages
        console.log("\n📋 MongoDB Connection Troubleshooting:");
        console.log("🔍 Possible Issues:");
        
        if (error.message && error.message.includes('querySrv ENOTFOUND')) {
            console.log("  • DNS SRV Issue: Your network may be blocking DNS SRV lookups");
            console.log("    Solutions:");
            console.log("    - Try using a VPN or different network");
            console.log("    - Use a non-SRV connection string (see below)");
            console.log("    - Set USE_LOCAL_DB=true for local development");
        }
        
        if (error.message && (error.message.includes('IP') || error.message.includes('not authorized') || error.message.includes('whitelist'))) {
            console.log("  • IP Whitelist Issue: Your IP address isn't whitelisted in MongoDB Atlas");
            console.log("    Solutions:");
            console.log("    - Go to MongoDB Atlas Dashboard → Network Access");
            console.log("    - Add your current IP address or use 0.0.0.0/0 for development");
            console.log("    - Check your IP: https://whatismyipaddress.com/");
        }
        
        console.log("  • Connection String Issues:");
        console.log("    - Get fresh connection strings from Atlas:");
        console.log("      1. Go to Atlas → Clusters → Connect");
        console.log("      2. Choose 'Connect your application'");
        console.log("      3. Copy the connection string");
        console.log("      4. Replace <password> with your actual password");
        console.log("      5. Update MONGODB_URI or MONGODB_URI_FALLBACK in .env");
        
        console.log("  • Local Development Option:");
        console.log("    - Set USE_LOCAL_DB=true in .env");
        console.log("    - Install MongoDB locally: https://www.mongodb.com/try/download/community");
        console.log("    - Start MongoDB: mongod");
        
        console.log("  • Test Connection:");
        console.log("    - Run: node -e \"require('./config/db.js').connectDB().then(() => console.log('Connected')).catch(console.error)\"");
        
        console.log("\n🔄 Current Configuration:");
        console.log("  - USE_LOCAL_DB:", process.env.USE_LOCAL_DB);
        console.log("  - DB_FAIL_FAST:", process.env.DB_FAIL_FAST);
        console.log("  - Has MONGODB_URI:", !!process.env.MONGODB_URI);
        console.log("  - Has MONGODB_URI_FALLBACK:", !!process.env.MONGODB_URI_FALLBACK);
        console.log("  - Has MONGODB_URI_FALLBACK2:", !!process.env.MONGODB_URI_FALLBACK2);

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