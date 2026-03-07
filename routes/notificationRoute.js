import express from 'express';
import Notification from '../models/notification.js';
import Event from '../models/events.js';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET notifications for user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('fromUserId', 'name email')
      .populate('projectId', 'title')
      .sort({ timestamp: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to load notifications' });
  }
});

// POST create event notification for specified roles
// This also saves the event to the database
router.post('/event', auth, async (req, res) => {
  try {
    const { eventTitle, eventDate, eventTime, eventLocation, notifyRoles, createdBy, eventDescription } = req.body;
    
    // Use lowercase roles to match user model
    const normalizedNotifyRoles = notifyRoles ? notifyRoles.map(r => r.toLowerCase()) : ['hod', 'supervisor', 'student'];
    const normalizedCreatedBy = createdBy ? createdBy.toLowerCase() : req.user.role;

    // First, save the event to the database
    const newEvent = new Event({
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation || 'TBD',
      description: eventDescription || '',
      notifyRoles: normalizedNotifyRoles,
      createdBy: normalizedCreatedBy
    });

    const savedEvent = await newEvent.save();
    console.log('Event saved to database:', savedEvent);

    // Find users by role (using lowercase roles to match user model)
    const users = await User.find({ role: { $in: normalizedNotifyRoles } });
    console.log(`Found ${users.length} users to notify`);
    console.log('Notifying roles:', normalizedNotifyRoles);

    // Get io object for real-time notifications
    const io = req.app.get('io');

    // Create notifications for each user in the specified roles and emit real-time events
    const notifications = await Promise.all(
      users.map(async (user) => {
        const notification = new Notification({
          userId: user._id.toString(),
          fromUserId: req.user._id.toString(),
          message: `New event "${eventTitle}" has been scheduled for ${eventDate} at ${eventTime}`,
          type: 'event',
          eventId: savedEvent._id,
          eventTitle,
          eventDate,
          eventTime,
          eventLocation,
        });
        
        // Save notification to database
        const savedNotification = await notification.save();
        
        // Emit real-time notification to the specific user
        if (io) {
          io.to(user._id.toString()).emit('notification', savedNotification);
          console.log(`Emitted notification to user ${user._id}`);
        }
        
        return savedNotification;
      })
    );

    res.status(201).json({ 
      message: 'Event created and notifications sent', 
      event: savedEvent,
      count: notifications.length 
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Unable to create event and notifications' });
  }
});

// PUT mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    if (notification.userId !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to mark notification as read' });
  }
});

// PUT mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to mark notifications as read' });
  }
});

export default router;
