<!-- Displays a coloured badge for leave request status. -->

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: (val) => ['Pending', 'Approved', 'Rejected'].includes(val)
  }
})
</script>

<template>
  <span
    class="px-2 py-1 rounded-full text-xs font-semibold inline-block"
    :class="{
      'bg-yellow-100 text-yellow-800 border border-yellow-200': status === 'Pending',
      'bg-green-100  text-green-800  border border-green-200':  status === 'Approved',
      'bg-red-100    text-red-800    border border-red-200':    status === 'Rejected'
    }"
  >
    {{ status }}
  </span>
</template>
