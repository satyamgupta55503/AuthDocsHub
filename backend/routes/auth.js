// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendOTP } = require("../services/twilioService");

const router = express.Router();

// ---------------------
// OTP Rate Limiting
// ---------------------
const OTP_WINDOW = parseInt(process.env.OTP_RATE_LIMIT_WINDOW || 60, 10) * 1000; // default 1 min
const OTP_MAX = parseInt(process.env.OTP_RATE_LIMIT_MAX || 3, 10);

const otpLimiter = rateLimit({
  windowMs: OTP_WINDOW,
  max: OTP_MAX,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
  keyGenerator: (req) => req.body.mobile_number || req.ip,
});

// ---------------------
// Generate OTP
// ---------------------
router.post(
  "/generateOTP",
  otpLimiter,
  [
    body("mobile_number")
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Please enter a valid mobile number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const { mobile_number } = req.body;

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Delete existing OTPs
      await OTP.deleteMany({ mobile_number });

      // Save new OTP
      const otpDoc = new OTP({
        mobile_number,
        otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        attempts: 0,
        verified: false,
      });
      await otpDoc.save();

      let otpSent = false;
      let responseOTP = null;

      // Send via Twilio if configured
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
          await sendOTP(mobile_number, otp);
          otpSent = true;
        } catch (error) {
          console.error("Twilio error:", error.message);
          responseOTP = otp; // fallback dev mode
        }
      } else {
        responseOTP = otp; // dev mode
      }

      res.json({
        success: true,
        message: otpSent ? "OTP sent successfully" : "OTP generated (dev mode)",
        otp: responseOTP, // only in dev mode
        expires_in: 300, // seconds
      });
    } catch (error) {
      console.error("Generate OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate OTP",
      });
    }
  }
);

// ---------------------
// Validate OTP
// ---------------------
router.post(
  "/validateOTP",
  [
    body("mobile_number")
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Please enter a valid mobile number"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const { mobile_number, otp } = req.body;

      const otpDoc = await OTP.findOne({
        mobile_number,
        verified: false,
        expires_at: { $gt: new Date() },
      });

      if (!otpDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      // Check attempts
      if (otpDoc.attempts >= 3) {
        await OTP.deleteOne({ _id: otpDoc._id });
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (otpDoc.otp !== otp) {
        otpDoc.attempts += 1;
        await otpDoc.save();
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
          attempts_remaining: 3 - otpDoc.attempts,
        });
      }

      // Mark OTP as verified
      otpDoc.verified = true;
      await otpDoc.save();

      // Find or create user
      let user = await User.findOne({ mobile_number });
      if (!user) {
        user = new User({
          mobile_number,
          name: `User ${mobile_number.slice(-4)}`,
          role: "user",
        });
        await user.save();
      }

      // Update last login
      user.last_login = new Date();
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user._id,
          mobile_number: user.mobile_number,
          role: user.role,
        },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({
        success: true,
        message: "OTP verified successfully",
        token,
        user: {
          id: user._id,
          mobile_number: user.mobile_number,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Validate OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to validate OTP",
      });
    }
  }
);

module.exports = router;
