import mongoose from 'mongoose';

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
        type: String, enum: ['HOD','student' ,'Supervisor'],
    },
    isPasswordSet: {
        type: Boolean, default: true,
    }
    


});
export default mongoose.models.user || mongoose.model('User', userSchema);
//export default mongoose.model('User', userSchema);