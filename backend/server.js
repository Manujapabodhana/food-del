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

// Start the server and handle errors (esp. EADDRINUSE)
const server = app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
    console.log(`Server PID: ${process.pid}`)
})

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${port} is already in use. Another process is listening on this port.`)
        console.error(`To resolve: either kill the process using this port or change PORT in your .env.`)
        console.error(`Suggested command (PowerShell): Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess`)
        console.error(`Kill it using: taskkill /F /PID <PID>`)
        process.exit(1)
    }
    console.error('Server error:', err)
    process.exit(1)
})

// Graceful shutdown on signals
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...')
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0)
    })
})
process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...')
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0)
    })
})