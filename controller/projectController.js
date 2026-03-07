// controllers/projectController.js
import Project from "../models/project.js";
import Notification from "../models/notification.js";

// GET my project
export const getMyProject = async (req, res) => {
  try {
    const project = await Project.findOne({ leader: req.user._id })
      .populate("feedbacks.by", "name email")
      .populate("supervisor", "name email")
      .populate("members", "name email")
      .populate("hodFeedback.by", "name email");

    if (!project) return res.json(null); // frontend handles null

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load project" });
  }
};

// POST submit or update project
export const submitProject = async (req, res) => {
  try {
    const { title, description, objectives } = req.body;
    const document = req.file?.path;

    if (!document) return res.status(400).json({ message: "Document required" });

    // Check if student already submitted
    const existing = await Project.findOne({ leader: req.user._id });
    if (existing) {
      // Update existing project
      existing.title = title;
      existing.description = description;
      existing.objectives = objectives;
      existing.document = document;
      // Reset status to submitted if it was rejected or something, but keep as is for now
      await existing.save();
      res.json(existing);
    } else {
      // Create new project
      const project = new Project({
        title,
        description,
        objectives,
        document,
        leader: req.user._id,
        status: "proposal_submitted",
      });

      await project.save();
      res.status(201).json(project);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed" });
  }
};

// POST add feedback (for supervisor)
export const addFeedback = async (req, res) => {
  try {
    const { projectId, text } = req.body;
    if (!text) return res.status(400).json({ message: "Feedback text required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.feedbacks.push({ text, by: req.user._id });
    await project.save();

    res.json({ message: "Feedback added", feedbacks: project.feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to add feedback" });
  }
};

// GET projects for supervisor
export const getSupervisorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ supervisor: req.user._id })
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("feedbacks.by", "name email")
      .sort({ submittedAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load supervisor projects" });
  }
};

// GET all projects for HOD
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("supervisor", "name email")
      .populate("feedbacks.by", "name email")
      .populate("hodFeedback.by", "name email")
      .sort({ submittedAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load all projects" });
  }
};

// POST assign supervisor to project (HOD)
export const assignSupervisor = async (req, res) => {
  try {
    const { projectId, supervisorId } = req.body;
    if (!projectId || !supervisorId) return res.status(400).json({ message: "Project ID and Supervisor ID required" });

    const project = await Project.findById(projectId).populate('leader', 'name');
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.supervisor = supervisorId;
    project.status = "under_review"; // Move to under review once assigned
    await project.save();

    // Create notification for supervisor
    const notification = new Notification({
      userId: supervisorId,
      fromUserId: req.user._id,
      message: `New project "${project.title}" assigned to you by HOD`,
      type: 'proposal',
      projectId: projectId
    });
    await notification.save();

    // Emit notification to supervisor
    const io = req.app.get('io');
    io.to(supervisorId).emit('notification', notification);

    res.json({ message: "Supervisor assigned", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to assign supervisor" });
  }
};

// POST approve project (supervisor) - now sets to supervisor_approved for HOD evaluation
export const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('leader', 'name');
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Set status to supervisor_approved - pending HOD evaluation
    project.status = "supervisor_approved";
    await project.save();

    // Create notification for student - supervisor approved, awaiting HOD
    const notification = new Notification({
      userId: project.leader._id,
      fromUserId: req.user._id,
      message: `Your project "${project.title}" has been approved by supervisor. Pending HOD evaluation.`,
      type: 'supervisor_approved',
      projectId: project._id
    });
    await notification.save();

    // Emit notification to student
    const io = req.app.get('io');
    io.to(project.leader._id.toString()).emit('notification', notification);

    // Notify HOD about project ready for evaluation via socket
    io.emit('hod_new_project', { project });

    res.json({ message: "Project approved by supervisor. Pending HOD evaluation.", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to approve project" });
  }
};

// POST reject project (supervisor)
export const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('leader', 'name');
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "rejected";
    await project.save();

    // Create notification for student
    const notification = new Notification({
      userId: project.leader._id,
      fromUserId: req.user._id,
      message: `Your project "${project.title}" has been rejected`,
      type: 'rejection',
      projectId: project._id
    });
    await notification.save();

    // Emit notification to student
    const io = req.app.get('io');
    io.to(project.leader._id).emit('notification', notification);

    res.json({ message: "Project rejected", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to reject project" });
  }
};

// POST evaluate project (HOD) - evaluate supervisor-approved projects
export const evaluateProject = async (req, res) => {
  try {
    const { decision, feedback } = req.body;
    // decision should be 'hod_approved' or 'hod_rejected'
    
    const project = await Project.findById(req.params.id).populate('leader', 'name');
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Verify project is in supervisor_approved status
    if (project.status !== "supervisor_approved") {
      return res.status(400).json({ message: "Project must be approved by supervisor before HOD evaluation" });
    }

    // Update project status based on HOD decision
    project.status = decision;
    
    // Add HOD feedback
    project.hodFeedback = {
      text: feedback,
      by: req.user._id,
      decision: decision,
      createdAt: new Date()
    };
    
    await project.save();

    // Create notification for student
    const notificationMessage = decision === "hod_approved" 
      ? `Your project "${project.title}" has been approved by HOD! Final approval granted.`
      : `Your project "${project.title}" has been rejected by HOD. Please check feedback.`;
    
    const notification = new Notification({
      userId: project.leader._id,
      fromUserId: req.user._id,
      message: notificationMessage,
      type: decision === "hod_approved" ? 'hod_approved' : 'hod_rejected',
      projectId: project._id
    });
    await notification.save();

    // Emit notification to student
    const io = req.app.get('io');
    io.to(project.leader._id.toString()).emit('notification', notification);

    const message = decision === "hod_approved" 
      ? "Project approved by HOD" 
      : "Project rejected by HOD";

    res.json({ message, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to evaluate project" });
  }
};
