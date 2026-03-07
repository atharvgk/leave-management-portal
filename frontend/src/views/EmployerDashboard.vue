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
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Employer Dashboard</h1>

    <!-- Summary stat cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
        <p class="text-3xl font-bold text-gray-800">{{ total }}</p>
        <p class="text-sm text-gray-500 mt-1">Total</p>
      </div>
      <div class="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4 text-center">
        <p class="text-3xl font-bold text-yellow-600">{{ pending }}</p>
        <p class="text-sm text-yellow-600 mt-1">Pending</p>
      </div>
      <div class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4 text-center">
        <p class="text-3xl font-bold text-green-600">{{ approved }}</p>
        <p class="text-sm text-green-600 mt-1">Approved</p>
      </div>
      <div class="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4 text-center">
        <p class="text-3xl font-bold text-red-600">{{ rejected }}</p>
        <p class="text-sm text-red-600 mt-1">Rejected</p>
      </div>
    </div>

    <!-- All leave requests table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-700">All Leave Requests</h2>
        <button @click="fetchLeaves" class="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-10 text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span>Loading...</span>
      </div>
      <div v-else-if="error" class="text-center py-6">
        <p class="text-red-500 text-sm">{{ error }}</p>
        <button @click="fetchLeaves" class="mt-2 text-blue-600 text-sm hover:underline">Try again</button>
      </div>
      <!-- @action-taken re-fetches after approve/reject so stats update immediately -->
      <LeaveTable v-else :leaves="leaves" :isEmployer="true" @action-taken="fetchLeaves" />
    </div>
  </div>
</template>
