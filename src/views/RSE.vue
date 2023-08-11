<template>
  <div class="flex flex-wrap">
    <div class="w-full mb-12 xl:mb-0 px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 px-4 py-3 shadow-lg rounded">
        <time-summary :rse="rse" class="m-6"/>
      </div>
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      <project-status />
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <!-- <card-time-split /> -->
    </div>
  </div>
</template>
<script setup>
import TimeSummary from '@/components/Dashboard/TimeSummary.vue'
import ProjectStatus from '../components/Dashboard/ProjectStatus.vue'
import { useRoute } from 'vue-router'
import { useRSEsStore } from '../stores'

const route = useRoute()
const rsesStore = useRSEsStore()

const rse = rsesStore.getByName(route.path.split('/')[2])
</script>