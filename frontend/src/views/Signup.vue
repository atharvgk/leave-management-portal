<!-- Signup view with full inline field-level validation. -->

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api.js'

const router = useRouter()

const form    = reactive({ name: '', email: '', password: '', role: '' })
const errors  = reactive({ name: '', email: '', password: '', role: '' })
const loading  = ref(false)
const apiError = ref('')

function clearErrors() {
  errors.name = ''; errors.email = ''; errors.password = ''; errors.role = ''
  apiError.value = ''
}

// Basic validation for name and password length
function validateForm() {
  clearErrors()
  let isValid = true
  if (!form.name.trim())                 { errors.name     = 'Full name is required';              isValid = false }
  else if (form.name.trim().length < 2)  { errors.name     = 'Name must be at least 2 characters'; isValid = false }
  
  // Note: Email format and required fields are handled by native HTML5 form validation
  if (!form.password)                    { errors.password = 'Password is required';               isValid = false }
  else if (form.password.length < 6)     { errors.password = 'Password must be at least 6 characters'; isValid = false }
  if (!form.role)                        { errors.role     = 'Please select a role';               isValid = false }
  return isValid
}

async function submitSignup() {
  if (!validateForm()) return
  loading.value = true
  try {
    await authAPI.signup({
      name:     form.name.trim(),
      email:    form.email.trim(),
      password: form.password,
      role:     form.role
    })
    // Redirect to login with success message in query string
    router.push('/login?success=Account created successfully! Please log in.')
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <form @submit.prevent="submitSignup" class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-md my-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">LeaveManager</h1>
        <p class="text-slate-500 text-sm mt-1">Create your account</p>
      </div>

      <div v-if="apiError" class="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium">
        {{ apiError }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span class="text-rose-500">*</span></label>
          <input type="text" v-model="form.name" placeholder="John Doe" required
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            :class="errors.name ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200'" />
          <p v-if="errors.name" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span class="text-rose-500">*</span></label>
          <input type="email" v-model="form.email" placeholder="you@company.com" required
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            :class="errors.email ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200'" />
          <p v-if="errors.email" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password <span class="text-rose-500">*</span></label>
          <input type="password" v-model="form.password" placeholder="Minimum 6 characters" required minlength="6"
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            :class="errors.password ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200'" />
          <p v-if="errors.password" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.password }}</p>
        </div>

        <div class="pb-2">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">I am a... <span class="text-rose-500">*</span></label>
          <select v-model="form.role" required
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none bg-white"
            :class="errors.role ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200'">
            <option value="">-- Select Role --</option>
            <option value="employee">Employee</option>
            <option value="employer">Employer / Manager</option>
          </select>
          <p v-if="errors.role" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.role }}</p>
        </div>
      </div>

      <button type="submit" :disabled="loading"
        class="w-full mt-6 bg-slate-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
        <span v-if="loading" class="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
        <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
        <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>

      <p class="text-center text-sm text-slate-500 mt-6">
        Already have an account?
        <RouterLink to="/login" class="text-teal-600 font-bold hover:text-teal-700 transition-colors">Log in</RouterLink>
      </p>
    </form>
  </div>
</template>
