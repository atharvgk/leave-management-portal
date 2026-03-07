# LeaveManager — Employee Leave Management System

## Live Demo

- **Frontend (Vercel):** https://leave-management-portal-phi.vercel.app
- **Backend API (Railway):** https://leave-management-portal-production.up.railway.app
- **Health Check:** https://leave-management-portal-production.up.railway.app/api/health

## Demo Accounts

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Employee | employee@test.com   | password123 |
| Employer | manager@test.com    | password123 |

## Overview

LeaveManager is a full-stack web application for managing employee leave requests. Employees can sign up, log in, apply for leave (specifying leave type, dates, and reason), and track the status of their applications. Employers can view all employee leave requests and approve or reject them. The application features JWT-based authentication, role-based access control, and a clean, responsive UI.

## Tech Stack

| Layer      | Technology                                                    |
|------------|---------------------------------------------------------------|
| Frontend   | Vue.js 3 (Composition API), Tailwind CSS, Pinia, Vue Router 4, Axios, Vite |
| Backend    | Node.js 18, Express.js                                       |
| Database   | MongoDB Atlas (M0 free tier)                                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs                                 |
| Security   | helmet (HTTP headers), express-rate-limit (brute force protection), morgan (logging) |
| Deployment | Vercel (frontend), Railway (backend)                          |

## Deployment Topology

```
┌─────────────┐   HTTPS    ┌──────────────────────────────┐
│   Browser   │ ─────────► │  Vercel (Frontend)           │
│  (Client)   │            │  Vue.js 3 SPA                │
│             │            │  Served as static files      │
└─────────────┘            └──────────────┬───────────────┘
                                          │  HTTPS REST API calls
                                          │  via VITE_API_BASE_URL
                                          ▼
                           ┌──────────────────────────────┐
                           │  Railway (Backend)           │
                           │  Node.js 18 + Express.js     │
                           │  Stateless JWT auth          │
                           │  PORT assigned by Railway    │
                           └──────────────┬───────────────┘
                                          │  Mongoose ODM (TLS)
                                          ▼
                           ┌──────────────────────────────┐
                           │  MongoDB Atlas (M0 Free)     │
                           │  Cloud-hosted MongoDB        │
                           │  Network: 0.0.0.0/0          │
                           └──────────────────────────────┘
```

- **Vercel** serves the Vue.js 3 SPA as static files with instant global CDN delivery.
- **Railway** runs the Express.js API server, handling authentication, leave CRUD, and business logic.
- **MongoDB Atlas** stores user accounts and leave request documents in a cloud-hosted MongoDB cluster.

## Features

### Core Features

- Employee signup and login
- Apply for leave (leave type, start date, end date, reason)
- View leave status (Pending / Approved / Rejected) with duration in days
- Employer can view all employee leave requests
- Employer can approve or reject pending leave requests

### Bonus Features

- JWT-based authentication (7-day expiry, auto-logout on token expiry)
- Role-based access control (RBAC) — Employee vs Employer
- Input validation on both frontend and backend
- Duplicate / overlapping date prevention
- Status filter dropdown on employer dashboard (All / Pending / Approved / Rejected)
- Leave duration calculation (inclusive days shown in table)
- Security: Helmet HTTP headers + Rate limiting (100 req/15min/IP)
- Request logging with Morgan (development mode)
- MongoDB query indexes on `employeeId` and `status` for performance
- Prevents employer from approving/rejecting their own leave request
- Demo credentials shown on login page for fast reviewer testing
- Responsive design — works on desktop and mobile

## Project Structure

