import express from "express";
import Discussion from "../models/discussions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all discussions (for HOD)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "hod") {
      return res.status(403).json({ message: "Access denied" });
    }
    const discussions = await Discussion.find().populate("user", "name").populate("meeting", "title").sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get discussions by user
router.get("/user", auth, async (req, res) => {
  try {
    const discussions = await Discussion.find({ user: req.user.id }).populate("meeting", "title").sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new discussion
router.post("/", auth, async (req, res) => {
  try {
    const { meeting, description } = req.body;
    const discussion = new Discussion({
      meeting,
      user: req.user.id,
      description,
    });
    await discussion.save();
    await discussion.populate("user", "name");
    await discussion.populate("meeting", "title");
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
