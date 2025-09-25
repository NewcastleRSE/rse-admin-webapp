<template>
    <div class="w-full mb-12">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 px-4 pt-4 shadow-lg rounded bg-white h-full">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
                        Finance
                    </h6>
                    <h2 class="text-slate-700 text-xl font-semibold">
                        Cost Recovery
                    </h2>
                </div>
            </div>
            <div class="relative my-4" aria-hidden="true">
                <div class="overflow-hidden rounded-full bg-gray-200 h-8 relative">
                    <div class="h-8 absolute bg-cyan-600 left-0" :style="{ width: `${revenue}%` }" />
                    <div class="h-8 absolute bg-yellow-400" :style="{ left: `${revenue}%`, width: `${invoiced}%` }" />
                </div>
                <div class="h-12 w-0.5 -top-2 absolute bg-black" :style="{ left: `${progressThroughYear}%` }" />
            </div>
            <div class="flex px-4 py-3">
                <ul class="py-2">
                    <li class="float-left">
                        <i class="fa-solid fa-square text-cyan-600"></i>
                        <span class="pl-2 pr-6">Revenue</span>
                    </li>
                    <li class="float-left">
                        <i class="fa-solid fa-square text-yellow-400"></i>
                        <span class="pl-2 pr-6">Invoiced</span>
                    </li>
                </ul>
            </div>
            <dl class="grow grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="stat in stats" :key="stat.name" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white p-4 sm:px-6 xl:px-8">
                <dt class="text-sm font-medium leading-6 text-gray-500">{{ stat.name }}</dt>
                <dd class="text-gray-700 text-xs font-medium">{{ stat.ratio }}</dd>
                <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">{{ stat.value }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>
<script setup>
import { useFacilitiesStore, useInvoicesStore, useTransactionsStore } from '../../stores'
import { currentFY } from '../../utils/dates'

const facilitiesStore = useFacilitiesStore(),
      invoicesStore = useInvoicesStore(),
      transactionsStore = useTransactionsStore(),
      dates = currentFY()

const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
const facility = facilitiesStore.getByYear(dates.startDate.year)
const transactionsSummary = transactionsStore.getSummary(dates.startDate.year)
const budgetUsed = (((transactionsSummary.nonSalaryExpenditure.total * -1) / facility.nonSalaryCosts) * 100).toFixed(2)

let revenueTotal = transactionsSummary.income.total,
    invoicedTotal = 0

invoicesStore.getByFinancialYear(dates.startDate.year)
             .filter(invoice => invoice.transaction === null)
             .forEach(invoice => invoicedTotal += Number(invoice.price * invoice.units))

const revenue = ((revenueTotal / facility.incomeTarget) * 100).toFixed(2),
      invoiced = ((invoicedTotal / facility.incomeTarget) * 100).toFixed(2)

const progressThroughYear = ((Math.floor(dates.currentDate.diff(dates.startDate, ['months']).months) / 12) * 100).toFixed(2)

const stats = [
  { name: 'Revenue', value: formatter.format(revenueTotal), ratio: revenue + '%' },
  { name: 'Invoiced', value: formatter.format(invoicedTotal.toFixed(2)), ratio: invoiced + '%' },
  { name: 'Secured', value: '£0', ratio: '0%' },
  { name: 'Expenses', value: formatter.format((transactionsSummary.nonSalaryExpenditure.total * -1)), ratio: budgetUsed + '%' },
]
</script>