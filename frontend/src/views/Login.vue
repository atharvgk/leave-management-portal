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
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <form @submit.prevent="submitLogin" class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
        <p class="text-slate-500 text-sm mt-1">Sign in to LeaveManager</p>
      </div>

      <div v-if="successMessage" class="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
        {{ successMessage }}
      </div>
      <div v-if="error" class="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium">
        {{ error }}
      </div>

      <div class="mb-5">
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
        <input type="email" v-model="form.email" placeholder="you@company.com" required
          class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
      </div>
      <div class="mb-8">
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <input type="password" v-model="form.password" placeholder="••••••••" required
          class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
      </div>

      <button type="submit" :disabled="loading"
        class="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
        <span v-if="loading" class="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
        <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>

      <p class="text-center text-sm text-slate-500 mt-6">
        Don't have an account?
        <RouterLink to="/signup" class="text-teal-600 font-bold hover:text-teal-700 transition-colors">Sign up</RouterLink>
      </p>
    </form>
  </div>
</template>
