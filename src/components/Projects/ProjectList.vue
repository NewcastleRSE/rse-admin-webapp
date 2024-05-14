<template>
    <ul v-if="projects.length" role="list" class="divide-y divide-gray-100">
      <li v-for="project in projects" :key="project.id" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap">
        <div class="flex flex-row items-center">
          <div class="pr-6">
            <ExclamationCircleIcon v-if="project.status === 'red'" class="h-8 w-8 text-red-600" aria-hidden="true" />
            <ExclamationTriangleIcon v-else-if="project.status === 'amber'" class="h-8 w-8 text-yellow-600" aria-hidden="true" />
            <CheckCircleIcon v-else class="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                    {{ project.name }}
                </p>
                <p v-if="project.stage === 'Awaiting Allocation'" class="text-red-700 bg-red-50 ring-red-600/20 rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">
                    {{ project.stage }}
                </p>
            </div>
            <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p v-if="project.contacts">
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
              <img class="h-8 w-8 rounded-full shadow-md bg-gray-50 ring-2 ring-white" :src="getImageUrl(rse.photo)" :alt="`${rse.firstname} ${rse.lastname}`" />
                <span class="z-10 group-hover:opacity-100 transition-opacity bg-gray-800 p-2 text-sm text-gray-100 rounded-md absolute left-1/2 
                -translate-x-1/2 translate-y-full opacity-0 mt-1 mx-auto whitespace-nowrap">{{rse.firstname}} {{rse.lastname}}</span>
              </div>
            </dd>
          </div>
          <!-- <div class="flex gap-x-2.5 ml-6">
            <a :href="project.clockifyLink" target="_blank">
              <Clockify class="h-8 w-8 external-service-icon clockify-icon" />
            </a>
            <a :href="project.hubspotLink" target="_blank">
              <HubSpot class="h-8 w-8 external-service-icon hubspot-icon" />
            </a>
          </div> -->
          <Menu as="div" class="relative flex gap-x-2.5 ml-6">
            <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
              <span class="sr-only">Open options</span>
              <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 divide-y divide-gray-100 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <div v-on:click="changeStatus(project, 'green')" :class="[active ? 'bg-gray-50' : '', 'flex items-center px-4 py-1 text-sm font leading-6 text-gray-900']">
                      <span class="grow">Stable</span>
                      <CheckIcon v-if="project.status === 'green'" class="h-5 w-5 text-gray-700" />
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <div v-on:click="changeStatus(project, 'amber')" :class="[active ? 'bg-gray-50' : '', 'flex items-center px-4 py-1 text-sm leading-6 text-gray-900']">
                      <span class="grow">At Risk</span>
                      <CheckIcon v-if="project.status === 'amber'" class="h-5 w-5 text-gray-700" />
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <div v-on:click="changeStatus(project, 'red')" :class="[active ? 'bg-gray-50' : '', 'flex items-center px-4 py-1 text-sm leading-6 text-gray-900']">
                      <span class="grow">Critical</span>
                      <CheckIcon v-if="project.status === 'red'" class="h-5 w-5 text-gray-700" />
                    </div>
                  </MenuItem>
                </div>
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a target="_blank" :href="project.hubspotLink" :class="[active ? 'bg-gray-50' : '', 'block px-4 py-1 text-sm leading-6 text-gray-900']">Hubspot</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a target="_blank" :href="project.clockifyLink" :class="[active ? 'bg-gray-50' : '', 'block px-4 py-1 text-sm leading-6 text-gray-900']">Clockify</a >
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </li>
    </ul>
    <div v-else>
      <p class="text-center my-8 font-semibold">There are no projects with this status.</p>
    </div>
</template> 
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import { useRoute } from 'vue-router'
import { useAssignmentsStore, useProjectsStore, useRSEsStore } from '../../stores'
import { currentFY } from '../../utils/dates'
import { CheckIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const status = route.path.split('/')[2]

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()

let projects = projectsStore.getProjects().filter(project => project.stage === 'Awaiting Allocation' || project.stage === 'Allocated')

if(status) {
  projects = projects.filter(project => project.status === status)
}

const dates = currentFY()

projects.forEach((project, index) => {
    const assignments = assignmentsStore.getByProject(project.id)

    let rseIDs = null
    projects[index].rses = []

    if(assignments && assignments.length) {
        rseIDs = new Set(assignments.map(assignment => assignment.rse.id))
        rseIDs.forEach(id => projects[index].rses.push(rsesStore.getByID(id)))
    }
    
    projects[index].hubspotLink = 'https://app.hubspot.com/contacts/5251042/deal/' + project.hubspotId
    projects[index].clockifyLink = `https://app.clockify.me/reports/summary?start=${dates.startDate.toISO()}&end=${dates.currentDate.toISO()}&filterValuesData=%7B%22projects%22:%5B%22${project.clockifyID}%22%5D%7D&filterOptions=%7B%22projects%22:%7B%22status%22:%22ALL%22%7D%7D`
})

function getImageUrl(name) {
  return new URL(`../../assets/img/avatars/${name}`, import.meta.url).href
}

function changeStatus(project, status) {
  projectsStore.changeStatus(project.id, status)
}

</script>