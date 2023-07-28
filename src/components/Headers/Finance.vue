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
          <span  v-for="state in states" :key="state.name" :class="[state.bgColor, state.textColor, 'text-center rounded-md px-2 py-3 text-sm font-bold truncate overflow-hidden']">{{ state.count }} {{ state.name }}</span>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/budget`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <PresentationChartLineIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Non-Staff Budget</p>
        </dt>
        <dd class="ml-24">
          <p class="mt-1 font-bold text-sm">{{ spend }} of {{ budget }}</p>
          <div class="relative">
            <div class="mt-1 overflow-hidden w-full rounded-full bg-gray-200">
            <div class="h-6 rounded-full bg-cyan-600 text-white text-sm font-bold leading-6 text-right align-middle pr-3.5" :style="{'width': budgetUsed + '%'}">
              <span v-if="budgetUsed > 10">{{ budgetUsed.toFixed(2) }}%</span>
            </div>
            <div class="absolute border-r-2 border-black h-10 -top-2" :style="{'left': yearCompleted + '%'}"></div>
          </div>
          </div>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/transactions/2022`})" class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <CurrencyPoundIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Transactions</p>
        </dt>
        <dd class="ml-24 items-baseline">
            <p class="text-2xl font-semibold text-gray-900">Until {{ upToDate }}</p>
            <p class="text-sm text-gray-900">{{ daysPassed }} days ago</p>
        </dd>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { ChartPieIcon, CurrencyPoundIcon, PresentationChartLineIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useAssignmentsStore, useFacilitiesStore, useInvoicesStore, useProjectsStore, useTransactionsStore } from '@/stores'

const assignmentsStore = useAssignmentsStore(),
      facilitiesStore = useFacilitiesStore(),
      invoicesStore = useInvoicesStore(),
      projectsStore = useProjectsStore(),
      transactionsStore = useTransactionsStore()

const transactionsSummary = transactionsStore.getSummary(2022)
/**
 * Invoice state counts
 */
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

/**
 * Budget progress bar
 */

const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

const facility = facilitiesStore.getByYear(2022)
const diff = startDate.plus({year: 1}).minus({day: 1}).diff(currentDate, ['days'])
const budget = formatter.format(facility.nonSalaryCosts)
const spend = formatter.format((transactionsSummary.nonSalaryExpenditure.total * -1))
const budgetUsed = (transactionsSummary.nonSalaryExpenditure.total * -1) / facility.nonSalaryCosts
const yearCompleted = (100 - (diff.toObject().days / 365))

/**
 * Transactions validity date
 */

const upToDate = transactionsSummary.lastUpdated.toLocaleString()
const daysPassed = Math.round(currentDate.diff(transactionsSummary.lastUpdated, ['days']).toObject().days)

</script>
