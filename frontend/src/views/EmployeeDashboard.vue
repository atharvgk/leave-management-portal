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
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Employee Dashboard</h1>

    <!-- Apply for Leave section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Apply for Leave</h2>
      <!-- @submitted triggers a re-fetch so new request appears immediately -->
      <LeaveForm @submitted="fetchLeaves" />
    </div>

    <!-- My Leave Requests section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-700">My Leave Requests</h2>
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
      <LeaveTable v-else :leaves="leaves" :isEmployer="false" />
    </div>
  </div>
</template>
