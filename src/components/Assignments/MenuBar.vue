<template>
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="mx-auto flex flex-wrap items-center justify-between">
        <div class="max-w-full flex-grow flex-1 w-full relative flex justify-between lg:w-auto pr-4 lg:static lg:block lg:justify-start">
          <div class="flex flex-row">
            <h3 class="font-semibold text-lg leading-9 text-slate-700">
              Project Assignments
            </h3>
            <Listbox as="div" class="px-3 w-48 " v-model="selectedTeam" @update:model-value="changeTeam(selectedTeam)">
              <div class="relative">
                <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
                  <span class="block truncate">{{ selectedTeam.name }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>

                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption as="template" v-for="team in teams" :key="team.id" :value="team" v-slot="{ active, selected }">
                      <li :class="[active ? 'bg-cyan-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ team.name }}</span>

                        <span v-if="selected" :class="[active ? 'text-white' : 'text-cyan-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
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
        <div class="flex lg:flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <Listbox as="div" class="px-3" v-model="selectedYear" @update:model-value="changeFY(selectedYear)">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
                    <span class="block truncate">{{ selectedYear.name }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>

                  <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption as="template" v-for="year in years" :key="year.id" :value="year" v-slot="{ active, selected }">
                        <li :class="[active ? 'bg-cyan-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ year.name }}</span>

                          <span v-if="selected" :class="[active ? 'text-white' : 'text-cyan-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </li>
            <li class="nav-item">
              <button class="px-3 -mr-4 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="unallocated()">
                <i class="fas fa-bars text-lg leading-9 opacity-75 text-slate-700"></i>
                <span class="text-sm bg-red-600 min-w-6 py-0.5 px-1 rounded rounded-full text-white relative -left-2 -top-2">{{unallocatedCount}}</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="create()">
                <i class="fas fa-plus text-lg leading-9 opacity-75 text-slate-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="exportCSV()">
                <i class="fas fa-download text-lg leading-9 opacity-75 text-slate-700"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { currentFY } from '../../utils/dates'

defineProps({
  selected: { type: Boolean },
  edited: { type: Boolean },
  changeTeam: { type: Function },
  changeFY: { type: Function },
  unallocated: { type: Function },
  unallocatedCount: { type: Number },
  create: { type: Function },
  export: { type: Function },
})

const dates = currentFY()

const teams = [
  { id: 1, key: 'All', name: 'All' },
  { id: 2, key: 'DataScience', name: 'Data Science' },
  { id: 3, key: 'HPC', name: 'HPC' },
  { id: 4, key: 'Middleware', name: 'Middleware' },
  { id: 5, key: 'WebMobile', name: 'Web & Mobile' }
]

const years = []

for (let i = 2018; i <= (dates.startDate.year + 1); i++) {
  years.push({ id: i, name: `${i}/${i + 1}` })
}

const selectedYear = ref(years[years.map(y => y.id).indexOf(dates.startDate.year)]),
      selectedTeam = ref(teams[0])

</script>
