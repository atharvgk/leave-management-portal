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

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

function clearErrors() {
  errors.name = ''; errors.email = ''; errors.password = ''; errors.role = ''
  apiError.value = ''
}

function validateForm() {
  clearErrors()
  let isValid = true
  if (!form.name.trim())                 { errors.name     = 'Full name is required';              isValid = false }
  else if (form.name.trim().length < 2)  { errors.name     = 'Name must be at least 2 characters'; isValid = false }
  if (!form.email)                       { errors.email    = 'Email is required';                  isValid = false }
  else if (!EMAIL_REGEX.test(form.email)){ errors.email    = 'Please enter a valid email address'; isValid = false }
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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">🗓️</div>
        <h1 class="text-2xl font-bold text-gray-800">LeaveManager</h1>
        <p class="text-gray-500 text-sm mt-1">Create your account</p>
      </div>

      <div v-if="apiError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
        ❌ {{ apiError }}
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.name" placeholder="John Doe"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.name ? 'border-red-400' : 'border-gray-300'" />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address <span class="text-red-500">*</span></label>
        <input type="email" v-model="form.email" placeholder="you@example.com"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.email ? 'border-red-400' : 'border-gray-300'" />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Password <span class="text-red-500">*</span></label>
        <input type="password" v-model="form.password" placeholder="Minimum 6 characters"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.password ? 'border-red-400' : 'border-gray-300'" />
        <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">I am a... <span class="text-red-500">*</span></label>
        <select v-model="form.role"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.role ? 'border-red-400' : 'border-gray-300'">
          <option value="">-- Select Role --</option>
          <option value="employee">Employee</option>
          <option value="employer">Employer / Manager</option>
        </select>
        <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
      </div>

      <button @click="submitSignup" :disabled="loading"
        class="w-full bg-blue-600 text-white py-2.5 rounded font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
          Creating Account...
        </span>
        <span v-else>Create Account</span>
      </button>

      <p class="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 font-medium hover:underline">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>
