<template>
  <div :class="`bg-white`" class="h-full relative flex flex-col min-w-0 break-words rounded xl:mb-0 shadow-lg">
    <div class="h-full flex p-4">
      <div class="flex-1" v-if="assignment">
          <h3 class="font-semibold text-ellipsis line-clamp-1">
            {{ assignment.project.dealname }}
          </h3>
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ assignment.project.contacts[0].firstname }} {{ assignment.project.contacts[0].lastname }}
          </h5>
          <div class="flex flex-row mt-4">
            <div class="grow">
              <h3 class="text-blueGray-900 uppercase font-bold">
                {{ assignment.start }}
              </h3>
              <h6 class="text-blueGray-400 mr-2 uppercase font-bold text-xs">
                Start
              </h6>
            </div>
            <div class="grow">
              <h3 class="text-blueGray-900 uppercase font-bold">
                {{ assignment.end }}
              </h3>
              <h6 class="text-blueGray-400 mr-2 uppercase font-bold text-xs">
                End
              </h6>
            </div>
          </div>
      </div>
      <a href="/assignments" v-else class="block flex flex-initial w-full text-center font-semibold border-dashed border-4 justify-items-center items-center text-gray-400">
        <h3 class="w-full">Create Assignment</h3>
      </a>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  assignment: null
})

</script>
