<!-- Reusable table for displaying leave requests.
     isEmployer=true: shows employee name/email + duration + Approve/Reject buttons.
     isEmployer=false: shows "Applied On" column instead of action buttons.

     FEATURES:
     - Duration column: shows number of days for each leave request
     - Status filter dropdown: employer can filter by All / Pending / Approved / Rejected
     - CRITICAL: actionLoading MUST be reactive({}) — not a plain object.
       Vue 3 cannot track property additions on plain objects.
       Using reactive({}) ensures button labels update reactively. -->

<script setup>
import { reactive, ref, computed } from 'vue'
import { leaveAPI } from '../services/api.js'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  leaves:     { type: Array,   required: true },
  isEmployer: { type: Boolean, default: false }
})
const emit = defineEmits(['action-taken'])

// reactive({}) is required for Vue 3 to detect property additions/deletions
const actionLoading = reactive({})

// Status filter — employer only; employees see all their own leaves
const statusFilter = ref('All')

// Filtered leaves list — recomputed whenever leaves prop or statusFilter changes
const filteredLeaves = computed(() => {
  if (!props.isEmployer || statusFilter.value === 'All') return props.leaves
  return props.leaves.filter(l => l.status === statusFilter.value)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

// Calculates number of leave days (inclusive of both start and end date)
const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '—'
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const diffMs   = end.getTime() - start.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1  // inclusive
  return diffDays === 1 ? '1 day' : `${diffDays} days`
}

async function handleApprove(leaveId) {
  actionLoading[leaveId] = 'approve'
  try {
    await leaveAPI.approve(leaveId)
    emit('action-taken')  // tells parent to re-fetch the leave list
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to approve leave request')
  } finally {
    delete actionLoading[leaveId]
  }
}

async function handleReject(leaveId) {
  actionLoading[leaveId] = 'reject'
  try {
    await leaveAPI.reject(leaveId)
    emit('action-taken')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to reject leave request')
  } finally {
    delete actionLoading[leaveId]
  }
}
</script>

<template>
  <!-- Status filter — shown only for employer view -->
  <div v-if="isEmployer" class="mb-6 flex flex-wrap items-center gap-4 bg-gray-50/50 p-2 rounded-xl w-fit border border-gray-100">
    <label class="text-sm font-semibold text-gray-600 ml-2">Filter:</label>
    <div class="flex gap-2">
      <button v-for="status in ['All', 'Pending', 'Approved', 'Rejected']" :key="status"
        @click="statusFilter = status"
        :class="[
          'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out',
          statusFilter === status 
            ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' 
            : 'text-gray-500 hover:bg-gray-100 border border-transparent'
        ]">
        {{ status }}
      </button>
    </div>
    <span class="text-xs font-semibold text-gray-400 ml-2 mr-4 bg-gray-100 px-2 py-1 rounded-full">
      {{ filteredLeaves.length }} record{{ filteredLeaves.length !== 1 ? 's' : '' }}
    </span>
  </div>

  <div v-if="filteredLeaves.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
    <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
    <p class="text-sm font-medium">No leave requests found.</p>
  </div>

  <div v-else class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
    <table class="w-full text-sm text-left border-collapse bg-white">
      <thead class="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
        <tr>
          <template v-if="isEmployer">
            <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap">Employee</th>
          </template>
          <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap">Leave Details</th>
          <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap">Dates</th>
          <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap">Reason</th>
          <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap">Status</th>
          <th class="px-6 py-4 border-b border-gray-100 whitespace-nowrap text-right">
            {{ isEmployer ? 'Actions' : 'Applied On' }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr v-for="leave in filteredLeaves" :key="leave._id"
          class="hover:bg-indigo-50/30 transition-colors group">
          
          <template v-if="isEmployer">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-bold text-gray-900">{{ leave.employeeName }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ leave.employeeEmail }}</div>
            </td>
          </template>

          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 font-medium text-gray-800">
              <span class="w-2 h-2 rounded-full" :class="{
                'bg-blue-400': leave.leaveType === 'Sick Leave',
                'bg-purple-400': leave.leaveType === 'Casual Leave',
                'bg-orange-400': leave.leaveType === 'Earned Leave'
              }"></span>
              {{ leave.leaveType }}
            </span>
            <div class="text-xs text-gray-500 mt-1 font-medium">{{ getDuration(leave.startDate, leave.endDate) }}</div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-gray-600">
            <div>{{ formatDate(leave.startDate) }}</div>
            <div class="text-xs text-gray-400 mt-0.5">to {{ formatDate(leave.endDate) }}</div>
          </td>

          <td class="px-6 py-4 text-gray-600">
            <p class="truncate max-w-[200px] sm:max-w-xs text-sm" :title="leave.reason">{{ leave.reason || '—' }}</p>
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <StatusBadge :status="leave.status" />
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-right">
            <template v-if="isEmployer">
              <div v-if="leave.status === 'Pending'" class="flex justify-end gap-2 transition-opacity">
                <button @click="handleApprove(leave._id)" :disabled="!!actionLoading[leave._id]"
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" title="Approve">
                  <svg v-if="actionLoading[leave._id] === 'approve'" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button @click="handleReject(leave._id)" :disabled="!!actionLoading[leave._id]"
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" title="Reject">
                  <svg v-if="actionLoading[leave._id] === 'reject'" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <span v-else class="text-gray-400 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">Processed</span>
            </template>
            <template v-else>
              <div class="text-gray-500 text-xs font-medium">{{ formatDate(leave.createdAt) }}</div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
