# Database Setup & Troubleshooting Guide

## 🚀 Quick Start

### Option 1: Use Local MongoDB (Recommended for Development)

```bash
# 1. Install MongoDB Community Server
# Go to: https://www.mongodb.com/try/download/community
# Follow installation instructions for your OS

# 2. Start MongoDB service
mongod

# 3. Update .env file
USE_LOCAL_DB=true

# 4. Start your backend
npm run dev
```

### Option 2: Fix MongoDB Atlas Connection

#### Step 1: Whitelist Your IP

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Add your current IP address or use `0.0.0.0/0` for development
5. Click **Confirm**

#### Step 2: Get Fresh Connection Strings

1. In Atlas Dashboard, go to **Clusters**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Update your `.env` file

#### Step 3: Test Connection

```bash
# Test database connection
node test-db.js

# Start backend
npm run dev
```

## 🔧 Troubleshooting

### DNS SRV Lookup Failed

**Error:** `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

**Solutions:**

- Use a non-SRV connection string (see fallback options)
- Try a different network/VPN
- Use local MongoDB

### IP Not Whitelisted

**Error:** `not authorized` or `IP address not allowed`

**Solution:** Add your IP to Atlas Network Access (see Step 1 above)

### Authentication Failed

**Error:** `bad auth` or `Authentication failed`

**Solutions:**

- Check username/password in connection string
- Ensure user has correct permissions in Atlas
- Try creating a new database user

### Connection Timeout

**Error:** `connection timed out`

**Solutions:**

- Check your internet connection
- Try different connection string
- Use local MongoDB

## 📝 Environment Variables

```env
# Database Configuration
MONGODB_URI="your_primary_connection_string"
MONGODB_URI_FALLBACK="your_fallback_connection_string"
MONGODB_URI_FALLBACK2="another_fallback_option"
USE_LOCAL_DB=false  # Set to true for local development
DB_FAIL_FAST=false  # Set to true to crash on DB failure
```

## 🧪 Testing

### Test Database Connection

```bash
node test-db.js
```

### Test API Endpoints

```bash
# Test server health
curl http://localhost:4000/test

# Test user registration
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔍 Common Issues & Solutions

| Issue             | Symptom                | Solution                             |
| ----------------- | ---------------------- | ------------------------------------ |
| DNS SRV Blocked   | `querySrv ENOTFOUND`   | Use non-SRV connection string        |
| IP Whitelist      | `not authorized`       | Add IP to Atlas Network Access       |
| Wrong Credentials | `bad auth`             | Check username/password              |
| Network Issues    | `connection timed out` | Try different network or local DB    |
| Port Conflict     | `EADDRINUSE`           | Kill existing process or change port |

## 📞 Need Help?

1. Run `node test-db.js` and share the output
2. Check your `.env` file configuration
3. Verify your Atlas cluster is running
4. Try local MongoDB as fallback

## 🔗 Useful Links

- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Network Access Setup](https://docs.mongodb.com/atlas/security/ip-access-list/)
