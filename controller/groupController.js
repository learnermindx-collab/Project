import Group from "../models/group.js";
import Project from "../models/project.js";
import upload from "../middleware/upload.js";
import User from "../models/user.js";

// GET my group (for student)
export const getMyGroup = async (req, res) => {
  try {
    // Find project by leader
    const project = await Project.findOne({ leader: req.user._id })
      .populate('group', 'name description logo members membersInfo')
      .populate({
        path: 'group.members',
        select: 'name email _id'
      });

    if (!project || !project.group) {
      return res.json(null); // No group yet
    }

    // Populate membersInfo if not already
    const group = await Group.findById(project.group._id)
      .populate('members', 'name email _id')
      .select('name description logo members membersInfo project');

    // Ensure membersInfo is populated
    group.membersInfo = group.members.map(member => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email
    }));

    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load group" });
  }
};

// POST upload group logo
export const uploadGroupLogo = async (req, res) => {
  try {
    const groupId = req.params.id;
    const logoPath = req.file?.path;

    if (!logoPath) {
      return res.status(400).json({ message: "Logo file required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member or leader's project
    const project = await Project.findById(group.project).populate('leader');
    if (!project.leader._id.equals(req.user._id) && 
        !group.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.logo = logoPath;
    await group.save();

    res.json({ message: "Logo uploaded", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

