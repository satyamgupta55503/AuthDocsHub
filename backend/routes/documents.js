// routes/documents.js
const express = require("express");
const router = express.Router();
const Document = require("../models/Document"); // Your MongoDB model

// ---------------------
// Middleware
// ---------------------
router.use(express.json()); // Parse JSON

// ---------------------
// GET /api/documents
// Fetch all documents
// ---------------------
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json({ success: true, documents });
  } catch (error) {
    console.error("Fetch all documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ---------------------
// POST /api/documents
// Upload new document
// ---------------------
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const document = new Document({ title, content });
    await document.save();

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ---------------------
// GET /api/documents/:id
// Fetch single document by ID
// ---------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.json({ success: true, document });
  } catch (error) {
    console.error("Fetch document by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
