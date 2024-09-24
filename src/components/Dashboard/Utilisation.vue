<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="rounded-t mb-0 px-4 py-3 border-0">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        Team
                    </h6>
                    <h2 class="text-blueGray-700 text-xl font-semibold">
                        Utilisation
                    </h2>
                </div>
            </div>
        </div>
        <div class="block w-full overflow-x-auto">
            <dl
                class="mt-5 grid grid-cols-1 divide-x divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                <div v-for="item in stats" :key="item.name" class="px-4 py-5 sm:p-6">
                    <dt class="text-base font-normal text-gray-900">{{ item.name }}</dt>
                    <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div class="flex items-baseline text-2xl font-semibold text-cyan-600">
                            {{ item.stat }}
                        </div>
                        <div
                            :class="[item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0']">
                            <ArrowUpIcon v-if="item.changeType === 'increase'"
                                class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                                aria-hidden="true" />
                            <ArrowDownIcon v-else class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                                aria-hidden="true" />
                            <span class="sr-only"> {{ item.changeType === 'increase' ? 'Increased' : 'Decreased' }} by
                            </span>
                            {{ item.change }}
                        </div>
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>
<script setup>

import { DateTime } from 'luxon'
import { useRSEsStore, useFacilitiesStore } from '@/stores'
import { currentFY } from '../../utils/dates'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'

const dates = currentFY()

const rsesStore = useRSEsStore(),
    facilitiesStore = useFacilitiesStore()

const utilisation = rsesStore.getUtilisation(),
    facility = facilitiesStore.getByYear(dates.startDate.year)

const thisMonth = utilisation.months[DateTime.now().toFormat('MMMM')],
    lastMonth = utilisation.months[DateTime.now().startOf('month').minus({ days: 1 }).toFormat('MMMM')]

const utilisationTotal = utilisation.total.recorded / utilisation.total.capacity * 100,
      thisMonthTotal = thisMonth.recorded / thisMonth.capacity * 100,
      lastMonthTotal = lastMonth.recorded / lastMonth.capacity * 100

const utilisationTotalDiff = utilisationTotal - (facility.utilisationRate * 100),
      utilisationThisMonthDiff = thisMonthTotal - (facility.utilisationRate * 100),
      utilisationLastMonthDiff = lastMonthTotal - (facility.utilisationRate * 100)

const stats = [
    {
        name: 'This Year',
        stat: utilisationTotal.toFixed(2) + '%',
        change: utilisationTotalDiff.toFixed(2) + '%',
        changeType: utilisationTotalDiff > 0 ? 'increase' : 'decrease'
    },
    {
        name: 'Month to Date',
        stat: thisMonthTotal.toFixed(2) + '%',
        change: utilisationThisMonthDiff.toFixed(2) + '%',
        changeType: utilisationThisMonthDiff > 0 ? 'increase' : 'decrease'
    },
    {
        name: 'Last Month',
        stat: lastMonthTotal.toFixed(2) + '%',
        change: utilisationLastMonthDiff.toFixed(2) + '%',
        changeType: utilisationLastMonthDiff > 0 ? 'increase' : 'decrease'
    },
]

</script>