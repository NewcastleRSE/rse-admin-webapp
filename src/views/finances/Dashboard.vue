<template>
  <div class="flex flex-wrap">
    <div class="w-full xl:w-3/4 mb-12 xl:mb-0 px-4">
      <recovery class="h-full" />
    </div>
    <div class="w-full xl:w-1/4 px-4">
      <upload class="h-full" />
    </div>
  </div>
  <!-- <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      <project-status />
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <card-time-split />
    </div>
  </div> -->
</template>
<script setup>
import Recovery from '@/components/Finance/Recovery.vue'
import Upload from '@/components/Finance/Upload.vue'
</script>