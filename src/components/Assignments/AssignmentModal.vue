<template>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <DialogTitle as="h3" class="mt-4 px-4 sm:px-6 text-base font-semibold leading-6 text-gray-900">{{ title }}</DialogTitle>
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-600 dark:bg-gray-800 dark:hover:text-gray-300 dark:focus:outline-white cursor-pointer" @click="toggleModal()">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="size-6" aria-hidden="true" />
                  </button>
                </div>
                <form @submit="submit" autocomplete="off">
                  <div class="px-0 py-4">
                    <nav aria-label="Progress">
                      <ol role="list" class="divide-y divide-gray-300 border-y border-gray-300 md:flex md:divide-y-0 dark:divide-white/15 dark:border-white/15">
                        <li v-for="(step, stepIdx) in steps" :key="step.name" class="relative md:flex md:flex-1">
                          <div v-if="step.valid" class="group flex w-full items-center">
                            <span class="flex items-center px-6 py-4 text-sm font-medium">
                              <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 group-hover:bg-cyan-800 dark:bg-cyan-500 dark:group-hover:bg-cyan-400">
                                <CheckIcon class="size-6 text-white" aria-hidden="true" />
                              </span>
                              <span class="ml-4 text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{{ step.name }}</span>
                            </span>
                          </div>
                          <div v-else-if="step.active" class="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                            <span class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-cyan-600 dark:border-cyan-400">
                              <span class="text-cyan-600 dark:text-cyan-400">{{ step.id }}</span>
                            </span>
                            <span class="ml-4 text-sm font-medium text-cyan-600 dark:text-cyan-400 line-clamp-2">{{ step.name }}</span>
                          </div>
                          <div v-else class="group flex items-center">
                            <span class="flex items-center px-6 py-4 text-sm font-medium">
                              <span class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400 dark:border-white/15 dark:group-hover:border-white/25">
                                <span class="text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">{{ step.id }}</span>
                              </span>
                              <span class="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white line-clamp-2">{{ step.name }}</span>
                            </span>
                          </div>
                          <template v-if="stepIdx !== steps.length - 1">
                            <!-- Arrow separator for lg screens and up -->
                            <div class="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                              <svg class="size-full text-gray-300 dark:text-white/15" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" stroke-linejoin="round" />
                              </svg>
                            </div>
                          </template>
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left">
                      <div v-if="steps[0].active" class="text-lg font-medium leading-6 text-gray-900">
                        <Combobox as="div" v-model="selectedRSE" nullable>
                              <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">RSE</ComboboxLabel>
                              <div class="relative mt-2">
                                <ComboboxInput class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus-visible:ring-0 focus:ring-inset focus:ring-cyan-600 focus-visible:ring-cyan-600 sm:text-sm sm:leading-6" required @change="rseQuery = $event.target.value" :display-value="(rse) => `${rse?.displayName}`" />
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>
                                <ComboboxOptions v-if="filteredRSEs.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm">
                                  <ComboboxOption v-for="rse in filteredRSEs" :key="rse.documentId" :value="rse" as="template" v-slot="{ active, selected }">
                                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-cyan-600 text-white' : 'text-gray-900']">
                                      <div class="flex items-center">
                                        <img :src="getImageUrl(rse.photo)" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                        <span :class="['ml-3 truncate', selected && 'font-semibold']">
                                          {{ rse.displayName }}
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
                      <div v-else-if="steps[1].active" class="text-lg font-medium leading-6 text-gray-900">
                        <Combobox as="div" v-model="selectedProject" nullable>
                          <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Project</ComboboxLabel>
                          <div class="relative mt-2">
                            <ComboboxInput class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" required @change="projectQuery = $event.target.value" :display-value="(project) => project?.name" />
                            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </ComboboxButton>
                            <ComboboxOptions v-if="filteredProjects.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm">
                              <ComboboxOption v-for="project in filteredProjects" :key="project.documentId" :value="project" as="template" v-slot="{ active, selected }">
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
                        <div v-if="selectedProject" class="mt-6 mx-3">
                          <div class="px-4 sm:px-0">
                            <h3 class="text-base/7 font-semibold text-gray-900 dark:text-white">{{ selectedProject.contacts[0].displayName }}<span v-if="selectedProject.contacts[0].jobTitle">, {{ selectedProject.contacts[0].jobTitle }}</span></h3>
                            <p class="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">{{ selectedProject.contacts[0].email }}</p>
                          </div>
                          <div class="mt-2">
                            <dl class="grid grid-cols-1 sm:grid-cols-2">
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">Faculty</dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">{{ selectedProject.faculty }}</dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">School</dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">{{ selectedProject.school }}</dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">Funder</dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">{{ selectedProject.funder }}</dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">Cost Model</dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">{{ selectedProject.costModel }}</dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">NUP Number</dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">{{ selectedProject.nuProjects }}</dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 py-2 sm:col-span-1 sm:px-0 dark:border-white/10">
                                <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">Burndown<div class="inline-flex items-baseline rounded-full bg-green-100 ml-2 px-2.5 py-0.5 text-sm font-medium text-green-800 md:mt-2 lg:mt-0 dark:bg-green-400/10 dark:text-green-400">{{ ((burndown.spent / burndown.estimate) * 100).toFixed(2) }}%</div></dt>
                                <dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2 dark:text-gray-400">   
                                  {{ burndown.spent }} of {{ burndown.estimate }} days
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="steps[2].active" class="text-lg font-medium leading-6 text-gray-900">
                        <div class="flex">

                          <div class="basis-4/12 pr-2">
                            <label for="start-date" class="block text-sm font-medium leading-6 text-gray-900">From</label>
                            <div class="mt-2">
                              <input type="date" name="start-date" id="start-date" required v-model="allocation.start" autocomplete="start-date" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                          <div class="basis-4/12 px-2">
                            <label for="end-date" class="block text-sm font-medium leading-6 text-gray-900">To</label>
                            <div class="mt-2">
                              <input type="date" name="end-date" id="end-date" required v-model="allocation.end" autocomplete="end-date" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                          <div class="basis-4/12 pl-2">
                            <label for="fte" class="block text-sm font-medium leading-6 text-gray-900">FTE</label>
                            <div class="mt-2">
                              <input id="fte" name="fte" type="number" min="0" max="100" required v-model="allocation.fte" autocomplete="fte" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                        </div>
                      </div>
                      <div v-else-if="steps[3].active" class="text-lg font-medium leading-6 text-gray-900">
                        <div class="border-t border-gray-100 dark:border-white/10">
                          <dl class="divide-y divide-gray-100 dark:divide-white/10">
                            <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">RSE</dt>
                              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{selectedRSE?.displayName}}</dd>
                            </div>
                            <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Project</dt>
                              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400 truncate">{{ selectedProject?.name }}</dd>
                            </div>
                            <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Dates</dt>
                              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ allocation.start }} to {{ allocation.end }}</dd>
                            </div>
                            <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">FTE</dt>
                              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ allocation.fte }}% ({{ steps[2].name }})</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:px-6 justify-between flex">
                    <div>
                      <button v-if="assignmentId && steps[3].active" type="button" class="inline-flex w-full justify-center self-start rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto cursor-pointer" @click="remove()">Delete</button>
                    </div>
                    <div class="sm:flex sm:flex-row-reverse">
                      <button v-if="steps[3].active" type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 disabled:opacity-25 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto cursor-pointer disabled:cursor-not-allowed">{{ assignmentId ? 'Update' : 'Create' }}</button>
                      <button v-else type="button" :disabled="!steps.find(({ active }) => active === true).valid" class="mt-3 ml-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed" @click="selectStep(steps.findIndex(({ active }) => active === true) + 1)" ref="nextButtonRef">Next</button>
                      <button v-if="steps.findIndex(step => step.active) > 0" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer disabled:cursor-not-allowed" @click="selectStep(steps.findIndex(({ active }) => active === true) - 1)" >Back</button>
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
import { ref, computed, watch } from 'vue'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useAssignmentsStore, useRSEsStore, useProjectsStore } from '../../stores'
import { DateTime, Duration } from 'luxon'
import { workingDaysDiff } from '../../utils/dates'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()
  
