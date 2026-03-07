import mongoose from 'mongoose';

const notifSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'proposal', 
            'acceptance', 
            'rejection', 
            'completion', 
            'event',
            'supervisor_approved',
            'hod_approved',
            'hod_rejected',
            'hod_evaluation'
        ],
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    eventTitle: {
        type: String,
    },
    eventDate: {
        type: String,
    },
    eventTime: {
        type: String,
    },
    eventLocation: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notifSchema);
export default Notification;
