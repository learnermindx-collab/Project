import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    }
  ],
  membersInfo: [{
    id: String,
    name: String,
    email: String
  }],
}, {timestamps: true});

  export default mongoose.model('Group', groupSchema);