<template>
  <div class="flex items-stretch flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Condition :icon="Bars4Icon" :title="'All'" :subTitle="'View All Projects'" :background="'bg-slate-600'" :link="'/projects'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Condition :icon="CheckCircleIcon" :title="'Green'" :subTitle="`${occurrences.green} Stable Projects`" :background="'bg-emerald-600'" :link="'/projects/green'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Condition :icon="ExclamationCircleIcon" :title="'Amber'" :subTitle="`${occurrences.amber} At Risk Projects`" :background="'bg-amber-600'" :link="'/projects/amber'" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Condition :icon="ExclamationTriangleIcon" :title="'Red'" :subTitle="`${occurrences.red} Critical Projects`" :background="'bg-red-700'" :link="'/projects/red'" />
    </div>
  </div>
</template>

<script setup>
import Condition from '@/components/Cards/Condition.vue'
import { Bars4Icon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useProjectsStore } from '../../stores'

const projectsStore = useProjectsStore()

let projects = projectsStore.getProjects().filter(project => project.stage === 'Awaiting Allocation' || project.stage === 'Allocated')

const occurrences = projects.reduce(function (conditions, project) {
  return conditions[project.condition] ? ++conditions[project.condition] : conditions[project.condition] = 1, conditions
}, { green: 0, amber: 0, red: 0})
</script>
