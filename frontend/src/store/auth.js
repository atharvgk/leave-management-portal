// Pinia auth store (Composition API style).
// Manages token + user state, persisted to localStorage.
// logout() uses router.push — imported directly to avoid circular imports.

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router/index.js'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const user = ref(null)

    // Reactive boolean — true when a JWT is present
    const isAuthenticated = computed(() => !!token.value)

    // Call after successful login/signup to persist session
    function setAuth(newToken, newUser) {
        token.value = newToken
        user.value = newUser
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    // Clears all auth state and sends user to login
    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    // Called once on app startup to restore session from localStorage
    function initAuth() {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (savedToken && savedUser) {
            token.value = savedToken
            try {
                user.value = JSON.parse(savedUser)
            } catch (e) {
                // Corrupted data — log out cleanly
                logout()
            }
        }
    }

    return { token, user, isAuthenticated, setAuth, logout, initAuth }
})
