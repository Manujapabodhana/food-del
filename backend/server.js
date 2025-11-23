import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors())

// db connection
await connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
});

// Test endpoint for debugging
app.get("/test", (req, res) => {
    res.json({success: true, message: "Backend server is working!", timestamp: new Date().toISOString()})
});

// Start the server with robust EADDRINUSE handling and optional fallback ports
const MAX_PORT_ATTEMPTS = 10;

let serverRef = null;
async function startServer(startPort, attemptsLeft = MAX_PORT_ATTEMPTS) {
    const chosenPort = startPort;
    let server = null;
    try {
        server = app.listen(chosenPort, () => {
            console.log(`Server started on http://localhost:${chosenPort}`)
            console.log(`Server PID: ${process.pid}`)
        })
        serverRef = server;
        server.on('error', (err) => {
            // handle EADDRINUSE for already-bound ports
            if (err && err.code === 'EADDRINUSE') {
                console.error(`\n❌ Port ${chosenPort} is already in use. Trying next port...`)
                server.close();
                if (attemptsLeft > 1) {
                    // try next port
                    startServer(chosenPort + 1, attemptsLeft - 1)
                } else {
                    console.error('Unable to find a free port to start the server after multiple attempts.');
                    // As a fallback, show suggestion to user and exit
                    console.error(`Suggested command (PowerShell): Get-Process -Id (Get-NetTCPConnection -LocalPort ${startPort}).OwningProcess`)
                    console.error(`Kill the process using: taskkill /F /PID <PID>`)
                    process.exit(1)
                }
            } else {
                console.error('Server error:', err)
                process.exit(1)
            }
        })
    } catch (err) {
        if (err && err.code === 'EADDRINUSE') {
            console.error(`\n❌ Primary port ${chosenPort} is in use. Trying fallback port ${chosenPort + 1}...`)
            if (attemptsLeft > 1) {
                return startServer(chosenPort + 1, attemptsLeft - 1);
            }
        }
        console.error('Failed to start server:', err)
        process.exit(1)
    }
    return server
}

// Kick off server
startServer(port).catch(err => {
    console.error('Error while starting the server:', err)
    process.exit(1)
})

// Graceful shutdown on signals
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...')
    if (serverRef) {
        serverRef.close(() => {
        console.log('Server shut down.');
        process.exit(0)
    })
    } else {
        process.exit(0)
    }
})
process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...')
    if (serverRef) {
        serverRef.close(() => {
        console.log('Server shut down.');
        process.exit(0)
    })
    } else {
        process.exit(0)
    }
})