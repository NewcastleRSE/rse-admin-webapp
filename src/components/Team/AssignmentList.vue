<template>
    <div class="w-full">
      <ul role="list" class="divide-y divide-gray-100 px-4">
        <li v-for="assignment in assignments" :key="assignment.documentId" class="relative flex justify-between py-5">
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
</template>
<script setup>

const props = defineProps({
  assignments: null
})

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

</script>
