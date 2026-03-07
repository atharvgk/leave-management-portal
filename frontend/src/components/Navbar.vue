<!-- Top navigation bar. Shows user name, role badge, and logout button. -->

<script setup>
import { useAuthStore } from '../store/auth.js'
const authStore = useAuthStore()
</script>

<template>
  <nav class="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div class="text-xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
        LeaveManager
      </div>
    </div>
    
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-end">
        <span class="text-sm font-semibold text-slate-200">
          {{ authStore.user?.name }}
        </span>
        <span class="text-[11px] font-bold uppercase tracking-widest text-teal-400">
          {{ authStore.user?.role }} Account
        </span>
      </div>
      <div class="h-8 w-px bg-slate-700"></div>
      <button
        @click="authStore.logout()"
        class="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150 flex items-center gap-2"
      >
        <span>Sign Out</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </button>
    </div>
  </nav>
</template>
