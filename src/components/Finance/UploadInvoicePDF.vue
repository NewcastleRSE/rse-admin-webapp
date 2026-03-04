<template>
  <div class="inline-block">
    <input 
      type="file" 
      style="display: none" 
      accept=".pdf" 
      @change="onFileSelected($event)" 
    />

    <button 
      type="button"
      @click="openFilePicker"
      :disabled="isUploading"
      :class="[
        'cursor-pointer rounded-full p-1 shadow-sm ring-1 ring-inset transition-colors text-gray-600 ring-gray-300 hover:bg-blue-50'
      ]"
    >
  <svg v-if="!isUploading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      
      <svg v-else class="animate-spin size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInvoicesStore } from '@/stores'

const invoicesStore = useInvoicesStore()

// Define Props passed from Parent
const props = defineProps({
  clockifyID: {
    type: String,
    required: true
  },
  year: {
    type: [Number, String],
    required: true
  },
  month: {
    type: String,
    required: true
  }
});

const isUploading = ref(false);

// Logic to open the file picker using DOM selection relative to the button
const openFilePicker = (event) => {
  const container = event.currentTarget.parentNode;
  const input = container.querySelector('input[type="file"]');
  if (input) input.click();
};

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    performUpload(file);
  }
  // Clear the input value so the same file can be re-selected if needed
  event.target.value = '';
};

const performUpload = async (file) => {
  isUploading.value = true;

  const formData = new FormData();
  formData.append('files', file);
  formData.append('clockifyID', props.clockifyID);
  formData.append('year', props.year);
  formData.append('month', props.month);

  invoicesStore.addInvoice(formData).then(() => {
    isUploading.value = false;
  }).catch(() => {
    alert("Failed to upload invoice PDF.");
    isUploading.value = false;
  });
  
};
</script>