const isOpen = ref(false),
      projects = projectsStore.getProjects(),
      rses = rsesStore.getRSEs(),
      projectQuery = ref(''),
      rseQuery = ref('')

const steps = ref([
  { id: '01', name: 'RSE', valid: false, active: true },
  { id: '02', name: 'Project', valid: false, active: false },
  { id: '03', name: 'Allocation', valid: false, active: false },
  { id: '04', name: 'Assignment', valid: false, active: false },
])

function selectStep(index){
  steps.value.forEach(step => step.active = false)
  steps.value[index].active = true
}

const defaultState = {
  assignmentId: null,
  rse: null,
  project: null,
  burndown: { estimate: 0, spent: 0 },
  allocation: { fte: 50, start: null, end: null }
}

let title = '',
    assignmentId = null,
    selectedRSE = ref(null),
    selectedProject = ref(null),
    burndown = ref({ estimate: 0, spent: 0 }),
    allocation = ref({ fte: 50, start: null, end: null })

const filteredProjects = computed(() =>
  projectQuery.value === '' ? projects : projects.filter((project) => {
    return project.name.toLowerCase().includes(projectQuery.value.toLowerCase())
  })
)

const filteredRSEs = computed(() =>
  rseQuery.value === '' ? rses : rses.filter((rse) => {
    return rse.displayName.toLowerCase().includes(rseQuery.value.toLowerCase())
  })
)

