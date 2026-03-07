<!-- Employee dashboard: apply for leave + view own leave history. -->

<script setup>
import { ref, onMounted } from 'vue'
import { leaveAPI } from '../services/api.js'
import LeaveForm from '../components/LeaveForm.vue'
import LeaveTable from '../components/LeaveTable.vue'

const leaves  = ref([])
const loading = ref(false)
const error   = ref('')

async function fetchLeaves() {
  loading.value = true
  error.value = ''
  try {
    const res = await leaveAPI.getMyLeaves()
    leaves.value = res.data.leaves
  } catch (err) {
    error.value = 'Failed to load your leave requests. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchLeaves())
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-10">
    <div class="max-w-5xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Employee Dashboard</h1>
        <p class="text-gray-500 mt-2">Manage your time off requests and view your leave history.</p>
      </div>

      <!-- Apply for Leave section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800">Request Time Off</h2>
        </div>
        <!-- @submitted triggers a re-fetch so new request appears immediately -->
        <LeaveForm @submitted="fetchLeaves" />
      </div>

      <!-- My Leave Requests section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800">My Leave History</h2>
          </div>
          <button @click="fetchLeaves" class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600 mb-4"></div>
          <span class="font-medium animate-pulse">Loading history...</span>
        </div>
        <div v-else-if="error" class="text-center py-10 bg-red-50 rounded-xl border border-red-100">
          <p class="text-red-600 font-medium mb-2">{{ error }}</p>
          <button @click="fetchLeaves" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">Try again</button>
        </div>
        <LeaveTable v-else :leaves="leaves" :isEmployer="false" />
      </div>
    </div>
  </div>
</template>
