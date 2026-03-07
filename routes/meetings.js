import express from "express";
import Meeting from "../models/meeting.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get meetings for student (meetings where student is participant)
router.get("/student", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      participants: req.user.id,
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meetings for mentor/supervisor (meetings they created or are assigned to)
router.get("/mentor", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { createdBy: req.user.id },
        { participants: req.user.id }
      ],
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all meetings (for HOD)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "hod") {
      return res.status(403).json({ message: "Access denied" });
    }
    const meetings = await Meeting.find().populate("createdBy", "name").populate("participants", "name").sort({ scheduledAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new meeting
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, scheduledAt, participants } = req.body;
    const meeting = new Meeting({
      title,
      description,
      scheduledAt,
      createdBy: req.user.id,
      participants,
    });
    await meeting.save();
    await meeting.populate("createdBy", "name");
    await meeting.populate("participants", "name");
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
