import express from "express";
import Issue from "../models/issues.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all issues (for HOD)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "hod") {
      return res.status(403).json({ message: "Access denied" });
    }
    const issues = await Issue.find().populate("user", "name email");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issues by user
router.get("/user", auth, async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new issue
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, severity } = req.body;
    const issue = new Issue({
      title,
      description,
      severity,
      user: req.user.id,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
