<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-b-lg">
    <div class="mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            All
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Assignments
          </h2>
        </div>
      </div>
    </div>
    <div class="w-full">
      <ul role="list" class="divide-y divide-gray-100 px-4">
        <li v-for="assignment in assignments" :key="assignment.id" class="relative flex justify-between py-5">
          <div class="flex-1 gap-x-4 pr-6">
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                {{ assignment.project.name }}
              </p>
              <p class="mt-1 flex text-sm leading-5 text-gray-500">
                {{ assignment.project.funder }}
              </p>
            </div>
          </div>
          <div class="flex-1 items-center gap-x-4">
            <div>
              <p class="leading-6 text-gray-900" v-if="assignment.project.contacts && assignment.project.contacts.length > 0">
                {{ assignment.project.contacts[0].firstname }}&nbsp;
                {{ assignment.project.contacts[0].lastname }}
              </p>
              <p class="mt-1 text-sm leading-5 text-gray-600">{{ assignment.project.school }}</p>
            </div>
          </div>
          <div class="flex-1">
            <p class="leading-6 text-gray-900">{{ formatDate(assignment.start) }}</p>
            <p class="text-xs leading-6 text-gray-600 uppercase">Starting</p>
          </div>
          <div class="flex-1">
            <p class="leading-6 text-gray-900">{{ formatDate(assignment.end) }}</p>
            <p class="text-xs leading-6 text-gray-600 uppercase">Ending</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  assignments: null
})

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

</script>