watch(selectedRSE, (rse) => {
  if(rse) {
    steps.value[0].name = rse.displayName
    steps.value[0].valid = true
  }
  else {
    steps.value[0].name = 'RSE'
    steps.value[0].valid = false
  }
})

watch(selectedProject, (project) => {
  if(project) {
    steps.value[1].name = project.name
    steps.value[1].valid = true

    const estimateDuration = Duration.fromISO(project.estimate)
    const spentDuration = Duration.fromISO(project.spent)

    burndown.value.estimate = (estimateDuration.toFormat("hh") / 7.26).toFixed(0)
    burndown.value.spent = (spentDuration.toFormat("hh") / 7.26).toFixed(0)
  }
  else {
    steps.value[1].name = 'Project'
    steps.value[1].valid = false
  }
})

watch(allocation, (alloc) => {

  if(alloc.start && alloc.end && (alloc.fte > 0 && alloc.fte <= 100)) {

    const workingDays = workingDaysDiff(DateTime.fromISO(alloc.start), DateTime.fromISO(alloc.end))

    steps.value[2].name = `${workingDays * (alloc.fte / 100)} Days`
    steps.value[2].valid = true
  }
  else {
    steps.value[2].name = 'Allocation'
    steps.value[2].valid = false
  }
}, { deep: true })

function toggleModal() {
  isOpen.value = !isOpen.value
}

function createAssignment(assignment, rse, start, end) {
  if(assignment) {
    title = 'Edit Assignment'
    assignmentId = assignment.documentId,
    selectedProject.value = projects.find(project => project.documentId === assignment.project.documentId)
    selectedRSE.value = assignment.rse
    allocation.value = {
      fte: assignment.fte,
      start: assignment.start,
      end: assignment.end
    }
  }
  else {
    title = 'Create Assignment'
    assignmentId = null
    selectedProject.value = null
    selectedRSE.value = rse
    allocation.value = {
      fte: defaultState.allocation.fte,
      start: DateTime.fromJSDate(start).toISODate(),
      end: DateTime.fromJSDate(end).toISODate()
    }

    if(rse) {
      // Pre-fill first step if RSE is provided
      steps.value[0].name = rse.displayName
      steps.value[0].active = false
      steps.value[0].valid = true

      // Move to project selection
      steps.value[1].active = true
    }
  }
  
  isOpen.value = true
}

async function submit(event) {
  event.preventDefault()

  let assignment = null

  if(assignmentId) {
    assignment = await assignmentsStore.updateAssignment(assignmentId, {
      project: selectedProject.value.documentId,
      rse: selectedRSE.value.documentId,
      fte: allocation.value.fte,
      start: allocation.value.start,
      end: allocation.value.end
    })

    emits('editedAssignment', assignment)
  }
  else {
    assignment = await assignmentsStore.createAssignment({
      project: selectedProject.value.documentId,
      rse: selectedRSE.value.documentId,
      fte: allocation.value.fte,
      start: allocation.value.start,
      end: allocation.value.end
    })

    emits('createdAssignment', assignment)
  }

  selectedProject.value = defaultState.project
  selectedRSE.value = defaultState.rse
  allocation.value = defaultState.allocation

  selectStep(0)

  isOpen.value = false
}

async function remove() {
  await assignmentsStore.deleteAssignment(assignmentId)

  selectedRSE.value = defaultState.rse
  selectedProject.value = defaultState.project
  burndown.value = defaultState.burndown
  allocation.value = defaultState.allocation

  selectStep(0)

  emits('removedAssignment', assignmentId)

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