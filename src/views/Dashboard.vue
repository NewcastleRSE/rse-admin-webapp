<template>
  <div class="flex flex-wrap">
    <div class="w-full px-4">
      <capacity class="h-full" />
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      <utilisation class="h-full" />
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <cost-recovery class="h-full" />
    </div>
  </div>
</template>
<script setup>
import Capacity from '@/components/Dashboard/Capacity.vue'
import CostRecovery from '@/components/Dashboard/CostRecovery.vue'
import Utilisation from '../components/Dashboard/Utilisation.vue'
</script>
