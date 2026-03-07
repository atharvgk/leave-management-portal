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
    <div v-if="successMessage" class="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      {{ successMessage }}
    </div>
    <div v-if="apiError" class="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-2">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ apiError }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Leave Type -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Leave Type <span class="text-rose-500">*</span>
        </label>
        <select v-model="form.leaveType"
          class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none bg-white"
          :class="errors.leaveType ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'">
          <option value="">-- Select Leave Type --</option>
          <option v-for="type in LEAVE_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
        <p v-if="errors.leaveType" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.leaveType }}</p>
      </div>

      <div class="hidden md:block"></div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Start Date <span class="text-rose-500">*</span>
        </label>
        <input type="date" v-model="form.startDate" :min="today"
          class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700"
          :class="errors.startDate ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'" />
        <p v-if="errors.startDate" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.startDate }}</p>
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          End Date <span class="text-rose-500">*</span>
        </label>
        <input type="date" v-model="form.endDate" :min="form.startDate || today"
          class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700"
          :class="errors.endDate ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'" />
        <p v-if="errors.endDate" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.endDate }}</p>
      </div>

      <!-- Reason -->
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Reason <span class="text-rose-500">*</span>
        </label>
        <textarea v-model="form.reason" rows="3"
          placeholder="Please describe your reason for leave..."
          class="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-all placeholder:text-slate-400"
          :class="errors.reason ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'"></textarea>
        <p v-if="errors.reason" class="text-rose-500 text-xs font-medium mt-1.5">{{ errors.reason }}</p>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button @click="submitForm" :disabled="loading"
        class="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[160px]">
        <span v-if="loading" class="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
        <span>{{ loading ? 'Submitting...' : 'Apply for Leave' }}</span>
        <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
      </button>
    </div>
  </div>
</template>
