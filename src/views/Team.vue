<template>
    <div class="w-full -mt-24">
      <div class="flex flex-wrap">
        <div class="w-full px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div class="rounded-t mb-0 px-4 py-3 border-0">
                    <div class="flex flex-wrap items-center">
                        <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                            Team
                        </h6>
                        <h2 class="text-blueGray-700 text-xl font-semibold">
                            Overview
                        </h2>
                        </div>
                    </div>
                </div>
                <div class="block w-full overflow-x-auto px-4">
                    <ul role="list" class="divide-y divide-gray-100">
                        <list-item v-for="rse in rses" :key="rse.id" :rse="rse" />
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import ListItem from '../components/Team/ListItem.vue'
import { useRSEsStore } from '../stores'
import { useCapacitiesStore } from '@/stores/capacities'

const rsesStore = useRSEsStore()
const capacitiesStore = useCapacitiesStore()
const rses = rsesStore.getRSEs()

let totals = []

rses.forEach(rse => {
    console.log(rse.displayName)
    const monthlyCapacities = []
    for(let i = 1; i < 13; i++) {

        if(i < 10) {
            i = `0${i}`
        }

        const capacity = capacitiesStore.getCapacityInPeriod(`2023-${i}-01`, `2023-${i}-31`, rse.id)

        if(capacity.length > 1) {
            console.log('Multiple capacities found for month ' + i)
        }

        let days = capacity.length > 0 ? (18.3333 * (capacity[0].capacity / 100)) : 0

        if(rse.displayName === 'Mark Turner') {
            days = 0
        }
        else if(rse.displayName === 'Kate Court' || rse.displayName === 'Becky Osselton') {
            days = days * 0.5
        }

        monthlyCapacities.push(days)
    }
    totals.push(monthlyCapacities)
})

let result = totals.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), [])
console.log(result.toString())
</script>