const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    original_name: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
    },
    mime_type: {
      type: String,
      required: true,
    },
    major_head: {
      type: String,
      required: true,
      enum: ["Personal", "Professional"],
    },
    minor_head: {
      type: String,
      required: true,
    },
    tags: [
      {
        tag_name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    remarks: {
      type: String,
      trim: true,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upload_date: {
      type: Date,
      default: Date.now,
    },
    gridfs_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for efficient searching
documentSchema.index({ major_head: 1, minor_head: 1 })
documentSchema.index({ "tags.tag_name": 1 })
documentSchema.index({ uploaded_by: 1 })
documentSchema.index({ upload_date: -1 })

module.exports = mongoose.model("Document", documentSchema)
