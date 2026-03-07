/*
 * =============================================================
 * LEAVE MANAGEMENT APP — BACKEND SERVER
 * =============================================================
 *
 * DEPLOYMENT TOPOLOGY:
 *
 * ┌─────────────┐   HTTPS    ┌──────────────────────────────┐
 * │   Browser   │ ─────────► │  Vercel (Frontend)           │
 * │  (Client)   │            │  Vue.js 3 SPA                │
 * │             │            │  Served as static files      │
 * └─────────────┘            └──────────────┬───────────────┘
 *                                           │  HTTPS REST API calls
 *                                           │  via VITE_API_BASE_URL
 *                                           ▼
 *                            ┌──────────────────────────────┐
 *                            │  Railway (Backend)           │ ← YOU ARE HERE
 *                            │  Node.js 18 + Express.js     │
 *                            │  Stateless JWT auth          │
 *                            │  PORT assigned by Railway    │
 *                            └──────────────┬───────────────┘
 *                                           │  Mongoose ODM (TLS)
 *                                           ▼
 *                            ┌──────────────────────────────┐
 *                            │  MongoDB Atlas (M0 Free)     │
 *                            │  Cloud-hosted MongoDB        │
 *                            │  Network: 0.0.0.0/0          │
 *                            └──────────────────────────────┘
 *
 * AUTH FLOW:
 *   1. User logs in → server verifies credentials → issues JWT (7d expiry)
 *   2. Frontend stores JWT in localStorage
 *   3. Every API request includes: Authorization: Bearer <token>
 *   4. authMiddleware verifies token → attaches decoded payload to req.user
 *   5. roleCheck middleware restricts routes by role (employee/employer)
 *
 * SECURITY MIDDLEWARE STACK:
 *   - helmet:            Sets secure HTTP response headers
 *   - express-rate-limit: Limits to 100 requests per 15 min per IP (brute force protection)
 *   - cors:              Restricts origins to FRONTEND_URL in production
 *   - morgan:            HTTP request logger (dev mode only)
 *
 * API ENDPOINTS:
 *   POST   /api/auth/signup          Register new user
 *   POST   /api/auth/login           Login, returns JWT
 *   GET    /api/auth/me              Get current user (auth required)
 *   POST   /api/leaves               Apply for leave (employee only)
 *   GET    /api/leaves/my            Get own leave requests (employee only)
 *   GET    /api/leaves/all           Get all leave requests (employer only)
 *   PATCH  /api/leaves/:id/approve   Approve a leave (employer only)
 *   PATCH  /api/leaves/:id/reject    Reject a leave (employer only)
 *   GET    /api/health               Health check (public)
 * =============================================================
 */

require('dotenv').config()  // Must be first — loads .env before any other require

// Force Google DNS in development — fixes SRV lookup failures on some local networks
if (process.env.NODE_ENV !== 'production') {
    const dns = require('dns')
    dns.setServers(['8.8.8.8', '8.8.4.4'])
}

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const leaveRoutes = require('./routes/leaves')

// Connect to MongoDB Atlas on startup
connectDB()

const app = express()
const isProduction = process.env.NODE_ENV === 'production'

// Security: helmet sets secure HTTP headers (XSS, clickjacking, sniffing protection)
app.use(helmet())

// Logging: morgan logs HTTP requests — only in development to avoid log spam in production
if (!isProduction) {
    app.use(morgan('dev'))
}

// Rate limiting: prevents brute force attacks on auth and API routes
// Max 100 requests per IP per 15 minutes across all /api/* routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
})
app.use('/api', limiter)

// CORS: parse FRONTEND_URL as comma-separated list to support multiple origins
// e.g. FRONTEND_URL=https://myapp.vercel.app,http://localhost:5173
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, mobile apps)
        // Also allow if origin matches allowedOrigins list or wildcard is set
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())

// Health check — Railway uses healthcheckPath in railway.toml to verify service is up
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'LeaveManager API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Mount API route handlers
app.use('/api/auth', authRoutes)
app.use('/api/leaves', leaveRoutes)

// 404 handler — must come after all route definitions
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` })
})

// Global error handler — must have exactly 4 params for Express to treat it as error middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack)
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// Railway assigns PORT dynamically — never hardcode 5000 in production
// Bind to 0.0.0.0 so Railway's internal network can reach the process
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

module.exports = app  // exported for testability
