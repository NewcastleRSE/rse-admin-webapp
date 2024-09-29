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
                <div class="block w-full overflow-x-auto px-4 pb-4">
                    <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <li v-for="rse in rses" :key="rse.id" class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
                            <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="flex flex-1 flex-col p-8">
                                <img class="mx-auto h-32 w-32 flex-shrink-0 rounded-full" :src="getImageUrl(rse.photo)" :alt="rse.displayName" />
                                <h3 class="mt-6 text-sm font-medium text-gray-900">{{ rse.displayName }}</h3>
                                <dl class="mt-1 flex flex-grow flex-col justify-between">
                                    <dt class="sr-only">Team</dt>
                                    <dd class="text-sm text-gray-500">{{ rse.team }}</dd>
                                    <dt class="sr-only">Role</dt>
                                </dl>
                            </a>
                            <div>
                                <div class="-mt-px flex divide">
                                    <div class="flex w-0 flex-1 border-t border-b border-l rounded-bl-lg" :class="totalUtilisation[rse.id].actual >= totalUtilisation[rse.id].target ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                        <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                            <span class="font-semibold">{{totalUtilisation[rse.id].actual }}%</span>
                                            <span>Total</span>
                                        </a>
                                    </div>
                                    <div class="flex w-0 flex-1 border" :class="billableUtilisation[rse.id].actual >= (billableUtilisation[rse.id].target * 0.95) ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                        <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                            <span class="font-semibold">{{billableUtilisation[rse.id].actual }}%</span>
                                            <span>Billable</span>
                                        </a>
                                    </div>
                                    <div class="flex w-0 flex-1 border-box border-t border-r border-b rounded-br-lg" :class="nonBillableUtilisation[rse.id].actual <= (nonBillableUtilisation[rse.id].target * 1.05) ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                        <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                            <span class="font-semibold">{{nonBillableUtilisation[rse.id].actual }}%</span>
                                            <span>Non-Billable</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAssignmentsStore, useRSEsStore, useFacilitiesStore, useUserStore } from '../stores'

const assignmentsStore = useAssignmentsStore(),
      rsesStore = useRSEsStore(),
      facilitiesStore = useFacilitiesStore(),
      userStore = useUserStore(),
      rses = rsesStore.getRSEs(),
      utilisation = rsesStore.getUtilisation()

const { settings } = storeToRefs(userStore)

const facility = facilitiesStore.getByYear(settings.value.financialYear)

let totalUtilisation = {},
    billableUtilisation = {},
    nonBillableUtilisation = {}

for(let rse of rses.map(rse => rse.id)) {
    const assingnments = assignmentsStore.getByRSE(rse)

    const management = assingnments.filter(assignment => assignment.project.name === 'Management')

    let billableTarget = facility.utilisationRate * 100
    let nonBillableTarget = 100 - billableTarget

    if(management.length > 0) {
        nonBillableTarget = 50
        billableTarget = 50

        if(management[0].fte === 100) {
            billableTarget = 0
            nonBillableTarget = 100
        }
    }

    totalUtilisation[rse] = { target: facility.utilisationRate * 100, actual: 0 }
    billableUtilisation[rse] = { target: billableTarget, actual: 0 }
    nonBillableUtilisation[rse] = { target: nonBillableTarget, actual: 0 }

    if(utilisation.rses[rse]) {
        totalUtilisation[rse].actual = Number((utilisation.rses[rse].total.recorded / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
        billableUtilisation[rse].actual = Number((utilisation.rses[rse].total.billable / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
        nonBillableUtilisation[rse].actual = Number((utilisation.rses[rse].total.nonBillable / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
    }
    else {
        
    }
}

function getImageUrl(name) {
  return new URL(`../assets/img/avatars/${name}`, import.meta.url).href
}

</script>