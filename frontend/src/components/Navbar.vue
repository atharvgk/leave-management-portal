<!-- Top navigation bar. Shows user name, role badge, and logout button. -->

<script setup>
import { useAuthStore } from '../store/auth.js'
const authStore = useAuthStore()
</script>

<template>
  <nav class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
    <div class="text-xl font-bold tracking-wide">🗓️ LeaveManager</div>
    <div class="flex items-center gap-4">
      <span class="text-sm">
        Hello, <strong>{{ authStore.user?.name }}</strong>
        <span class="ml-2 bg-blue-500 border border-blue-400 px-2 py-0.5 rounded-full text-xs capitalize">
          {{ authStore.user?.role }}
        </span>
      </span>
      <button
        @click="authStore.logout()"
        class="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-50 transition-colors duration-150"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
