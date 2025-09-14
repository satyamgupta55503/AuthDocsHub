const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema(
  {
    mobile_number: {
      type: String,
      required: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid mobile number"],
    },
    otp: {
      type: String,
      required: true,
      length: 6,
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-delete expired OTPs
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("OTP", otpSchema)
