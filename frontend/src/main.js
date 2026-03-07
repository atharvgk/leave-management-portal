// App entry point.
// Pinia must be registered before the auth store is used (initAuth).
// initAuth() restores the user session from localStorage on every page load.

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import { useAuthStore } from './store/auth.js'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Rehydrate auth state before mounting to prevent flash of unauthenticated UI
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')
