// Vue Router configuration.
// Uses createWebHistory (HTML5 mode) — requires vercel.json rewrites to work on Vercel.
//
// Navigation guard (beforeEach) implements RBAC:
//   requiresAuth: must be logged in + have the correct role
//   requiresGuest: must NOT be logged in (logged-in users redirected to their dashboard)

import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'

const routes = [
    { path: '/', component: Landing, meta: { requiresGuest: true } },
    { path: '/login', component: Login, meta: { requiresGuest: true } },
    { path: '/signup', component: Signup, meta: { requiresGuest: true } },
    {
        path: '/employee/dashboard',
        component: EmployeeDashboard,
        meta: { requiresAuth: true, role: 'employee' }
    },
    {
        path: '/employer/dashboard',
        component: EmployerDashboard,
        meta: { requiresAuth: true, role: 'employer' }
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    let user = null
    try {
        const userStr = localStorage.getItem('user')
        user = userStr ? JSON.parse(userStr) : null
    } catch {
        user = null
    }

    const getDashboard = (role) =>
        role === 'employee' ? '/employee/dashboard' : '/employer/dashboard'

    if (to.meta.requiresAuth) {
        if (!token || !user) return next('/login')
        if (to.meta.role && user.role !== to.meta.role) return next(getDashboard(user.role))
        return next()
    }

    if (to.meta.requiresGuest) {
        if (token && user) return next(getDashboard(user.role))
        return next()
    }

    next()
})

export default router
