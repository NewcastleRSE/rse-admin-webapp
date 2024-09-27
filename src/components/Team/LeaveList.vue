<template>
    <div class="flow-root">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Duration</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="entry in leave" :key="entry.date">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ formatDate(entry.date) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ entry.leave.duration === 7.26 ? 'Full Day' : 'Half Day' }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ entry.leave.type }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ entry.leave.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
<script setup>

const props = defineProps({
  leave: null
})

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

</script>
