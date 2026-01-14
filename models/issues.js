import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
     user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true

    },
    severity:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    
   
}, {timestamps: true});