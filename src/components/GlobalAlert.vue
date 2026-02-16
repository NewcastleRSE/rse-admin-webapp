<template>
  <!-- <Transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  > -->
 
    <div v-if="isVisible" 
         :class="[typeStyles[type], 'fixed top-5 right-5 z-50 p-4 rounded-lg border-l-4 shadow-xl min-w-[300px]']">
      <div class="flex items-center justify-between">
        <p class="font-medium">{{ message }}</p>
        <button @click="isVisible = false" class="ml-4 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  <!-- </Transition> -->
   <div>Test</div>
</template>

<script setup>
import { useAlertStore } from '@/stores'
import { storeToRefs } from 'pinia'
const alertStore = useAlertStore()
const isVisible = storeToRefs(alertStore).isVisible
const message = storeToRefs(alertStore).message
const type = storeToRefs(alertStore).type

const typeStyles = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800'
}
</script>
