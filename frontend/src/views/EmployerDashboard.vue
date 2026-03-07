<!-- Employer dashboard: summary stats + all employee leave requests with approve/reject. -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { leaveAPI } from '../services/api.js'
import LeaveTable from '../components/LeaveTable.vue'

const leaves  = ref([])
const loading = ref(false)
const error   = ref('')

// Summary cards — recomputed reactively whenever leaves changes
const total    = computed(() => leaves.value.length)
const pending  = computed(() => leaves.value.filter(l => l.status === 'Pending').length)
const approved = computed(() => leaves.value.filter(l => l.status === 'Approved').length)
const rejected = computed(() => leaves.value.filter(l => l.status === 'Rejected').length)

async function fetchLeaves() {
  loading.value = true
  error.value = ''
  try {
    const res = await leaveAPI.getAllLeaves()
    leaves.value = res.data.leaves
  } catch (err) {
    error.value = 'Failed to load leave requests. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchLeaves())
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-10">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Employer Dashboard</h1>
        <p class="text-gray-500 mt-2">Overview of all employee time off requests and approvals.</p>
      </div>

      <!-- Summary stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <div class="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Requests</div>
          <div class="text-4xl font-extrabold text-gray-800">{{ total }}</div>
        </div>
        
        <div class="bg-gradient-to-b from-yellow-50 to-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-yellow-100 p-6 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <div class="text-yellow-600 text-sm font-semibold uppercase tracking-wider mb-2">Pending</div>
          <div class="text-4xl font-extrabold text-yellow-600">{{ pending }}</div>
        </div>
        
        <div class="bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100 p-6 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <div class="text-green-600 text-sm font-semibold uppercase tracking-wider mb-2">Approved</div>
          <div class="text-4xl font-extrabold text-green-600">{{ approved }}</div>
        </div>
        
        <div class="bg-gradient-to-b from-red-50 to-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-6 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <div class="text-red-600 text-sm font-semibold uppercase tracking-wider mb-2">Rejected</div>
          <div class="text-4xl font-extrabold text-red-600">{{ rejected }}</div>
        </div>
      </div>

      <!-- All leave requests table -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800">Team Leave Requests</h2>
          </div>
          <button @click="fetchLeaves" class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh List
          </button>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-indigo-600 mb-4"></div>
          <span class="font-medium animate-pulse">Loading team requests...</span>
        </div>
        <div v-else-if="error" class="text-center py-10 bg-red-50 rounded-xl border border-red-100">
          <p class="text-red-600 font-medium mb-2">{{ error }}</p>
          <button @click="fetchLeaves" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">Try again</button>
        </div>
        <!-- @action-taken re-fetches after approve/reject so stats update immediately -->
        <LeaveTable v-else :leaves="leaves" :isEmployer="true" @action-taken="fetchLeaves" />
      </div>
    </div>
  </div>
</template>
