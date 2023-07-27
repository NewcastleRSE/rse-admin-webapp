<template>
  <div class="flex items-stretch flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <ChartPieIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Finances</p>
        </dt>
        <dd class="ml-24 flex items-baseline pb-6 sm:pb-7">
            <p class="text-2xl font-semibold text-gray-900">20%</p>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/invoices`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <DocumentTextIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Invoices</p>
        </dt>
        <dd class="ml-24 mt-2 flex items-baseline grid grid-cols-1 gap-1 sm:grid-cols-3">
          <span  v-for="state in states" :key="state.name" :class="[state.bgColor, state.textColor, 'text-center rounded-md px-2 py-3 text-sm font-bold']">{{ state.count }} {{ state.name }}</span>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/budget`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <PresentationChartLineIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Budget</p>
        </dt>
        <dd class="ml-24 flex items-baseline pb-6 sm:pb-7">
            <p class="text-2xl font-semibold text-gray-900">20%</p>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/transactions`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <CurrencyPoundIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Finances</p>
        </dt>
        <dd class="ml-24 flex items-baseline pb-6 sm:pb-7">
            <p class="text-2xl font-semibold text-gray-900">20%</p>
        </dd>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { ChartPieIcon, CurrencyPoundIcon, PresentationChartLineIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useAssignmentsStore, useInvoicesStore, useProjectsStore } from '@/stores'

const assignmentsStore = useAssignmentsStore(),
      invoicesStore = useInvoicesStore(),
      projectsStore = useProjectsStore()

let currentDate = DateTime.utc(),
    startDate = DateTime.utc(currentDate.year, 8)

if(currentDate.month < 8) {
  startDate = startDate.minus({ year: 1 })
}

const invoices = invoicesStore.getByFinancialYear(startDate.year)
const monthsToDate = Math.floor(currentDate.diff(startDate, ['months']).values.months)

let expectedInvoices = 0

for (let i = 0; i < monthsToDate; i++) {

  const assignments = assignmentsStore.getByPeriod(startDate.toISODate(), currentDate.toISODate())
  const projectIDs = assignments.reduce(function (IDs, assignment) { return [...IDs, assignment.project.id] }, [])
  const projects = projectsStore.filterByIDs([...new Set(projectIDs)]).filter(project => project.costModel === 'Facility')

  expectedInvoices = expectedInvoices + projects.length

  startDate = startDate.plus({ month: 1 })
}

const states = [
  { 
    name: 'Due',
    count: expectedInvoices - invoices.filter(invoice => invoice.sent).length,
    bgColor: 'bg-red-100',
    textColor: 'text-red-700'
  },
  { 
    name: 'Sent',
    count: invoices.filter(invoice => invoice.sent && !invoice.processed).length,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  { 
    name: 'Processed',
    count: invoices.filter(invoice => invoice.processed && !invoice.paid).length,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
]

</script>
