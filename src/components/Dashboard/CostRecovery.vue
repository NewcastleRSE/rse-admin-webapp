<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Finance
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Financial Year {{dates.startDate.year}}/{{dates.endDate.year}}
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="pb-8">
        <h4 class="sr-only">Cost Recovery</h4>
        <p class="text-sm font-medium text-gray-900">Cost Recovery</p>
        <div class="mt-2 relative" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: costRecoveryRate + '%' }" />
            <div class="absolute border-r-2 border-black h-6 -top-1" :style="{'left': progressThroughYear + '%'}"></div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="sr-only">Non-Staff Budget</h4>
        <p class="text-sm font-medium text-gray-900">Non-Staff Budget</p>
        <div class="mt-2 relative" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: budgetUsed + '%' }" />
            <div class="absolute border-r-2 border-black h-6 -top-1" :style="{'left': progressThroughYear + '%'}"></div>
          </div>
        </div>
      </div>
      <dl class="mt-10 grow grid grid-cols-1 gap-y-6 sm:grid-cols-1 lg:grid-cols-1">
        <div v-for="stat in stats" :key="stat.name" class="flex flex-wrap items-baseline gap-x-4 gap-y-2 bg-white">
          <dt class="text-sm font-medium leading-6 text-gray-500">{{ stat.name }}</dt>
          <dd class="text-gray-700 text-xs font-medium">{{ stat.ratio }}</dd>
          <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script setup>
import { useFacilitiesStore, useTransactionsStore } from '@/stores'
import { currentFY } from '../../utils/dates'

const facilitiesStore = useFacilitiesStore(),
      transactionsStore = useTransactionsStore()

const dates = currentFY()
const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

const transactionsSummary = transactionsStore.getSummary(dates.startDate.year),
      facility = facilitiesStore.getByYear(dates.startDate.year)

const monthsToDate = Math.floor(dates.currentDate.diff(dates.startDate, ['months']).months),
      progressThroughYear = ((monthsToDate / 12) * 100).toFixed(2)

const costRecoveryRate = ((transactionsSummary.income.total / facility.incomeTarget) * 100).toFixed(2)
      
const budgetUsed = (((transactionsSummary.nonSalaryExpenditure.total * -1) / facility.nonSalaryCosts) * 100).toFixed(2)

const stats = [
  { name: 'Revenue', value: formatter.format(transactionsSummary.income.total), ratio: costRecoveryRate + '%' },
  { name: 'Expenses', value: formatter.format((transactionsSummary.nonSalaryExpenditure.total * -1)), ratio: budgetUsed + '%' },
]
</script>
