import express from "express";
import {
  getMyProject,
  submitProject,
  addFeedback,
  getSupervisorProjects,
  getAllProjects,
  assignSupervisor,
  approveProject,
  rejectProject,
  evaluateProject
} from "../controller/projectController.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";
import requireRole from "../middleware/role.js";

const projectRouter = express.Router();

// Student routes
projectRouter.get("/my", authMiddleware, requireRole("student"), getMyProject);
projectRouter.post("/", authMiddleware, requireRole("student"), upload.single("document"), submitProject);

// Supervisor routes
projectRouter.get("/supervisor", authMiddleware, requireRole("supervisor"), getSupervisorProjects);
projectRouter.post("/feedback", authMiddleware, requireRole("supervisor"), addFeedback);
projectRouter.post("/:id/approve", authMiddleware, requireRole("supervisor"), approveProject);
projectRouter.post("/:id/reject", authMiddleware, requireRole("supervisor"), rejectProject);

// HOD routes
projectRouter.get("/all", authMiddleware, requireRole("hod"), getAllProjects);
projectRouter.post("/assign-supervisor", authMiddleware, requireRole("hod"), assignSupervisor);
projectRouter.post("/:id/evaluate", authMiddleware, requireRole("hod"), evaluateProject);

export default projectRouter;
