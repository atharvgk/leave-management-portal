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
  <div v-if="isEmployer" class="mb-4 flex items-center gap-3">
    <label class="text-sm font-medium text-gray-600">Filter by status:</label>
    <select v-model="statusFilter"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option>All</option>
      <option>Pending</option>
      <option>Approved</option>
      <option>Rejected</option>
    </select>
    <span class="text-sm text-gray-400">({{ filteredLeaves.length }} record{{ filteredLeaves.length !== 1 ? 's' : '' }})</span>
  </div>

  <div v-if="filteredLeaves.length === 0" class="text-center py-10 text-gray-400">
    <p>No leave requests found.</p>
  </div>

  <div v-else class="overflow-x-auto">
    <table class="w-full text-sm text-left border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <template v-if="isEmployer">
            <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Employee</th>
            <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Email</th>
          </template>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Leave Type</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Start Date</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">End Date</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Duration</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b">Reason</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">Status</th>
          <th class="px-4 py-3 font-semibold text-gray-600 border-b whitespace-nowrap">
            {{ isEmployer ? 'Actions' : 'Applied On' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leave in filteredLeaves" :key="leave._id"
          class="hover:bg-gray-50 border-b transition-colors">
          <template v-if="isEmployer">
            <td class="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{{ leave.employeeName }}</td>
            <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ leave.employeeEmail }}</td>
          </template>
          <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ leave.leaveType }}</td>
          <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(leave.startDate) }}</td>
          <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(leave.endDate) }}</td>
          <td class="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{{ getDuration(leave.startDate, leave.endDate) }}</td>
          <td class="px-4 py-3 text-gray-600 max-w-xs">
            <span class="block truncate" :title="leave.reason">{{ leave.reason }}</span>
          </td>
          <td class="px-4 py-3"><StatusBadge :status="leave.status" /></td>
          <td class="px-4 py-3">
            <template v-if="isEmployer">
              <div v-if="leave.status === 'Pending'" class="flex gap-2">
                <button @click="handleApprove(leave._id)" :disabled="!!actionLoading[leave._id]"
                  class="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                  {{ actionLoading[leave._id] === 'approve' ? 'Approving...' : 'Approve' }}
                </button>
                <button @click="handleReject(leave._id)" :disabled="!!actionLoading[leave._id]"
                  class="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                  {{ actionLoading[leave._id] === 'reject' ? 'Rejecting...' : 'Reject' }}
                </button>
              </div>
              <span v-else class="text-gray-400 text-xs italic">Processed</span>
            </template>
            <template v-else>
              <span class="text-gray-500 text-xs whitespace-nowrap">{{ formatDate(leave.createdAt) }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
