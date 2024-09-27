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
                                    <dd class="mt-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text font-medium ring-1 ring-inset" :class="totalUtilisation[rse.id] > facility.utilisationRate * 100 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'">Utilisation: {{totalUtilisation[rse.id] }}%</span>
                                    </dd>
                                </dl>
                            </a>
                            <div>
                                <div class="-mt-px flex divide-x divide-gray-200">
                                <div class="flex w-0 flex-1">
                                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                                        <CalendarDaysIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Timesheets
                                    </a>
                                </div>
                                <div class="-ml-px flex w-0 flex-1">
                                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                                        <ListBulletIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Assignments
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
import { useRSEsStore, useFacilitiesStore, useUserStore } from '../stores'
import { CalendarDaysIcon, ListBulletIcon } from '@heroicons/vue/24/outline'

const rsesStore = useRSEsStore(),
      facilitiesStore = useFacilitiesStore(),
      userStore = useUserStore(),
      rses = rsesStore.getRSEs(),
      utilisation = rsesStore.getUtilisation()

const { settings } = storeToRefs(userStore)

const facility = facilitiesStore.getByYear(settings.value.financialYear)



let totalUtilisation = {}

for(let rse of Object.keys(utilisation.rses)) {
    totalUtilisation[rse] = Number((utilisation.rses[rse].total.recorded / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
}

function getImageUrl(name) {
  return new URL(`../assets/img/avatars/${name}`, import.meta.url).href
}

</script>