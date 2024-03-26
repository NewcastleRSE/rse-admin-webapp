<template>
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="max-w-full flex-grow flex-1 w-full relative flex justify-between lg:w-auto pr-4 lg:static lg:block lg:justify-start">
          <h3 class="font-semibold text-lg text-blueGray-700">
            Project Assignments
          </h3>
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span class="block relative w-6 h-px rounded-sm bg-white"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div class="flex lg:flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <Listbox as="div" class="px-3" v-model="selected" @update:model-value="changeFY(selected)">
                <div class="relative">
                  <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
                    <span class="block truncate">{{ selected.name }}</span>
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
                <i class="fas fa-bars text-lg leading-lg opacity-75 text-blueGray-700"></i>
                <span class="text-sm bg-red-600 min-w-6 py-0.5 px-1 rounded rounded-full text-white relative -left-2 -top-2">{{unallocatedCount}}</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="create()">
                <i class="fas fa-plus text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" v-on:click="exportCSV()">
                <i class="fas fa-download text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

defineProps({
  selected: { type: Boolean },
  edited: { type: Boolean },
  changeFY: { type: Function },
  unallocated: { type: Function },
  unallocatedCount: { type: Number },
  create: { type: Function },
  export: { type: Function },
})

const years = [
  { id: 1, name: '2018/19' },
  { id: 2, name: '2019/20' },
  { id: 3, name: '2020/21' },
  { id: 4, name: '2021/22' },
  { id: 5, name: '2022/23' },
  { id: 6, name: '2023/24' },
  { id: 7, name: '2024/25' }
]

const selected = ref(years[years.length - 2])

</script>
