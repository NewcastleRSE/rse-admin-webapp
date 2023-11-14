<template>
  <div class="relative flex flex-col min-w-0 break-words bg-blueGray-700 rounded mb-6 xl:mb-0 shadow-lg">
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex-none">
        <img :src="image" class="h-20 rounded-full m-2 shadow-lg" />
      </div>
      <div class="flex-1">
          <h1 class="font-semibold text-blueGray-100 text-3xl">
            {{ name }}
          </h1>
          <h2 class="font-semibold text-blueGray-400">
            {{ team }} Team
          </h2>
          <h2 class="text-blueGray-100 mt-2">
            Next Available {{ availableDate }} at {{ availablePercentage }}%
          </h2>
      </div>
      <div class="grid grid-cols-3 items-center gap-x-4 mr-2 text-blueGray-400">
        <a :href="`mailto:${email}`" target="_blank" class="text-center hover:text-blueGray-100">
          <i class="fas fa-envelope text-2xl"></i>
          <h4 class="py-2">Email</h4>
        </a>
        <a :href="timesheetURL" target="_blank" class="text-center hover:text-blueGray-100">
          <i class="fas fa-calendar-alt text-2xl"></i>
          <h4 class="py-2">Clockify</h4>
        </a>
        <a :href="githubURL" target="_blank" class="text-center hover:text-blueGray-100">
          <i class="fa-brands fa-github text-2xl"></i>
          <h4 class="py-2">Github</h4>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineOptions, defineProps } from 'vue'

defineOptions({
  name: 'availability-card'
})

defineProps({
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    team: {
      type: String,
    },
    availableDate: {
      type: String,
    },
    availablePercentage: {
      type: Number,
    },
    email: {
      type: String,
    },
    timesheetURL: {
      type: String,
    },
    githubURL: {
      type: String,
    }
  })
</script>
