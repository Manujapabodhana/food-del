#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this to test your MongoDB connections and get troubleshooting info
 */

import { connectDB } from './config/db.js';

console.log('🧪 Testing MongoDB Connection...\n');

try {
    await connectDB();
    console.log('\n✅ Database connection test completed successfully!');
    process.exit(0);
} catch (error) {
    console.log('\n❌ Database connection test failed!');
    console.log('Error:', error.message);
    process.exit(1);
}