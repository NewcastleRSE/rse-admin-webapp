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
                <div v-for="item in stats" :key="item.name" class="px-4 py-2 sm:p-4">
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
import { storeToRefs } from 'pinia'
import { useRSEsStore, useFacilitiesStore, useUserStore } from '@/stores'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'

const rsesStore = useRSEsStore(),
    facilitiesStore = useFacilitiesStore(),
    userStore = useUserStore()

const { settings } = storeToRefs(userStore)

const utilisation = rsesStore.getUtilisation(),
      facility = facilitiesStore.getByYear(settings.value.financialYear)

for(const month in utilisation.months) {
    utilisation.months[month].utilisation = utilisation.months[month].recorded / utilisation.months[month].capacity * 100
}

const overall = utilisation.total.recorded / utilisation.total.capacity * 100

const monthlyAverage = Object.keys(utilisation.months).reduce((acc, month) => acc + utilisation.months[month].utilisation, 0) / Object.keys(utilisation.months).length

const highestMonthName = Object.keys(utilisation.months).reduce((a, b) => utilisation.months[a].utilisation > utilisation.months[b].utilisation ? a : b),
      lowestMonthName = Object.keys(utilisation.months).reduce((a, b) => utilisation.months[a].utilisation < utilisation.months[b].utilisation ? a : b)
      
const highest = utilisation.months[highestMonthName].utilisation,
      lowest = utilisation.months[lowestMonthName].utilisation

const stats = [
    {
        name: 'Overall',
        stat: overall.toFixed(2) + '%',
        change: (overall - (facility.utilisationRate * 100)).toFixed(2) + '%',
        changeType: (overall - (facility.utilisationRate * 100)) > 0 ? 'increase' : 'decrease'
    },
    {
        name: 'Monthly Average',
        stat: monthlyAverage.toFixed(2) + '%',
        change: (monthlyAverage - (facility.utilisationRate * 100)).toFixed(2) + '%',
        changeType: (monthlyAverage - (facility.utilisationRate * 100)) > 0 ? 'increase' : 'decrease'
    },
    {
        name: `${highestMonthName} (Highest)`,
        stat: highest.toFixed(2) + '%',
        change: (highest - (facility.utilisationRate * 100)).toFixed(2) + '%',
        changeType: (highest - (facility.utilisationRate * 100)) > 0 ? 'increase' : 'decrease'
    },
    {
        name: `${lowestMonthName} (Lowest)`,
        stat: lowest.toFixed(2) + '%',
        change: (lowest - (facility.utilisationRate * 100)).toFixed(2) + '%',
        changeType: (lowest - (facility.utilisationRate * 100)) > 0 ? 'increase' : 'decrease'
    },
]

</script>