import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String
  },
  originalName: {
    type: String
  }
}, { _id: true });

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [attachmentSchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  commentCount: {
    type: Number,
    default: 0
  },
  isAnnouncement: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for efficient querying
messageSchema.index({ createdAt: -1 });
messageSchema.index({ author: 1 });

export default mongoose.model('Message', messageSchema);

