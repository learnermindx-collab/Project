import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    title: {
        type: String,
    },
    name:{
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    location:{
        type: String,
        default: '',
    },
    description: {
        type: String,
    },
    // Roles to be notified about the event
    notifyRoles: {
        type: [String],
        enum: ['hod', 'supervisor', 'student'],
        default: ['hod', 'supervisor', 'student']
    },
    // Created by role
    createdBy: {
        type: String,
        enum: ['hod', 'supervisor', 'student'],
        default: 'hod'
    }
    
}, {timestamps: true});

export default mongoose.model('Event', eventSchema);
