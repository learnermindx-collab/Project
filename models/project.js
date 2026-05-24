// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true},
//     status : {
//         type: String,
//         enum: ['in progress', 'finished', 'not started'],
//         default: 'not stated',
//     },
//     group:{
//         type: mongoose.Schema.Types.ObjectId, ref: 'Group'
//     },
//     leader: {
//         type: mongoose.Schema.Types.ObjectId, ref: 'User',
//         required: true,
//     },
//     members: [{
//         type: mongoose.Schema.Types.ObjectId, ref: 'User'
//     }],
//     supervisor: {
//         type: mongoose.Schema.Types.ObjectId, ref: 'User'
//     },
//     image: {
//         type: String,
//         default: ' ',
//     },
//     description: {
//         type: String,
//         default: ' ',   
//         required: true,
//     },
//     objectives: {
//         type: String,
//         default: ' ',
//         required: true,
//     },
//     document: {
//         type: String,
//         required: true,
//     },
// }, {timestamps: true});

// export default mongoose.model('Project', projectSchema);

import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  text: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, required: true },
  objectives: { type: String, required: true },
  document: { type: String, required: true },

  status: {
    type: String,
    enum: [
      "proposal_submitted", 
      "under_review", 
      "supervisor_approved",  // Approved by supervisor, pending HOD evaluation
      "approved",            // Legacy - keep for compatibility
      "rejected",            // Rejected by supervisor
      "hod_approved",        // Final approval by HOD
      "hod_rejected",        // Rejected by HOD after supervisor approval
      "in_progress", 
      "completed"
    ],
    default: "proposal_submitted"
  },

  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
  },

  hodFeedback: {
    text: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decision: { type: String, enum: ["hod_approved", "hod_rejected"] },
    createdAt: { type: Date, default: Date.now }
  },

  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  feedbacks: [feedbackSchema],

  submittedAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
