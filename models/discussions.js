import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
    meeting: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    description: {
        type: String,
    }
}, {timestamps: true});
export default mongoose.model('Discussion', discussionSchema);