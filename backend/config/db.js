import mongoose from "mongoose";

export const connectDB = async () => {
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

    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ DB Connected Successfully");
        return;
    } catch (error) {
        console.error("❌ DB Connection Error:", error.message);
        // Detect common SRV DNS failure for mongodb+srv strings
        if (error.message && error.message.includes('querySrv ENOTFOUND')) {
            console.error('DNS SRV lookup failed for mongodb+srv connection string.');
            console.error('This can happen on certain networks (DNS blocked) or if the connection uses mongodb+srv protocol.');
            console.error('Solution: 1) Use a standard (non-SRV) connection string from your Atlas dashboard (mongodb://host1,host2...), OR 2) Set environment variable MONGODB_URI_FALLBACK to a non-srv connection string and we will attempt that.');
            const fallback = process.env.MONGODB_URI_FALLBACK;
            if (fallback) {
                console.log('Attempting to connect using MONGODB_URI_FALLBACK...');
                try {
                    await mongoose.connect(fallback, { serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 });
                    console.log('✅ DB Connected Successfully using MONGODB_URI_FALLBACK');
                    return;
                } catch (err2) {
                    console.error('❌ Fallback connection also failed:', err2.message);
                    process.exit(1);
                }
            } else {
                console.error('MONGODB_URI_FALLBACK is not set. Please add a non-SRV connection string or update your network.');
                const failFast = process.env.DB_FAIL_FAST !== 'false';
                if (failFast) {
                    process.exit(1);
                } else {
                    console.warn('Continuing without DB connection because DB_FAIL_FAST=false');
                    return;
                }
            }
        }
        // For other errors, handle according to DB_FAIL_FAST env var.
        const failFast = process.env.DB_FAIL_FAST !== 'false';
        if (failFast) {
            process.exit(1);
        } else {
            console.warn('Continuing without DB connection because DB_FAIL_FAST=false');
            return;
        }
    }
}

// NOTE: Do NOT commit credentials into source control. Store your MongoDB connection
// string in environment variables or a local .env file (ignored by git).