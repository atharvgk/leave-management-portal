<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col justify-center relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Main Content -->
      <div class="space-y-8">
        <div class="inline-flex items-center justify-center p-3 bg-teal-50 rounded-2xl mb-4 border border-teal-100">
          <svg class="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
          Modern <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Leave Management</span>
        </h1>
        
        <p class="mt-4 max-w-2xl text-xl text-slate-600 mx-auto font-medium">
          Simplify your company's time off. Employees request leave in seconds. Managers approve with a single click. All in one beautiful dashboard.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link 
            to="/login" 
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 border border-transparent rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 overflow-hidden w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span class="relative">Log In to Portal</span>
          </router-link>
          
          <router-link 
            to="/signup" 
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 w-full sm:w-auto shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            Create an Account
          </router-link>
        </div>
      </div>

      <!-- Feature Grid -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div class="p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
          <div class="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Instant Requests</h3>
          <p class="text-slate-600 leading-relaxed font-medium">Submit leave requests in seconds with our intuitive interface. Track your status in real-time.</p>
        </div>
        
        <div class="p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
          <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">1-Click Approvals</h3>
          <p class="text-slate-600 leading-relaxed font-medium">Managers get a clean dashboard of all pending requests. Approve or reject with a single click.</p>
        </div>
        
        <div class="p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
          <p class="text-slate-600 leading-relaxed font-medium">Enterprise-grade security with strict Role-Based Access Control and modern auth.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Landing page needs no specific state logic for now.
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
