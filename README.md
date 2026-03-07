# LeaveManager - Employee Leave Management System

## Submission Details

- **Frontend Live URL (Vercel):** https://leave-management-portal-phi.vercel.app
- **Backend API Live URL (Railway):** https://leave-management-portal-production.up.railway.app
- **API Health Check:** https://leave-management-portal-production.up.railway.app/api/health

### Demo Accounts

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Employee | employee@test.com   | password123 |
| Employer | manager@test.com    | password123 |

---

## Objective

A basic web application built for an internship assignment where employees can apply for leave and employers can approve or reject those requests.

## Core Features

- Employees can sign up and log in.
- Employees can apply for leave by providing a leave type, start date, end date, and reason.
- Employees can view the status of their leave applications (Pending, Approved, or Rejected).
- Employers can sign up, log in, view all employee leave requests, and approve or reject those requests.

## Tech Stack (Mandatory)

The application strictly adheres to the requested technology stack:

- **Frontend:** Vue.js 3 and Tailwind CSS.
- **Backend:** Node.js 18 with Express.js, exposing REST APIs.
- **Database:** MongoDB Atlas (M0 Free Tier cluster).

## Deployment Requirement

The application is fully hosted on free cloud platforms and is accessible via public URLs.

- **Frontend Hosting:** Vercel (serves the Vue.js SPA as static assets).
- **Backend Hosting:** Railway (runs the Node.js/Express server).
- **Database:** MongoDB Atlas (Cloud-hosted database).

## Basic Requirements

- **Simple and Functional User Interface:** UI is fully functional, clean, and responsive, with a distinct and optimized application flow.
- **Clean and Readable Code:** The backend follows the MVC design pattern (Models, Controllers, Routes) with a proper folder structure for high readability. The frontend is component-based with separated views, components, and services.
- **Environment Variables:** All sensitive data such as the MongoDB connection string (`MONGO_URI`) and JWT keys (`JWT_SECRET`) are securely loaded via `.env` files.
- **Basic Error Handling:** Every API endpoint utilizes `try/catch` blocks and returns standard HTTP status codes (400, 401, 403, 404, 500) with proper JSON error message payloads.

## Optional (Bonus Points) Implemented

- **JWT-Based Authentication:** Employs stateless, secure token-based authentication.
- **Role-Based Access Control (RBAC):** Backend middleware prevents employees from accessing employer endpoints (e.g., approving leaves) and restricts employers from approving their own leaves.
- **Basic Input Validation:** Enforced on both frontend forms and backend controllers. Includes required field checks and chronological date validation (e.g., ensuring the start date is not in the past and the end date is on or after the start date).
- **Well-Written README:** This document serves as the comprehensive setup, API, and deployment guide.

## Use of AI Tools & Code Explanation

AI assistants were utilized to accelerate development, refine the user interface, and ensure robust error handling. However, the architecture and logic were strictly guided and are fully understood:

**Code Structure and Flow:**
1. A user logs in via the Vue.js frontend, and the Node.js backend verifies their password against a bcrypt hash in MongoDB.
2. The server issues a JSON Web Token (JWT) that the frontend stores in Pinia (state management) and localStorage for persistence.
3. Subsequent requests (like fetching leaves or approving a request) append the JWT to the Authorization header.
4. Express middleware intercepts these requests, verifies the JWT signature, and extracts the user's role (employee or employer).
5. The specific controller logic executes the database query via the Mongoose layer and returns a JSON response.

**Deployment Topology:**
The browser interacts exclusively with Vercel for static HTML/JS/CSS files. REST API requests made from the browser are routed to the Railway backend instance via HTTPS, which communicates directly with the MongoDB Atlas cluster over a secure TLS connection.

---

## Project Setup Steps

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free M0 cluster)
- Git

### Database Setup
1. Create a free M0 cluster on MongoDB Atlas.
2. In Network Access, whitelist all IPs (`0.0.0.0/0`) for Railway deployment compatibility.
3. Obtain your connection string URI and substitute your database user password.

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy the environment template: `cp .env.example .env`
4. Update `.env` with your `MONGO_URI` and `JWT_SECRET`. Set `FRONTEND_URL=http://localhost:5173`.
5. Start development server: `npm run dev` (Runs on port 5000).

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the application locally at `http://localhost:5173`.

---

## API Endpoint Details

| Method | Endpoint                   | Auth Required | Role Allowed | Description                        |
|--------|----------------------------|---------------|--------------|------------------------------------|
| POST   | `/api/auth/signup`         | No            | Any          | Register a new user account        |
| POST   | `/api/auth/login`          | No            | Any          | Authenticate user and return JWT   |
| GET    | `/api/auth/me`             | Yes           | Any          | Retrieve logged-in user details    |
| POST   | `/api/leaves`              | Yes           | Employee     | Submit a new leave request         |
| GET    | `/api/leaves/my`           | Yes           | Employee     | Fetch current employee's leaves    |
| GET    | `/api/leaves/all`          | Yes           | Employer     | Fetch all employee leave requests  |
| PATCH  | `/api/leaves/:id/approve`  | Yes           | Employer     | Approve a specific leave request   |
| PATCH  | `/api/leaves/:id/reject`   | Yes           | Employer     | Reject a specific leave request    |
| GET    | `/api/health`              | No            | Any          | Validate backend operational state |

---

## Important Notes

- This submission aligns perfectly with the requirement of a 4-to-12 hour execution window.
- As requested, it is acknowledged that this is a paid internship possibility, work-from-office in Bangalore requires 5-day availability, and candidates must bring an personal 16 GB RAM laptop.

