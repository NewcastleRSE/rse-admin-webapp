<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Finance
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Financial Year {{currentYear}}
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="pb-8">
        <h4 class="sr-only">Cost Recovery</h4>
        <p class="text-sm font-medium text-gray-900">Cost Recovery</p>
        <div class="mt-2" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: costRecovery + '%' }" />
          </div>
        </div>
      </div>
      <div class="pb-8">
        <h4 class="sr-only">Faculty Contribution</h4>
        <p class="text-sm font-medium text-gray-900">Faculty Contribution</p>
        <div class="mt-2" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: facultyContribution + '%' }" />
          </div>
        </div>
      </div>
      <div>
        <h4 class="sr-only">Non-Staff Budget</h4>
        <p class="text-sm font-medium text-gray-900">Non-Staff Budget</p>
        <div class="mt-2" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: nonStaffBudget + '%' }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useFacilitiesStore, useTransactionsStore } from '@/stores'

const facilitiesStore = useFacilitiesStore(),
      transactionsStore = useTransactionsStore()

const FY = DateTime.local().month > 7 ? DateTime.local().year : DateTime.local().year - 1,
      FYStart = DateTime.fromObject({ year: FY, month: 8, day: 1})

const currentYear = ref(`${FYStart.year - 2000}/${FYStart.year - 1999}`)

const summary = transactionsStore.getSummary(FYStart.year),
      facility = facilitiesStore.getByYear(FYStart.year)

const totalCosts = facility.salaryCosts + facility.nonSalaryCosts + facility.estatesCosts

let costRecovery = 0,
    facultyContribution = 0,
    nonStaffBudget = 0

if(Object.keys(summary).length !== 0) {
  costRecovery = ref((summary.income.total / totalCosts) * 100),
  facultyContribution = ref((summary.indirectCostsAbsorbedRecovered.total * -1 / totalCosts) * 100),
  nonStaffBudget = ref((summary.nonSalaryExpenditure.total * -1 / facility.nonSalaryCosts) * 100)
}
</script>
