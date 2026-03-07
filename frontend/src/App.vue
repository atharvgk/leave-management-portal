<!-- Root component. Navbar only shows when user is authenticated. -->

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './store/auth.js'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()
const showNavbar = computed(() => authStore.isAuthenticated)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="showNavbar" />
    <main><RouterView /></main>
  </div>
</template>
