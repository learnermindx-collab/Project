import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
  tokenHash: String,
  expiresAt: Date,
  attempts: { type: Number, default: 0 }
}, { _id: false });


const userSchema = new mongoose.Schema({
    name : {
        type: String, required: true
    },
    email: {
        type: String, required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address!'],
    set: v => v.trim(),  
    },
    password: {
        type: String,
        required: function(){
            return this.isPasswordSet;
        },
        minlength : 6,
    },
    role: {
        type: String, enum: ['hod', 'student', 'supervisor'],
        set: v => v?.toLowerCase?.(),
    },
    tokenVersion: {
        type: Number, default: 0,
    },
    isPasswordSet: {
        type: Boolean, default: true,
    },
    passwordReset: PasswordResetSchema,
    githubUsername: {
        type: String,
        default: '',
    },
    lastSeenCommunity: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
//export default mongoose.model('User', userSchema);
