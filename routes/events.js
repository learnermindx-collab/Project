import express from 'express';
import Event from '../models/events.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all events - returns events based on user role
router.get('/', auth, async (req, res) => {
  try {
    const userRole = req.user.role; // Get user's role from auth middleware (already lowercase)
    console.log('Fetching events for role:', userRole);
    
    // Find events where user's role is in notifyRoles OR user created the event
    const events = await Event.find({
      $or: [
        { notifyRoles: userRole },
        { createdBy: userRole }
      ]
    }).sort({ date: 1 }); // Sort by date ascending

    console.log('Found events:', events.length);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to load events' });
  }
});

// POST create new event
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, time, location, description, notifyRoles } = req.body;
    const userRole = req.user.role;

    const newEvent = new Event({
      title,
      date,
      time,
      location: location || 'TBD',
      description: description || '',
      notifyRoles: notifyRoles || ['HOD', 'Mentor', 'Student'],
      createdBy: userRole
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to create event' });
  }
});

// PUT update event
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, date, time, location, description, notifyRoles } = req.body;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, time, location, description, notifyRoles },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update event' });
  }
});

// DELETE event
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to delete event' });
  }
});

export default router;
