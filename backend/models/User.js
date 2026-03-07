// User model: stores employee and employer accounts.
// Passwords are stored hashed (bcrypt) — never plaintext.
// Email is stored lowercase + trimmed to prevent duplicate accounts.
// timestamps: true auto-creates createdAt and updatedAt fields.

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: {
            values: ['employee', 'employer'],
            message: 'Role must be employee or employer'
        },
        required: [true, 'Role is required']
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
