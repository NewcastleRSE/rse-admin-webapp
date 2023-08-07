<template>
    <ul role="list" class="divide-y divide-gray-100">
      <li v-for="project in projects" :key="project.id" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap">
        <div>
          <p class="text-sm font-semibold leading-6 text-gray-900">
            {{ project.dealname }}
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
          <div class="flex -space-x-0.5">
            <dt class="sr-only">RSEs</dt>
            <dd v-for="rse in project.rses" :key="rse.id">
              <div class="group flex relative">
              <img class="h-8 w-8 rounded-full shadow-md bg-gray-50 ring-2 ring-white" :src="`/src/assets/img/avatars/${rse.photo}`" :alt="`${rse.firstname} ${rse.lastname}`" />
                <span class="z-10 group-hover:opacity-100 transition-opacity bg-gray-800 p-2 text-sm text-gray-100 rounded-md absolute left-1/2 
                -translate-x-1/2 translate-y-full opacity-0 mt-1 mx-auto whitespace-nowrap">{{rse.firstname}} {{rse.lastname}}</span>
              </div>
            </dd>
          </div>
          <div class="flex w-16 gap-x-2.5">
            <dt>
              <span class="sr-only">Status</span>
              <ExclamationCircleIcon v-if="project.status === 'red'" class="h-8 w-8 text-red-600" aria-hidden="true" />
              <ExclamationTriangleIcon v-else-if="project.status === 'amber'" class="h-8 w-8 text-yellow-600" aria-hidden="true" />
              <CheckCircleIcon v-else class="h-8 w-8 text-gray-400" aria-hidden="true" />
            </dt>
            <dd class="text-sm leading-6 text-gray-900">
                <img :src="GitHub" class="block w-10" />
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  </template>
  
<script setup>
import { useAssignmentsStore, useProjectsStore, useRSEsStore } from '../../stores'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import GitHub from '../../assets/img/icons/github.svg'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()

const projects = projectsStore.getProjects().filter(project => project.dealstage === 'Awaiting Allocation' || project.dealstage === 'Allocated')

projects.forEach((project, index) => {
    const assignments = assignmentsStore.getByProject(project.id)

    let rseIDs = null
    projects[index].rses = []

    if(assignments && assignments.length) {
        rseIDs = new Set(assignments.map(assignment => assignment.rse))
        rseIDs.forEach(id => projects[index].rses.push(rsesStore.getByID(id)))
    }    
})

console.log(projects)

</script>