<template>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-10" @close="toggleModal()">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{ title }}</DialogTitle>
                    <form class="mt-2">
                      <div class="mt-10 grid grid-cols-6 gap-x-6 gap-y-8">
                        <div class="sm:col-span-6">
                          <label for="project" class="block text-sm font-medium leading-6 text-gray-900">Project</label>
                          <div class="mt-2">
                            <simple-typeahead class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" placeholder="Project" v-model="project" :defaultItem=project :items=projects :minInputLength="3" :itemProjection="projectProjection" @selectItem="selectProject">
                              <template #list-item-text="slot">
                                <div class="align-middle whitespace-nowrap">
                                  <div class="flex items-center py-2 px-4">
                                    <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
                                  </div>
                                </div>
                              </template>
                            </simple-typeahead>
                          </div>
                        </div>

                        <div class="sm:col-span-4">
                          <label for="rse" class="block text-sm font-medium leading-6 text-gray-900">RSE</label>
                          <div class="mt-2 relative">
                            <simple-typeahead class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" placeholder="RSE" v-model="rse" :defaultItem=rse :items=rses :minInputLength="1" :itemProjection="rseProjection" @selectItem="selectRse">
                              <template #list-item-text="slot">
                                <div class="align-middle whitespace-nowrap w-full">
                                  <div class="flex items-center py-2 px-4">
                                    <img :src="`/src/assets/img/avatars/${slot.item.photo}`" class="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow mr-2" />
                                    <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
                                  </div>
                                </div>
                              </template>
                            </simple-typeahead>
                          </div>
                        </div>

                        <div class="sm:col-span-2">
                          <label for="fte" class="block text-sm font-medium leading-6 text-gray-900">FTE</label>
                          <div class="mt-2">
                            <input id="fte" name="fte" type="number" :value="fte" autocomplete="fte" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                          </div>
                        </div>

                        <div class="sm:col-span-3">
                          <label for="start-date" class="block text-sm font-medium leading-6 text-gray-900">From</label>
                          <div class="mt-2">
                            <input type="date" name="start-date" id="start-date" :value="startDate" autocomplete="start-date" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                          </div>
                        </div>

                        <div class="sm:col-span-3">
                          <label for="end-date" class="block text-sm font-medium leading-6 text-gray-900">To</label>
                          <div class="mt-2">
                            <input type="date" name="end-date" id="end-date" :value="endDate" autocomplete="end-date" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
                          </div>
                        </div>

                        
                      </div>
                    </form>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="save()">Save</button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="toggleModal()" ref="cancelButtonRef">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
<script setup>
import { ref, defineExpose } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import SimpleTypeahead from 'vue3-simple-typeahead'
import { useAssignmentsStore, useRSEsStore, useProjectsStore } from '../../stores'
import { DateTime } from 'luxon'

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore()
  
const isOpen = ref(false),
      title = 'Create Assignment',
      rses = rsesStore.getRSEs(),
      projects = projectsStore.getProjects()

let project = null,
    rse = null,
    fte = 50,
    startDate = null,
    endDate = null

function rseProjection(item) {
  return item.firstname + ' ' + item.lastname
}

function selectRse(selected) {
  rse = selected
}

function projectProjection(item) {
  return item.dealname
}

function selectProject(selected) {
  project = selected
}

function toggleModal() {
  isOpen.value = !isOpen.value
}

function createAssignment(rseID, projectID, dateRange, split) {

const start = DateTime.fromJSDate(dateRange[0].$d),
      end = DateTime.fromJSDate(dateRange[1].$d)

  project = projectID ? projectsStore.getByID(projectID) : null
  rse = rseID ? rsesStore.getByID(rseID) : null
  startDate = dateRange ? start.toISODate() : null
  endDate = dateRange ? end.toISODate() : null
  fte = split ? fte : 50
  isOpen.value = true
}

async function save() {
  await assignmentsStore.createAssignment({
    project: `${project.id}`,
    rse: `${rse.id}`,
    fte: fte,
    start: startDate,
    end: endDate
  })

  project = null,
  rse = null,
  fte = 50,
  startDate = null,
  endDate = null

  isOpen.value = false
}

defineExpose({
  createAssignment
})

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