const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// Middleware
app.use(compression()); // Compress responses
app.use(bodyParser.json({ limit: "10kb" })); // Limit payload size
app.use(morgan("combined")); // Logging

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  const mongoURI = process.env.MONGO_URI;
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(mongoURI, options);
    console.log("📦 Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("⏳ Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "api",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API routes
const userRouter = require("./routes/userRoutes");
const playerRouter = require("./routes/playerRoutes");

// Mount API routes
app.use("/api", userRouter);
app.use("/api", playerRouter);

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  // Log error details (in production you might want to use a proper logging service)
  console.error(`❌ Error ${status}: ${err.message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
});

// Start server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Unhandled rejection handling
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
