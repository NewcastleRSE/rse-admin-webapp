<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-10" @close="isOpen = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="rounded-lg relative transform overflow-hidden text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl overflow-y-scroll" style="max-height: 80vh;">
              <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5">
                <li v-for="project in projects" :key="project.documentId" @click="createAssignment(project.documentIds)" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer">
                  <div class="flex gap-x-4">
                    <div class="min-w-0 flex-auto">
                      <p class="text-sm font-semibold leading-6 text-gray-900">
                        {{ project.name }}
                        <span v-if="project.condition === 'red'" class="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Critical</span>
                        <span v-else-if="project.condition === 'amber'" class="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Warning</span>
                      </p>
                      <p v-if="project.contacts" class="mt-1 flex text-xs leading-5 text-gray-500">
                        {{ project.contacts[0].firstname }} {{ project.contacts[0].lastname }} - {{ project.school }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-x-4">
                    <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                  </div>
                </li>
              </ul>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '../../stores'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

const isOpen = ref(false)
const emit = defineEmits(['createAssignment'])

const projectsStore = useProjectsStore()
const projects = projectsStore.getProjects().filter(project => project.stage === 'Awaiting Allocation')

function toggleModal() {
  isOpen.value = !isOpen.value
}

function createAssignment(projectId) {
  emit('createAssignment', null, projectId)
  toggleModal()
}

defineExpose({ toggleModal })

</script>