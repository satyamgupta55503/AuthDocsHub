// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ---------------------
// Check essential env variables
// ---------------------
["MONGO_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) console.warn(`⚠️ ${key} not set in .env`);
});

// ---------------------
// Middleware
// ---------------------
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Body parser
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------------------
// Rate Limiting
// ---------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: { success: false, message: "Too many requests. Try again later." },
});
app.use("/api/", limiter);

// ---------------------
// MongoDB Connection
// ---------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/dms")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------
// Routes
// ---------------------
let authRoutes, documentRoutes, userRoutes;

try {
  authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes);
} catch {
  console.warn("⚠️ auth.js route file missing, skipping...");
}

try {
  documentRoutes = require("./routes/documents");
  app.use("/api/documents", documentRoutes);
} catch {
  console.warn("⚠️ documents.js route file missing, skipping...");
}

try {
  userRoutes = require("./routes/users");
  app.use("/api/users", userRoutes);
} catch {
  console.warn("⚠️ users.js route file missing, skipping...");
}

// ---------------------
// Health Check
// ---------------------
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ---------------------
// 404 Handler
// ---------------------
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------------------
// Error Handling
// ---------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ---------------------
// Server Start
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📞 Twilio configured: ${!!process.env.TWILIO_ACCOUNT_SID}`);
});

module.exports = app;
