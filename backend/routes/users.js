const express = require("express");
const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// 🔹 Get all users
router.get("/", async (req, res) => {
  try {
    // TODO: Replace with DB fetch logic
    res.json({ success: true, message: "Fetched all users!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
});

// 🔹 Create new user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }
    // TODO: Save user to DB
    res.json({ success: true, message: "User created successfully!", user: { name, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
  }
});

// 🔹 Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Fetch user from DB by ID
    res.json({ success: true, message: `User fetched with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
  }
});

module.exports = router;
