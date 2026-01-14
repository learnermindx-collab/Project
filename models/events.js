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
    }
    ,date: {
        type: String,
    },
    time: {
        type: String,
    },
    location:{
        type: String,
        default: '',

    },description: {
        type: String,
    }
    
}, {timestamps: true});

export default mongoose.model('Event', eventSchema);