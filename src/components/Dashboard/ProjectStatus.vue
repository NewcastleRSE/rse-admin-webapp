<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Projects
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Status
          </h2>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <ul role="list" class="divide-y divide-gray-100 px-4">
        <li v-for="project in projects" :key="project.id" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap">
          <div>
            <p class="text-sm font-semibold leading-6 text-gray-900">
              <a :href="`/projects/${project.id}`" class="hover:underline">{{ project.dealname }}</a>
            </p>
            <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p>
                {{ `${project.contacts[0].firstname}  ${project.contacts[0].lastname}` }}
              </p>
              <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <p>
                {{ project.school }}
              </p>
            </div>
          </div>
          <dl class="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
            <div class="flex w-16 gap-x-2.5">
              <dt>
                <span class="sr-only">Status</span>
                <ExclamationCircleIcon v-if="project.status === 'red'" class="h-6 w-6 text-red-600" aria-hidden="true" />
                <ExclamationTriangleIcon v-if="project.status === 'amber'" class="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </dt>
            </div>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>

import { ref } from 'vue'
import { useProjectsStore } from '@/stores'
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const projectsStore = useProjectsStore()

const active = projectsStore.getProjects().filter(project => project.dealstage === 'Awaiting Allocation' || project.dealstage === 'Allocated'),
      red = active.filter(project => project.status === 'red')
      // amber = active.filter(project => project.status === 'amber')

const projects = ref([...red])

</script>
