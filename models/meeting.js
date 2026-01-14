import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId, ref:'Project',
        required: true
    },
    scheduledAt: {
        type: Date, required: true
    },
    type: String,

}, {timestamps: true});
export default mongoose.model('Meeting', meetingSchema);