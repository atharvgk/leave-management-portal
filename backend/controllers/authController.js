// Auth controller: handles user registration and login.
// Validation is done manually (no external library) so the code is easy to explain.
// Duplicate email returns 409 Conflict (not 400) to distinguish it from other errors.
// Passwords are never returned in any response.

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

// Generates a JWT containing id, role, and name.
// Email is intentionally excluded — we fetch it from DB when needed.
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Step 1: Check all required fields are present
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        // Step 2: Field-level validation
        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters' })
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }
        if (!['employee', 'employer'].includes(role)) {
            return res.status(400).json({ message: 'Role must be employee or employer' })
        }
        // Step 3: Check for duplicate email — 409 Conflict
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' })
        }
        // Step 4: Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        })
        // Step 5: Return JWT + user info (no password)
        const token = generateToken(user)
        return res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        console.error('Signup error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }
        // Intentionally vague error ("Invalid credentials") to prevent user enumeration
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const token = generateToken(user)
        return res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        console.error('Login error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.getMe = async (req, res) => {
    try {
        // req.user is set by authMiddleware after verifying JWT
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ user })
    } catch (err) {
        console.error('GetMe error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}
