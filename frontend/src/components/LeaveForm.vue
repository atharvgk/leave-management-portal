<!-- Leave application form for employees.
     today is a computed ref — use today.value inside validateForm().
     YYYY-MM-DD string comparison works correctly for date ordering. -->

<script setup>
import { ref, reactive, computed } from 'vue'
import { leaveAPI } from '../services/api.js'

const emit = defineEmits(['submitted'])

const LEAVE_TYPES = [
  'Sick Leave', 'Casual Leave', 'Annual Leave',
  'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'
]

// today as YYYY-MM-DD string — used for :min on date inputs and validation
const today = computed(() => new Date().toISOString().split('T')[0])

const form    = reactive({ leaveType: '', startDate: '', endDate: '', reason: '' })
const errors  = reactive({ leaveType: '', startDate: '', endDate: '', reason: '' })
const loading        = ref(false)
const successMessage = ref('')
const apiError       = ref('')

function clearErrors() {
  errors.leaveType = ''; errors.startDate = ''; errors.endDate = ''; errors.reason = ''
}

function resetForm() {
  form.leaveType = ''; form.startDate = ''; form.endDate = ''; form.reason = ''
  clearErrors()
}

function validateForm() {
  clearErrors()
  let isValid = true

  if (!form.leaveType) {
    errors.leaveType = 'Please select a leave type'; isValid = false
  }
  if (!form.startDate) {
    errors.startDate = 'Start date is required'; isValid = false
  } else if (form.startDate < today.value) {
    // Lexicographic YYYY-MM-DD comparison is timezone-safe
    errors.startDate = 'Start date cannot be in the past'; isValid = false
  }
  if (!form.endDate) {
    errors.endDate = 'End date is required'; isValid = false
  } else if (form.startDate && form.endDate < form.startDate) {
    errors.endDate = 'End date must be on or after start date'; isValid = false
  }
  if (!form.reason.trim()) {
    errors.reason = 'Reason is required'; isValid = false
  }

  return isValid
}

async function submitForm() {
  if (!validateForm()) return
  loading.value = true
  apiError.value = ''
  successMessage.value = ''
  try {
    await leaveAPI.apply({
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate:   form.endDate,
      reason:    form.reason.trim()
    })
    successMessage.value = 'Leave application submitted successfully!'
    resetForm()
    emit('submitted')
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Failed to submit. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
      ✅ {{ successMessage }}
    </div>
    <div v-if="apiError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
      ❌ {{ apiError }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Leave Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Leave Type <span class="text-red-500">*</span>
        </label>
        <select v-model="form.leaveType"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.leaveType ? 'border-red-400' : 'border-gray-300'">
          <option value="">-- Select Leave Type --</option>
          <option v-for="type in LEAVE_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
        <p v-if="errors.leaveType" class="text-red-500 text-xs mt-1">{{ errors.leaveType }}</p>
      </div>

      <div class="hidden md:block"></div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Start Date <span class="text-red-500">*</span>
        </label>
        <input type="date" v-model="form.startDate" :min="today"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.startDate ? 'border-red-400' : 'border-gray-300'" />
        <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          End Date <span class="text-red-500">*</span>
        </label>
        <input type="date" v-model="form.endDate" :min="form.startDate || today"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="errors.endDate ? 'border-red-400' : 'border-gray-300'" />
        <p v-if="errors.endDate" class="text-red-500 text-xs mt-1">{{ errors.endDate }}</p>
      </div>

      <!-- Reason -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Reason <span class="text-red-500">*</span>
        </label>
        <textarea v-model="form.reason" rows="3"
          placeholder="Please describe your reason for leave..."
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          :class="errors.reason ? 'border-red-400' : 'border-gray-300'"></textarea>
        <p v-if="errors.reason" class="text-red-500 text-xs mt-1">{{ errors.reason }}</p>
      </div>
    </div>

    <div class="mt-4">
      <button @click="submitForm" :disabled="loading"
        class="bg-blue-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <span v-if="loading" class="flex items-center gap-2">
          <span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
          Submitting...
        </span>
        <span v-else>Apply for Leave</span>
      </button>
    </div>
  </div>
</template>
