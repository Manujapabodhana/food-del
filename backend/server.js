import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// App config
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
await connectDB(); // connectDB reads MONGO_URI from .env internally

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Test endpoint for debugging
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Start the server with robust EADDRINUSE handling
const MAX_PORT_ATTEMPTS = 10;
let serverRef = null;

async function startServer(startPort, attemptsLeft = MAX_PORT_ATTEMPTS) {
  const chosenPort = startPort;

  try {
    const server = app.listen(chosenPort, () => {
      console.log(`Server started on http://localhost:${chosenPort}`);
      console.log(`Server PID: ${process.pid}`);
    });

    serverRef = server;

    server.on("error", async (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${chosenPort} is in use. Trying next port...`);
        server.close();
        if (attemptsLeft > 1) {
          await startServer(chosenPort + 1, attemptsLeft - 1);
        } else {
          console.error(
            "Unable to find a free port after multiple attempts."
          );
          process.exit(1);
        }
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Kick off server
await startServer(PORT);

// Graceful shutdown
const shutdown = () => {
  console.log("\nShutting down gracefully...");
  if (serverRef) {
    serverRef.close(() => {
      console.log("Server shut down.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
