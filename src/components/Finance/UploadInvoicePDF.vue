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
      class="rounded-full p-1 text-gray-500 shadow-xs hover:border-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 disabled:opacity-50"
    >
      <svg v-if="!isUploading" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-5">
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
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