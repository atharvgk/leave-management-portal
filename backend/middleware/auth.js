// JWT authentication middleware.
// Extracts the Bearer token from the Authorization header,
// verifies it, and attaches the decoded payload to req.user.
// jwt.verify() is synchronous — do NOT make this function async.

const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded  // { id, role, name }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
}

module.exports = authMiddleware