```
leave-management-portal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── roleCheck.js           # RBAC middleware (employee/employer)
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, role)
│   │   └── LeaveRequest.js        # Leave request schema with indexes
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, getMe
│   │   └── leaveController.js     # Apply, getMyLeaves, getAllLeaves, approve, reject
│   ├── routes/
│   │   ├── auth.js                # Auth route definitions
│   │   └── leaves.js              # Leave route definitions
│   ├── .env.example               # Environment variable template
│   ├── .gitignore
│   ├── railway.toml               # Railway deployment config
│   ├── nixpacks.toml              # Nixpacks build config (Node.js 18)
│   ├── server.js                  # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico            # Minimal 1x1 transparent ICO
│   │   └── _redirects             # Netlify SPA fallback
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.vue         # Top navigation bar
│   │   │   ├── LeaveForm.vue      # Leave application form
│   │   │   ├── LeaveTable.vue     # Reusable leave requests table
│   │   │   └── StatusBadge.vue    # Status badge component
│   │   ├── views/
│   │   │   ├── Login.vue          # Login page
│   │   │   ├── Signup.vue         # Signup page
│   │   │   ├── EmployeeDashboard.vue  # Employee dashboard
│   │   │   └── EmployerDashboard.vue  # Employer dashboard
│   │   ├── router/
│   │   │   └── index.js           # Vue Router with RBAC guards
│   │   ├── store/
│   │   │   └── auth.js            # Pinia auth store
│   │   ├── services/
│   │   │   └── api.js             # Axios API service
│   │   ├── App.vue                # Root component
│   │   ├── style.css              # Tailwind CSS directives
│   │   └── main.js                # App entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── vercel.json                # Vercel SPA routing
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## Local Development Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free M0 cluster)
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` — fill in your `MONGO_URI` and `JWT_SECRET`:
   ```env
   MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/leavemanager?retryWrites=true&w=majority
   JWT_SECRET=your_random_secure_jwt_secret_here_minimum_32_chars
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Server starts on http://localhost:5000

7. Test the health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. App opens at http://localhost:5173

5. No `.env` needed for local development — Vite proxy forwards `/api` requests to `localhost:5000`

## MongoDB Atlas Setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create an M0 free cluster
3. Create a database user (username + password)
4. Navigate to **Network Access** → Add IP Address: `0.0.0.0/0` (allow all — required for Railway)
5. Get connection string: **Clusters** → **Connect** → **Drivers** → copy the URI
6. Replace `<password>` in the URI with your database user password
7. Paste the URI as `MONGO_URI` in `backend/.env`

## API Endpoints

| Method | Endpoint                   | Auth | Role     | Description              |
|--------|----------------------------|------|----------|--------------------------|
| POST   | `/api/auth/signup`         | No   | Any      | Register new user        |
| POST   | `/api/auth/login`          | No   | Any      | Login, returns JWT       |
| GET    | `/api/auth/me`             | Yes  | Any      | Get current user info    |
| POST   | `/api/leaves`              | Yes  | Employee | Apply for leave          |
| GET    | `/api/leaves/my`           | Yes  | Employee | Get own leave requests   |
| GET    | `/api/leaves/all`          | Yes  | Employer | Get all leave requests   |
| PATCH  | `/api/leaves/:id/approve`  | Yes  | Employer | Approve leave request    |
| PATCH  | `/api/leaves/:id/reject`   | Yes  | Employer | Reject leave request     |
| GET    | `/api/health`              | No   | Any      | Health check             |

## Environment Variables

### Backend (.env)

| Variable      | Description                           | Example                           |
|---------------|---------------------------------------|-----------------------------------|
| `MONGO_URI`   | MongoDB Atlas connection string       | `mongodb+srv://...`               |
| `JWT_SECRET`  | Secret for signing JWT tokens         | Any random 32+ char string        |
| `PORT`        | Server port (auto-set by Railway)     | `5000`                            |
| `FRONTEND_URL`| Allowed CORS origin(s)                | `https://yourapp.vercel.app`      |
| `NODE_ENV`    | Environment mode                      | `production`                      |

### Frontend (.env — production only)

| Variable           | Description                  | Example                                      |
|--------------------|------------------------------|----------------------------------------------|
| `VITE_API_BASE_URL`| Railway backend API URL      | `https://yourapp.up.railway.app/api`         |

## Deployment Instructions

### Deploy Backend to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Select your repo → set **Root Directory** to `backend`
4. Add environment variables in the Railway dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a random secure string (32+ characters)
   - `FRONTEND_URL` — your Vercel frontend URL (set after frontend deploy)
   - `NODE_ENV` — `production`
5. Railway auto-deploys. Copy the generated URL (e.g., `https://xxx.up.railway.app`)
6. Test: `GET https://xxx.up.railway.app/api/health`

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → **Import GitHub repo**
2. Set **Framework Preset**: `Vite`
3. Set **Root Directory**: `frontend`
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-railway-url.up.railway.app/api`
5. Deploy. Copy the Vercel URL.
6. Go back to Railway → update `FRONTEND_URL` to your Vercel URL
7. Redeploy backend (or Railway redeploys automatically on env change)

## Architecture Notes

- **Stateless JWT Auth**: The backend does not use server-side sessions. Each request carries a JWT in the `Authorization` header. This makes the API horizontally scalable — any server instance can verify the token independently.

- **Token Storage**: JWT is stored in `localStorage` for persistence across page reloads. The Pinia auth store rehydrates from `localStorage` on app startup to prevent flash of unauthenticated UI.

- **Axios Interceptor**: The response interceptor catches 401 errors globally. If a token expires or becomes invalid, the user is automatically redirected to the login page. The interceptor checks the current pathname to prevent redirect loops when already on `/login`.

- **CORS Restriction**: In production, CORS is restricted to the `FRONTEND_URL` environment variable. This prevents unauthorized domains from making API requests. The server supports comma-separated origins for multi-domain setups.

- **Rate Limiting & Helmet**: `express-rate-limit` caps requests at 100 per IP per 15 minutes across all `/api` routes, protecting against brute force attacks. `helmet` sets secure HTTP headers (XSS protection, clickjacking prevention, MIME type sniffing prevention).

- **MongoDB Indexes**: The `LeaveRequest` model defines compound indexes on `employeeId` and `status`. These indexes significantly improve query performance for the employee dashboard (filter by `employeeId`) and employer dashboard (filter by `status`).

- **Date Handling**: All date comparisons use ISO string format (`YYYY-MM-DD`) to avoid timezone-related bugs. HTML date inputs send strings, and `new Date()` creates local time — normalizing both to ISO strings ensures consistent comparison.

## License

This project is for educational and demonstration purposes.
