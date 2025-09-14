const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// 🔹 Routes safely import (try-catch in case files not exist)
let authRoutes, documentRoutes, userRoutes;
try {
  authRoutes = require("./routes/auth");
} catch {
  console.warn("⚠️ auth.js route file missing, skipping...");
}
try {
  documentRoutes = require("./routes/documents");
} catch {
  console.warn("⚠️ documents.js route file missing, skipping...");
}
try {
  userRoutes = require("./routes/users");
} catch {
  console.warn("⚠️ users.js route file missing, skipping...");
}

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morgan("combined"));

// Database connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/dms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
if (authRoutes) app.use("/api/documentManagement", authRoutes);
if (documentRoutes) app.use("/api/documentManagement", documentRoutes);
if (userRoutes) app.use("/api/documentManagement", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📞 Twilio configured: ${!!process.env.TWILIO_ACCOUNT_SID}`);
});

module.exports = app;
