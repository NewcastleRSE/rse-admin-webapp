<template>
  <div class="w-full -mt-24">
    <div class="flex flex-wrap">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <capacity class="h-full" />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <cost-recovery class="h-full" />
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
  </div>
</template>
<script setup>
import Capacity from '@/components/Dashboard/Capacity.vue'
import CostRecovery from '@/components/Dashboard/CostRecovery.vue'
import ProjectStatus from '../components/Dashboard/ProjectStatus.vue'
</script>
