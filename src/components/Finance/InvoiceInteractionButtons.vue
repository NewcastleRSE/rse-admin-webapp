<template>
  <transition
    enter-active-class="transition ease-out duration-100"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div 
      v-if="isOpen && !creating" 
      class="mb-3 w-25 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 text-gray-700"
    >
      <button
        @click="createInvoice(true)"
        class="flex w-full items-center px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 size-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        Editable
      </button>
      <button
        @click="createInvoice(false)"
        class="flex w-full items-center px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 size-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        Readonly
      </button>
    </div>
  </transition>

  <button
    @click="isOpen = !isOpen"
    :disabled="creating"
    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
  >
    <svg 
      v-if="creating" 
      class="size-2.5 animate-spin" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <svg 
      v-else
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="2" 
      stroke="currentColor" 
      class="size-4 transition-all duration-300"
    >
      <path v-if="isOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      
      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  </button>
   <UploadInvoicePDF
                        :clockifyID="props.project.clockifyID"
                        :year="props.year"
                        :month="props.month"
                      />
</template>
<script setup>
import { ref } from 'vue'
import { useInvoicesStore } from '@/stores'
import UploadInvoicePDF from '@/components/Finance/UploadInvoicePDF.vue'
const invoicesStore = useInvoicesStore()
const props = defineProps({
    project: { type: Object, required: true },
    year: { type: [String, Number], required: true },
    month: { type: String, required: true },
})


const isOpen = ref(false)
const creating = ref(false) // Toggle this to true during invoice generation

const setMode = (mode) => {
  console.log(`Mode set to: ${mode}`)
  isOpen.value = false
}

function createInvoice(editable) {
    console.log(`Creating invoice for project ${props.project.documentId}, year ${props.year}, month ${props.month}, editable: ${editable}`)
  creating.value = true;
  invoicesStore.createInvoice(props.project.documentId, props.year, props.month, editable).then(() => {
    creating.value = false;
    isOpen.value = false; 
  });
}
</script>

<!-- 
<div class="flex items-center border-l border-gray-200 pl-4 space-x-2">
       <span v-if="creating" class="text-xs text-gray-500 animate-pulse">Generating...</span>
       
       <button 
          v-if="!currentInvoice && project.account"
          :disabled="creating"
          @click="createInvoice"
          class="rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
       >
          Generate Invoice
       </button>

       <button
          v-if="currentInvoice"
          type="button"
          @click="createInvoice"
          :disabled="regenerateDisabled"
          class="rounded-full p-1.5 shadow-sm ring-1 ring-inset text-gray-600 ring-gray-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Regenerate Invoice"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['size-4', creating ? 'animate-spin' : '']">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div> -->