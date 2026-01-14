// import express from "express";
// import Project from "../models/project.js";
// import auth from "../auth.js";
// import multer from "multer";


// // routes/projects.js
// router.post("/", auth("student"), upload.single("document"), async (req,res)=>{
//   const project = await Project.create({
//     ...req.body,
//     document: req.file.path,
//     leader: req.user.id,
//     status: "proposal_submitted"
//   });
//   res.status(201).json(project);
// });


// // supervisor-dashboard
// rout.get("/supervisor", auth("supervisor"), async (req,res)=>{
//   const projects = await Project.find({ supervisor: req.user.id })
//     .populate("leader", "name email");
//   res.json(projects);
// });

// //supervisor-feedback
// router.post("/:id/feedback", auth("supervisor"), async (req,res)=>{
//   const project = await Project.findById(req.params.id);
//   project.feedbacks.push({
//     text: req.body.text,
//     by: req.user.id
//   });
//   project.status = "under_review";
//   await project.save();
//   res.json(project);
// });


// //approve/reject

// router.post("/:id/approve", auth("supervisor"), async (req,res)=>{
//   await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
//   res.sendStatus(200);
// });

// router.post("/:id/reject", auth("supervisor"), async (req,res)=>{
//   await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
//   res.sendStatus(200);
// });

// export default projectrout;











// import express from "express";
// import Project from "../models/project.js";
// //import requireRole from "../middeware/role.js";
// import multer from "multer";

// const router = express.Router();

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });


// // Student submits proposal
// router.post("/", auth("student"), upload.single("document"), async (req, res) => {
//   try {
//     const project = await Project.create({
//       title: req.body.title,
//       description: req.body.description,
//       objectives: req.body.objectives,
//       document: req.file.path,
//       leader: req.user.id,
//       status: "proposal_submitted",
//     });

//     res.status(201).json(project);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Project creation failed" });
//   }
// });


// // Student fetches own project
// router.get("/my", auth("student"), async (req, res) => {
//   const project = await Project.findOne({ leader: req.user.id });
//   res.json(project);
// });


// // Supervisor dashboard
// router.get("/supervisor", auth("supervisor"), async (req, res) => {
//   const projects = await Project.find({ supervisor: req.user.id })
//     .populate("leader", "name email");

//   res.json(projects);
// });


// // Supervisor feedback
// router.post("/:id/feedback", auth("supervisor"), async (req, res) => {
//   const project = await Project.findById(req.params.id);
//   project.feedbacks.push({
//     text: req.body.text,
//     by: req.user.id,
//   });
//   project.status = "under_review";
//   await project.save();
//   res.json(project);
// });


// // Approve / Reject
// router.post("/:id/approve", auth("supervisor"), async (req, res) => {
//   await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
//   res.sendStatus(200);
// });

// router.post("/:id/reject", auth("supervisor"), async (req, res) => {
//   await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
//   res.sendStatus(200);
// });

// export default router;




// import express from "express";
// import Project from "../models/project.js";
// import multer from "multer";
// import requireRole from "../middleware/role.js";

// const router = express.Router();

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// router.post("/", requireRole("student"), upload.single("document"), async (req, res) => {
//   try {
//     const project = await Project.create({
//       title: req.body.title,
//       description: req.body.description,
//       objectives: req.body.objectives,
//       document: req.file.path,
//       leader: req.user._id,
//       status: "proposal_submitted",
//     });
//     res.status(201).json(project);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Project creation failed" });
//   }
// });

// router.get("/my", requireRole("student"), async (req, res) => {
//   const project = await Project.findOne({ leader: req.user._id });
//   res.json(project);
// });

// router.get("/supervisor", requireRole("Supervisor"), async (req, res) => {
//   const projects = await Project.find({ supervisor: req.user._id }).populate("leader", "name email");
//   res.json(projects);
// });

// router.post("/:id/feedback", requireRole("Supervisor"), async (req, res) => {
//   const project = await Project.findById(req.params.id);
//   project.feedbacks.push({ text: req.body.text, by: req.user._id });
//   project.status = "under_review";
//   await project.save();
//   res.json(project);
// });

// router.post("/:id/approve", requireRole("Supervisor"), async (req, res) => {
//   await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
//   res.sendStatus(200);
// });

// router.post("/:id/reject", requireRole("Supervisor"), async (req, res) => {
//   await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
//   res.sendStatus(200);
// });

// export default router;



import express from "express";
import Project from "../models/project.js";
import multer from "multer";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/role.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Student
router.post("/", auth, requireRole("student"), upload.single("document"), async (req, res) => {
  const project = await Project.create({
    ...req.body,
    document: req.file.path,
    leader: req.user._id,
    status: "proposal_submitted",
  });
  res.status(201).json(project);
});

router.get("/my", auth, requireRole("student"), async (req, res) => {
  const project = await Project.findOne({ leader: req.user._id });
  res.json(project);
});

// Supervisor
router.get("/supervisor", auth, requireRole("Supervisor"), async (req, res) => {
  const projects = await Project.find({ supervisor: req.user._id });
  res.json(projects);
});

router.post("/:id/feedback", auth, requireRole("Supervisor"), async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.feedbacks.push({ text: req.body.text, by: req.user._id });
  project.status = "under_review";
  await project.save();
  res.json(project);
});

router.post("/:id/approve", auth, requireRole("Supervisor"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.sendStatus(200);
});

router.post("/:id/reject", auth, requireRole("Supervisor"), async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.sendStatus(200);
});

export default router;
