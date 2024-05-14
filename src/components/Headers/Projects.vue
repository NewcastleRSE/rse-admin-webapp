<template>
  <div class="flex items-stretch flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Status :icon="Bars4Icon" :title="'All'" :subTitle="'View All Projects'" :background="'bg-blueGray-600'" :link="'/projects'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Status :icon="CheckCircleIcon" :title="'Green'" :subTitle="`${occurrences.green} Stable Projects`" :background="'bg-emerald-600'" :link="'/projects/green'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Status :icon="ExclamationCircleIcon" :title="'Amber'" :subTitle="`${occurrences.amber} At Risk Projects`" :background="'bg-amber-600'" :link="'/projects/amber'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Status :icon="ExclamationTriangleIcon" :title="'Red'" :subTitle="`${occurrences.red} Critical Projects`" :background="'bg-red-700'" :link="'/projects/red'" />
    </div>
  </div>
</template>

<script setup>
import Status from '@/components/Cards/Status.vue'
import { Bars4Icon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useProjectsStore } from '../../stores'

const projectsStore = useProjectsStore()

let projects = projectsStore.getProjects().filter(project => project.stage === 'Awaiting Allocation' || project.stage === 'Allocated')

const occurrences = projects.reduce(function (statuses, project) {
  return statuses[project.status] ? ++statuses[project.status] : statuses[project.status] = 1, statuses
}, { green: 0, amber: 0, red: 0})
</script>
