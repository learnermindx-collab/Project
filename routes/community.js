import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Message from "../models/message.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/community";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    /\.(jpg|jpeg|png|gif|webp)$/,
    /\.(mp4|webm|ogg)$/,
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/,
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowed = allowedTypes.some((regex) => regex.test(ext));
  
  if (isAllowed) cb(null, true);
  else cb(new Error("File type not allowed"));
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Get all messages (feed)
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .populate("author", "name role")
      .populate("likes", "_id")
      .populate("comments.author", "name role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments();

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread message count
router.get("/unread-count", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const lastSeen = user.lastSeenCommunity || new Date(0);
    
    const count = await Message.countDocuments({
      createdAt: { $gt: lastSeen },
      author: { $ne: req.user.id }
    });

    const myPosts = await Message.find({ author: req.user.id }).select('_id');
    const myPostIds = myPosts.map(p => p._id);
    
    const newComments = await Message.aggregate([
      { $match: { 
        _id: { $in: myPostIds },
        'comments.createdAt': { $gt: lastSeen }
      }},
      { $unwind: '$comments' },
      { $match: { 
        'comments.createdAt': { $gt: lastSeen },
        'comments.author': { $ne: req.user.id }
      }},
      { $count: 'count' }
    ]);

    const commentCount = newComments.length > 0 ? newComments[0].count : 0;

    res.json({ 
      unreadMessages: count,
      unreadComments: commentCount,
      totalUnread: count + commentCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as seen
router.post("/mark-seen", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { 
      lastSeenCommunity: new Date() 
    });
    res.json({ message: "Marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single message by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("author", "name role")
      .populate("likes", "_id name")
      .populate("comments.author", "name role");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new message with attachments
router.post("/", auth, upload.array("attachments", 5), async (req, res) => {
  try {
    const { content, isAnnouncement } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        let type = "document";
        
        if (/\.(jpg|jpeg|png|gif|webp)$/.test(ext)) {
          type = "image";
        } else if (/\.(mp4|webm|ogg)$/.test(ext)) {
          type = "video";
        }

        attachments.push({
          type,
          url: `/uploads/community/${file.filename}`,
          filename: file.filename,
          originalName: file.originalname,
        });
      });
    }

    const message = new Message({
      author: req.user.id,
      content: content.trim(),
      attachments,
      isAnnouncement: isAnnouncement === "true" || isAnnouncement === true,
    });

    await message.save();
    await message.populate("author", "name role");

    const io = req.app.get("io");
    if (io) {
      io.emit("new-message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update message
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this message" });
    }

    if (content) {
      message.content = content.trim();
    }

    await message.save();
    await message.populate("author", "name role");

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.author.toString() !== req.user.id && req.user.role !== "hod") {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        const filePath = path.join(".", attachment.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await message.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.emit("delete-message", req.params.id);
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike message
router.post("/:id/like", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const userId = req.user.id;
    const likeIndex = message.likes.indexOf(userId);

    if (likeIndex > -1) {
      message.likes.splice(likeIndex, 1);
    } else {
      message.likes.push(userId);
    }

    await message.save();
    await message.populate("author", "name role");
    await message.populate("likes", "_id name");

    const io = req.app.get("io");
    if (io) {
      io.emit("update-likes", {
        messageId: message._id,
        likes: message.likes,
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to message
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const comment = {
      author: req.user.id,
      content: content.trim(),
      createdAt: new Date()
    };

    message.comments.push(comment);
    message.commentCount = message.comments.length;
    await message.save();

    await message.populate("author", "name role");
    await message.populate("comments.author", "name role");

    const io = req.app.get("io");
    if (io) {
      io.emit("new-comment", {
        messageId: message._id,
        comment: message.comments[message.comments.length - 1],
        commentCount: message.commentCount
      });
      
      if (message.author.toString() !== req.user.id) {
        io.to(message.author.toString()).emit("community-notification", {
          type: "comment",
          message: `New comment on your post`,
          postId: message._id,
          authorName: req.user.name
        });
      }
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const comment = message.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id && 
        message.author.toString() !== req.user.id && 
        req.user.role !== "hod") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    message.comments = message.comments.filter(c => c._id.toString() !== req.params.commentId);
    message.commentCount = message.comments.length;
    await message.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("delete-comment", {
        messageId: message._id,
        commentId: req.params.commentId,
        commentCount: message.commentCount
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

