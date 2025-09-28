<template>
    <div class="flex flex-wrap">
        <div class="w-full my-2 px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div class="rounded-t mb-0 px-4 py-3 border-0">
                    <div class="flex flex-wrap items-center">
                        <div class="relative w-full max-w-full flex-grow flex">
                            <div class="flex-1">
                                <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
                                    Team
                                </h6>
                                <h2 class="text-slate-700 text-xl font-semibold">
                                    Overview
                                </h2>
                            </div>
                            <Listbox as="div" v-model="selected" class="flex-none w-64">
                                <div class="relative mt-2">
                                    <ListboxButton
                                        class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
                                        <span class="block truncate">{{ selected.name }}</span>
                                        <span
                                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </ListboxButton>

                                    <transition leave-active-class="transition ease-in duration-100"
                                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                                        <ListboxOptions
                                            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            <ListboxOption as="template" v-for="team in teams" :key="team.id"
                                                :value="team" v-slot="{ active, selected }">
                                                <li
                                                    :class="[active ? 'bg-cyan-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                                                    <span
                                                        :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                                                        team.name }}</span>

                                                    <span v-if="selected"
                                                        :class="[active ? 'text-white' : 'text-cyan-600', 'absolute inset-y-0 left-0 flex items-center pl-1.5']">
                                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                </li>
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </transition>
                                </div>
                            </Listbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full px-4">
            <div class="block w-full overflow-x-auto pb-4">
                <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <li v-for="rse in filteredRSEs" :key="rse.documentId"
                        class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-lg">
                        <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`"
                            class="flex flex-1 flex-col p-8">
                            <img class="mx-auto h-32 w-32 flex-shrink-0 rounded-full" :src="getImageUrl(rse.photo)"
                                :alt="rse.displayName" />
                            <h3 class="mt-6 text-sm font-medium text-gray-900">{{ rse.displayName }}</h3>
                            <dl class="mt-1 flex flex-grow flex-col justify-between">
                                <dt class="sr-only">Team</dt>
                                <dd class="text-sm text-gray-500">{{ getTeamFromValue(rse.team).name }}</dd>
                                <dt class="sr-only">Role</dt>
                            </dl>
                        </a>
                        <div>
                            <div class="-mt-px flex divide">
                                <div class="flex w-0 flex-1 border-t border-b border-l rounded-bl-lg"
                                    :class="totalUtilisation[rse.documentId].actual >= totalUtilisation[rse.documentId].target ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`"
                                        class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                        <span class="font-semibold">{{ totalUtilisation[rse.documentId].actual }}%</span>
                                        <span>Total</span>
                                    </a>
                                </div>
                                <div class="flex w-0 flex-1 border"
                                    :class="billableUtilisation[rse.documentId].actual >= (billableUtilisation[rse.documentId].target * 0.95) ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`"
                                        class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                        <span class="font-semibold">{{ billableUtilisation[rse.documentId].actual }}%</span>
                                        <span>Billable</span>
                                    </a>
                                </div>
                                <div class="flex w-0 flex-1 border-box border-t border-r border-b rounded-br-lg"
                                    :class="nonBillableUtilisation[rse.documentId].actual <= (nonBillableUtilisation[rse.documentId].target * 1.05) ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'">
                                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`"
                                        class="relative -mr-px inline-flex w-full flex-col items-center justify-center gap-y-2 rounded-bl-lg border border-transparent py-2 text-sm">
                                        <span class="font-semibold">{{ nonBillableUtilisation[rse.documentId].actual }}%</span>
                                        <span>Non-Billable</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- </div> -->
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssignmentsStore, useRSEsStore, useFacilitiesStore, useUserStore } from '../stores'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const assignmentsStore = useAssignmentsStore(),
    rsesStore = useRSEsStore(),
    facilitiesStore = useFacilitiesStore(),
    userStore = useUserStore(),
    rses = rsesStore.getRSEs(),
    utilisation = rsesStore.getUtilisation()

const { settings } = storeToRefs(userStore)

const teams = [
    { id: 1, value: 'All', name: 'All' },
    { id: 2, value: 'DataScience', name: 'Data Science' },
    { id: 3, value: 'HPC', name: 'HPC' },
    { id: 4, value: 'Middleware', name: 'Middleware' },
    { id: 5, value: 'WebMobile', name: 'Web & Mobile' },
]

const selected = ref(teams[0])

const facility = facilitiesStore.getByYear(settings.value.financialYear)

let totalUtilisation = {},
    billableUtilisation = {},
    nonBillableUtilisation = {}

for (let rse of rses.map(rse => rse.documentId)) {
    const assingnments = assignmentsStore.getByRSE(rse)

    const management = assingnments.filter(assignment => assignment.project.name === 'Management')

    let billableTarget = facility.utilisationRate * 100
    let nonBillableTarget = 100 - billableTarget

    if (management.length > 0) {
        nonBillableTarget = 50
        billableTarget = 50

        if (management[0].fte === 100) {
            billableTarget = 0
            nonBillableTarget = 100
        }
    }

    totalUtilisation[rse] = { target: facility.utilisationRate * 100, actual: 0 }
    billableUtilisation[rse] = { target: billableTarget, actual: 0 }
    nonBillableUtilisation[rse] = { target: nonBillableTarget, actual: 0 }

    if (utilisation.rses[rse]) {
        totalUtilisation[rse].actual = Number((utilisation.rses[rse].total.recorded / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
        billableUtilisation[rse].actual = Number((utilisation.rses[rse].total.billable / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
        nonBillableUtilisation[rse].actual = Number((utilisation.rses[rse].total.nonBillable / utilisation.rses[rse].total.capacity) * 100).toFixed(2)
    }
    else {

    }
}

const filteredRSEs = computed(() =>
    selected.value.value === 'All' ? rses : rses.filter((rse) => {
        return rse.team === selected.value.value
    })
)

function getImageUrl(name) {
    return new URL(`../assets/img/avatars/${name}`, import.meta.url).href
}

function getTeamFromValue(value) {
    return teams.find(team => team.value === value)
}

</script>