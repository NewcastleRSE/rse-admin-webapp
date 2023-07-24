<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 px-4 py-12 shadow-lg rounded bg-white">
      <div class="mx-auto w-full">
        <div class="mx-auto divide-y divide-gray-900/10">
          <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">2022/23 Invoices</h2>
          <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
            <Disclosure as="div" v-for="month in months" :key="month.name" class="pt-6" v-slot="{ open }">
              <dt>
                <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                  <span class="text-base font-semibold leading-7">{{ month.name }} {{ month.year }}</span>
                  <span class="ml-6 flex h-7 items-center">
                    <ChevronRightIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                    <ChevronDownIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2 pr-12">
                <ul role="list" class="divide-y divide-gray-100">
                  <li v-for="project in month.projects" :key="project.id" class="flex items-center justify-between gap-x-6 py-5">
                    <div class="min-w-0">
                      <div class="flex items-start gap-x-3">
                        <p class="text-sm font-semibold leading-6 text-gray-900">{{ project.dealname }}</p>
                        <p :class="[statuses['Sent'], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">Sent</p>
                      </div>
                      <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p class="whitespace-nowrap">
                          {{ project.contacts[0].firstname }} {{ project.contacts[0].lastname}}
                        </p>
                        <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        <p class="truncate">{{ project.school }}</p>
                      </div>
                    </div>
                    <div class="flex flex-none items-center gap-x-4">
                      <a :href="project.href" class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
                        View project<span class="sr-only">, {{ project.name }}</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DateTime } from 'luxon'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAssignmentsStore, useProjectsStore } from '@/stores'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore()

let currentDate = DateTime.utc(),
    startDate = DateTime.utc(currentDate.year, 8)

if(currentDate.month < 8) {
  startDate = startDate.minus({ year: 1 })
} 

const monthsToDate = Math.floor(currentDate.diff(startDate, ['months']).values.months)

const months = []

for (let i = 0; i < monthsToDate; i++) {

  const assignments = assignmentsStore.getByPeriod(startDate.toISODate(), currentDate.toISODate())
  const projectIDs = assignments.reduce(function (IDs, assignment) { return [...IDs, assignment.project.id] }, [])
  const projects = projectsStore.filterByIDs([...new Set(projectIDs)]).filter(project => project.costModel === 'Facility')

  months.push({
    name: startDate.monthLong,
    year: startDate.year,
    total: 11,
    sent: 11,
    processed: 9,
    paid: 2,
    projects: projects
  })
  startDate = startDate.plus({ month: 1 })
}

months.reverse()

const statuses = {
  Sent: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  Processed: 'text-blue-600 bg-blue-50 ring-blue-500/10',
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
}

</script>