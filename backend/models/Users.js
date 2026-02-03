const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config(); 

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true, 
        unique: true, 
        trim:true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    timestamps: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
}
);

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}


const User = mongoose.model('User', userSchema);

module.exports = User;
// Load environment variables from .env file




