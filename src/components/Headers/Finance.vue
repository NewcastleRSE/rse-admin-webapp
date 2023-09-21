<template>
  <div class="flex items-stretch flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance`})" class="relative overflow-hidden rounded bg-white px-4 py-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-600 p-3">
                <ArrowTrendingUpIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Cost Recovery</p>
        </dt>
        <dd class="ml-24 flex items-baseline mt-2">
            <p class="text-4xl font-semibold text-gray-900">{{ costRecoveryRate.toFixed(1) }}%</p>
            <p :class="[costRecoveryRate > (facility.utilisationRate * 100) ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold']">
              <ArrowUpIcon v-if="costRecoveryRate > (facility.utilisationRate * 100)" class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
              <ArrowDownIcon v-else class="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
              <span class="sr-only"> {{ costRecoveryRate > (facility.utilisationRate * 100) ? 'Increased' : 'Decreased' }} by </span>
              {{ Math.abs(costRecoveryRate - (facility.utilisationRate * 100)).toFixed(1) }}%
            </p>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/invoices`})" class="relative overflow-hidden rounded bg-white px-4 py-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-600 p-3">
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
      <div v-on:click="$router.push({path:`/finance/budget`})" class="relative overflow-hidden rounded bg-white px-4 py-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-600 p-3">
                <CreditCardIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Non-Staff Budget</p>
        </dt>
        <dd class="ml-24">
          <p class="mt-1 font-bold text-sm">{{ spend }} of {{ budget }}</p>
          <div class="relative">
            <div class="mt-1 overflow-hidden w-full rounded bg-gray-200">
              <div class="h-6 bg-cyan-600 text-white text-xs font-bold leading-6 text-right align-middle pr-3.5" :style="{'width': budgetUsed + '%'}">
                <span class="absolute" :class="budgetUsed < 50 ? 'text-black pl-2' : 'text-white'" :style="{'left': budgetUsed + '%'}" v-if="budgetUsed > 0">{{ budgetUsed.toFixed(2) }}%</span>
              </div>
              <div class="absolute border-r-2 border-black h-8 -top-1" :style="{'left': progressThroughYear + '%'}"></div>
            </div>
          </div>
        </dd>
      </div>
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <div v-on:click="$router.push({path:`/finance/transactions/${startDate.year}`})" class="relative overflow-hidden rounded bg-white px-4 py-5 shadow-lg sm:px-6 sm:pt-6 h-full">
        <dt>
            <div class="absolute rounded-md bg-cyan-600 p-3">
                <CurrencyPoundIcon class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">Transactions Up To</p>
        </dt>
        <dd class="ml-24 items-baseline">
            <p class="text-2xl font-semibold text-gray-900">{{ upToDate }}</p>
            <p class="text-sm font-medium text-gray-500">{{ daysPassed }} days ago</p>
        </dd>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon-business-days'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
import { ArrowTrendingUpIcon, CreditCardIcon, CurrencyPoundIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useAssignmentsStore, useFacilitiesStore, useInvoicesStore, useProjectsStore, useTransactionsStore } from '@/stores'
import { currentFY } from '../../utils/dates'

const dates = currentFY()

const assignmentsStore = useAssignmentsStore(),
      facilitiesStore = useFacilitiesStore(),
      invoicesStore = useInvoicesStore(),
      projectsStore = useProjectsStore(),
      transactionsStore = useTransactionsStore()

// let currentDate = DateTime.utc(),
//     startDate = DateTime.utc(currentDate.year, 8)

// if(currentDate.month < 8) {
//   startDate = startDate.minus({ year: 1 })
// }

const assignments = assignmentsStore.getByPeriod(dates.startDate.toISODate(), dates.currentDate.toISODate())
const facility = facilitiesStore.getByYear(dates.startDate.year)
const invoices = invoicesStore.getByFinancialYear(dates.startDate.year)
const transactionsSummary = transactionsStore.getSummary(dates.startDate.year)

/**
 * Cost Recovery
 */

const costRecoveryRate = 68.44357

/**
 * Invoice state counts
 */

const monthsToDate = Math.floor(dates.currentDate.diff(dates.startDate, ['months']).values.months)

let expectedInvoices = 0

for (let i = 0; i < monthsToDate; i++) {
  const projectIDs = assignments.reduce(function (IDs, assignment) { return [...IDs, assignment.project.id] }, [])
  const projects = projectsStore.filterByIDs([...new Set(projectIDs)]).filter(project => project.costModel === 'Facility')
  expectedInvoices = expectedInvoices + projects.length
  dates.startDate = dates.startDate.plus({ month: 1 })
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

const progressThroughYear = ((DateTime.now().workingDiff(dates.startDate, 'days') / 365) * 100).toFixed(0)
const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

const budget = formatter.format(facility.nonSalaryCosts)
const spend = formatter.format((transactionsSummary.nonSalaryExpenditure.total * -1))
const budgetUsed = ((transactionsSummary.nonSalaryExpenditure.total * -1) / facility.nonSalaryCosts) * 100

/**
 * Transactions validity date
 */

const upToDate = transactionsSummary.lastUpdated.toLocaleString()
const daysPassed = Math.round(dates.currentDate.diff(transactionsSummary.lastUpdated, ['days']).toObject().days)

</script>
