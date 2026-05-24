import express from "express";
import User from "../models/user.js";
import Group from "../models/group.js";
import Project from "../models/project.js";
import Meeting from "../models/meeting.js";

const statsrouter = express.Router();
statsrouter.get("/stats", async (req, res) => {
  const [
    totalStudents,
    totalSupervisors,
    totalGroups,
    totalProjects,
    progressProjects,
    finishedProjects,
    upcomingMeetings,
    eventsWithinWeek
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "supervisor" }),
    Group.countDocuments(),
    Project.countDocuments(),
    Project.countDocuments({ status: "in_progress" }),
    Project.countDocuments({ status: "finished" }),
    Meeting.countDocuments({ scheduledAt: { $gt: new Date() } }),
    Meeting.countDocuments({
      scheduledAt: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
  ]);

  res.json({
    totalStudents,
    totalSupervisors,
    totalGroups,
    totalProjects,
    progressProjects,
    finishedProjects,
    upcomingMeetings,
    eventsWithinWeek
  });
});

export default statsrouter;