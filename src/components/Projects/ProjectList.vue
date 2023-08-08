<template>
    <ul role="list" class="divide-y divide-gray-100">
      <li v-for="project in projects" :key="project.id" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap">
        <div class="flex flex-row items-center">
          <div class="pr-6">
            <ExclamationCircleIcon v-if="project.status === 'red'" class="h-8 w-8 text-red-600" aria-hidden="true" />
            <ExclamationTriangleIcon v-else-if="project.status === 'amber'" class="h-8 w-8 text-yellow-600" aria-hidden="true" />
            <CheckCircleIcon v-else class="h-8 w-8 text-gray-400" aria-hidden="true" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                    {{ project.dealname }}
                </p>
                <p v-if="project.dealstage === 'Awaiting Allocation'" class="text-red-700 bg-red-50 ring-red-600/20 rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">
                    {{ project.dealstage }}
                </p>
            </div>
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
        </div>
        <div class="flex w-full sm:w-auto">
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
          <div class="flex gap-x-2.5 ml-6">
            <a :href="project.clockifyLink" target="_blank">
              <Clockify class="h-8 w-8 external-service-icon clockify-icon" />
            </a>
            <a :href="project.hubspotLink" target="_blank">
              <HubSpot class="h-8 w-8 external-service-icon hubspot-icon" />
            </a>
          </div>
        </div>
      </li>
    </ul>
</template>
<style>
li .external-service-icon path {
    fill: #f3f4f6;
}

li:hover .external-service-icon.clockify-icon path:first-child {
    fill: #222222;
}

li:hover .external-service-icon.clockify-icon path:last-child {
    fill: #03a9f4;
}

li:hover .external-service-icon.hubspot-icon path {
    fill: #F8761F;
}
</style>  
<script setup>
import { useAssignmentsStore, useProjectsStore, useRSEsStore } from '../../stores'
import { currentFY } from '../../utils/dates'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Clockify from '../../assets/icons/clockify.svg'
import HubSpot from '../../assets/icons/hubspot.svg'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()

const projects = projectsStore.getProjects().filter(project => project.dealstage === 'Awaiting Allocation' || project.dealstage === 'Allocated')

const dates = currentFY()

projects.forEach((project, index) => {
    const assignments = assignmentsStore.getByProject(project.id)

    let rseIDs = null
    projects[index].rses = []

    if(assignments && assignments.length) {
        rseIDs = new Set(assignments.map(assignment => assignment.rse))
        rseIDs.forEach(id => projects[index].rses.push(rsesStore.getByID(id)))
    }
    
    projects[index].hubspotLink = 'https://app.hubspot.com/contacts/5251042/deal/' + project.hubspotId
    projects[index].clockifyLink = `https://app.clockify.me/reports/summary?start=${dates.startDate.toISO()}&end=${dates.currentDate.toISO()}&filterValuesData=%7B%22projects%22:%5B%22${project.clockifyID}%22%5D%7D&filterOptions=%7B%22projects%22:%7B%22status%22:%22ALL%22%7D%7D`
})

</script>