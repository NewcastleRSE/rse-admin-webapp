<template>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <form @submit="submit">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="mb-6 text-base font-semibold leading-6 text-gray-900">{{ title }}</DialogTitle>
                        <div class="grid grid-cols-6 gap-x-6 gap-y-8">
                          <div class="sm:col-span-6">
                            <Combobox as="div" v-model="project" nullable>
                              <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Project</ComboboxLabel>
                              <div class="relative mt-2">
                                <ComboboxInput class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" required @change="projectQuery = $event.target.value" :display-value="(project) => project?.name" />
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredProjects.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ComboboxOption v-for="project in filteredProjects" :key="project.id" :value="project" as="template" v-slot="{ active, selected }">
                                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-cyan-600 text-white' : 'text-gray-900']">
                                      <div class="flex items-center">
                                        <span :class="['ml-3 truncate', selected && 'font-semibold']">
                                          {{ project.name }}
                                        </span>
                                      </div>

                                      <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-cyan-600']">
                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    </li>
                                  </ComboboxOption>
                                </ComboboxOptions>
                              </div>
                            </Combobox>
                          </div>

                          <div class="sm:col-span-4">
                            <Combobox as="div" v-model="rse" nullable>
                              <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">RSE</ComboboxLabel>
                              <div class="relative mt-2">
                                <ComboboxInput class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" required @change="rseQuery = $event.target.value" :display-value="(rse) => `${rse?.firstname} ${rse?.lastname}`" />
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>

                                <ComboboxOptions v-if="filteredRSEs.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ComboboxOption v-for="rse in filteredRSEs" :key="rse.id" :value="rse" as="template" v-slot="{ active, selected }">
                                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-cyan-600 text-white' : 'text-gray-900']">
                                      <div class="flex items-center">
                                        <img :src="getImageUrl(rse.photo)" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                        <span :class="['ml-3 truncate', selected && 'font-semibold']">
                                          {{ rse.firstname }} {{ rse.lastname }}
                                        </span>
                                      </div>

                                      <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-cyan-600']">
                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    </li>
                                  </ComboboxOption>
                                </ComboboxOptions>
                              </div>
                            </Combobox>
                          </div>

                          <div class="sm:col-span-2">
                            <label for="fte" class="block text-sm font-medium leading-6 text-gray-900">FTE</label>
                            <div class="mt-2">
                              <input id="fte" name="fte" type="number" required v-model="fte" autocomplete="fte" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label for="start-date" class="block text-sm font-medium leading-6 text-gray-900">From</label>
                            <div class="mt-2">
                              <input type="date" name="start-date" id="start-date" required v-model="startDate" autocomplete="start-date" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label for="end-date" class="block text-sm font-medium leading-6 text-gray-900">To</label>
                            <div class="mt-2">
                              <input type="date" name="end-date" id="end-date" required v-model="endDate" autocomplete="end-date" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                        </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:px-6 justify-between flex">
                    <div>
                      <button v-if="assignmentId" type="button" class="inline-flex w-full justify-center self-start rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto" @click="remove()">Delete</button>
                    </div>
                    <div class="sm:flex sm:flex-row-reverse">
                      <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 disabled:opacity-25 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Submit</button>
                      <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="toggleModal()" ref="cancelButtonRef">Cancel</button>
                    </div>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
<script setup>
import { ref, computed } from 'vue'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useAssignmentsStore, useRSEsStore, useProjectsStore } from '../../stores'
import { DateTime } from 'luxon'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()
  
const isOpen = ref(false),
      projects = projectsStore.getProjects(),
      rses = rsesStore.getRSEs(),
      projectQuery = ref(''),
      rseQuery = ref('')

const defaultState = {
  assignmentId: null,
  project: null,
  rse: null,
  fte: 50,
  startDate: null,
  endDate: null
}

let title = '',
    assignmentId = null,
    project = ref(null),
    rse = ref(null),
    fte = 50,
    startDate = null,
    endDate = null

const filteredProjects = computed(() =>
  projectQuery.value === '' ? projects : projects.filter((project) => {
    return project.name.toLowerCase().includes(projectQuery.value.toLowerCase())
  })
)

const filteredRSEs = computed(() =>
  rseQuery.value === '' ? rses : rses.filter((rse) => {
    return rse.firstname.toLowerCase().includes(rseQuery.value.toLowerCase()) || rse.lastname.toLowerCase().includes(rseQuery.value.toLowerCase())
  })
)

function toggleModal() {
  isOpen.value = !isOpen.value
}

function createAssignment(assignmentID, rseID, projectID, dateRange, split) {

  title = 'Create Assignment'

  const start = dateRange ? DateTime.fromJSDate(dateRange[0].$d) : null,
        end = dateRange ? DateTime.fromJSDate(dateRange[1].$d) : null

  if(assignmentID) {
    title = 'Edit Assignment'
    assignmentId = assignmentID
  }

  project.value = projectID ? projectsStore.getByID(projectID) : null
  rse.value = rseID ? rsesStore.getByID(rseID) : null
  startDate = dateRange ? start.toISODate() : null
  endDate = dateRange ? end.toISODate() : null
  fte = split ? split : 50
  
  isOpen.value = true
}

async function submit(event) {
  event.preventDefault()

  let assignment = null

  if(assignmentId) {
    assignment = await assignmentsStore.updateAssignment({
      id: assignmentId,
      project: project.value.id,
      rse: rse.value.id,
      fte: fte,
      start: startDate,
      end: endDate
    })

    emits('editedAssignment', assignment)
  }
  else {
    assignment = await assignmentsStore.createAssignment({
      project: project.value.id,
      rse: rse.value.id,
      fte: fte,
      start: startDate,
      end: endDate
    })

    emits('createdAssignment', assignment)
  }

  project.value = defaultState.project
  rse.value = defaultState.rse
  fte = defaultState.fte
  startDate = defaultState.startDate
  endDate = defaultState.endDate

  isOpen.value = false

}

async function remove() {
  await assignmentsStore.deleteAssignment(assignmentId)

  project.value = defaultState.project
  rse.value = defaultState.rse
  fte = defaultState.fte
  startDate = defaultState.startDate
  endDate = defaultState.endDate

  isOpen.value = false
}

function getImageUrl(name) {
  return new URL(`../../assets/img/avatars/${name}`, import.meta.url).href
}

defineExpose({
  createAssignment
})

const emits = defineEmits(['createdAssignment', 'editedAssignment', 'removedAssignment'])

</script>
<style scoped>
.simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 25px;
  overflow-y: auto;
  z-index: 100;
  top: -10px;
  background-color: rgb(255, 255, 255);
  border-left: 1px solid rgb(203, 213, 225);
  border-right: 1px solid rgb(203, 213, 225);
  border-bottom: 1px solid rgb(203, 213, 225);
  border-radius: 0 0 0.25rem 0.25rem;
}

.simple-typeahead-list-item {
    cursor: pointer;
}

.simple-typeahead-list-item-active {
    background-color: rgb(8, 145, 178);
    color: rgb(255, 255, 255);
}
</style>