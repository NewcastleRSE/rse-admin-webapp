<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
            Finance
          </h6>
          <h2 class="text-slate-700 text-xl font-semibold">
            {{startDate.year}}/{{endDate.year}}
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
            <div v-if="progressThroughYear < 100" class="absolute border-r-2 border-black h-6 -top-1" :style="{'left': progressThroughYear + '%'}"></div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="sr-only">Non-Staff Budget</h4>
        <p class="text-sm font-medium text-gray-900">Non-Staff Budget</p>
        <div class="mt-2 relative" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-4 rounded-full bg-cyan-600" :style="{ width: budgetUsed + '%' }" />
            <div v-if="progressThroughYear < 100" class="absolute border-r-2 border-black h-6 -top-1" :style="{'left': progressThroughYear + '%'}"></div>
          </div>
        </div>
      </div>
      <dl class="mt-10 grow grid grid-cols-1 gap-y-6 sm:grid-cols-1 lg:grid-cols-1">
        <div v-for="stat in stats" :key="stat.name" class="flex flex-wrap items-baseline gap-x-4 gap-y-2 bg-white">
          <dt class="text-sm font-medium leading-6 text-gray-500">{{ stat.name }}</dt>
          <dd class="text-gray-700 text-xs font-medium">{{ stat.ratio }}</dd>
          <dd class="w-full flex-none font-medium leading-10 tracking-tight text-gray-900">
            <span class="text-3xl ">{{ stat.actual }}</span>
            <span class="text-sm "> of {{ stat.budget }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFacilitiesStore, useFinancesStore, useUserStore } from '@/stores'
import { DateTime } from 'luxon'

const facilitiesStore = useFacilitiesStore(),
      financesStore = useFinancesStore(),
      userStore = useUserStore()

const { settings } = storeToRefs(userStore)

let costRecoveryRate = ref(0),
    budgetUsed = ref(0),
    stats = ref([
      { name: 'Revenue', value: 0, ratio: '0%' },
      { name: 'Expenses', value: 0, ratio: '0%' },
    ])

let startDate = DateTime.fromFormat(`${settings.value.financialYear}-08-01`, 'yyyy-MM-dd').startOf('day'),
    endDate = startDate.plus({ years: 1 }).minus({ days: 1 }).endOf('day')

const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

const finance = financesStore.getByYear(settings.value.financialYear)

const monthsToDate = Math.floor(DateTime.now().diff(startDate, ['months']).months),
      progressThroughYear = ((monthsToDate / 12) * 100).toFixed(2)

if(finance) {

  const actualRecovery = finance.totalActualIncome || 0,
        budgetedRecovery = finance.totalBudgetedIncome || 0

        costRecoveryRate.value = ((actualRecovery / budgetedRecovery) * 100).toFixed(2),
        budgetUsed.value = ((finance.totalActualNonSalary / finance.totalBudgetedNonSalary) * 100).toFixed(2)

  stats.value = [
    { 
      name: 'Revenue',
      actual: formatter.format(finance.totalActualIncome * -1),
      budget: formatter.format(finance.totalBudgetedIncome * -1),
      ratio: costRecoveryRate.value + '%'
    },
    { 
      name: 'Expenses',
      actual: formatter.format(Math.abs(finance.totalActualNonSalary)),
      budget: formatter.format(Math.abs(finance.totalBudgetedNonSalary)),
      ratio: budgetUsed.value + '%'
    },
  ]
}


</script>
