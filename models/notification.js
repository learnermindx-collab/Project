import mongoose from 'mongoose';

const notifSchema = new mongoose.Schema({
    userId:{
        type: String,
    },
    message: {
        type: String,
    },
    
})