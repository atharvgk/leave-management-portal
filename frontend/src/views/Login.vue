<!-- Login view. @keyup.enter on inputs submits the form. -->

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../services/api.js'
import { useAuthStore } from '../store/auth.js'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const form           = reactive({ email: '', password: '' })
const loading        = ref(false)
const error          = ref('')
const successMessage = ref('')

// Pick up ?success= query param set by Signup.vue after account creation
onMounted(() => {
  if (route.query.success) successMessage.value = String(route.query.success)
})

async function submitLogin() {
  error.value = ''
  if (!form.email.trim() || !form.password) {
    error.value = 'Email and password are required'
    return
  }
  loading.value = true
  try {
    const res = await authAPI.login({ email: form.email, password: form.password })
    authStore.setAuth(res.data.token, res.data.user)
    // Redirect to role-appropriate dashboard
    router.push(res.data.user.role === 'employee'
      ? '/employee/dashboard'
      : '/employer/dashboard'
    )
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">LeaveManager</h1>
        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>



      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
        ✅ {{ successMessage }}
      </div>
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
        ❌ {{ error }}
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input type="email" v-model="form.email" placeholder="you@example.com"
          @keyup.enter="submitLogin"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" v-model="form.password" placeholder="••••••"
          @keyup.enter="submitLogin"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button @click="submitLogin" :disabled="loading"
        class="w-full bg-blue-600 text-white py-2.5 rounded font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
          Logging in...
        </span>
        <span v-else>Login</span>
      </button>

      <p class="text-center text-sm text-gray-500 mt-4">
        Don't have an account?
        <RouterLink to="/signup" class="text-blue-600 font-medium hover:underline">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>
