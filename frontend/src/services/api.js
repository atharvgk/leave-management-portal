// Axios API service.
// baseURL: uses VITE_API_BASE_URL in production (set in Vercel dashboard),
//          falls back to '/api' in development (Vite proxy handles routing).
// Request interceptor: attaches JWT token to Authorization header.
// Response interceptor: handles expired/invalid tokens globally.
//   - Only redirects to /login if NOT already on /login (prevents redirect loop).

import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Redirect to login on 401 (expired/invalid token), but not if already on login page
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            !window.location.pathname.includes('/login')
        ) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
}

export const leaveAPI = {
    apply: (data) => api.post('/leaves', data),
    getMyLeaves: () => api.get('/leaves/my'),
    getAllLeaves: () => api.get('/leaves/all'),
    approve: (id) => api.patch(`/leaves/${id}/approve`),
    reject: (id) => api.patch(`/leaves/${id}/reject`)
}

export default api
