<template>
  <div class="flex flex-wrap">
    <div class="w-full mb-12 xl:mb-0 px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="rounded-t mb-0 px-4 py-3 border-0">
          <div class="flex flex-wrap items-center">
            <div class="relative w-full max-w-full flex-grow flex-1">
              <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold"> Timesheets </h6>
              <h2 class="text-blueGray-700 text-xl font-semibold"> Summary </h2>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex flex-col flex-grow place-content-center">
          <TimeSummary :rse="rse" />
        </div>
        <div class="flex px-4 py-3">
          <ul class="py-2">
            <li class="float-left">
              <i class="fa-solid fa-square text-cyan-600"></i>
              <span class="pl-2 pr-6">Billable</span>
            </li>
            <li class="float-left">
              <i class="fa-solid fa-square text-yellow-400"></i>
              <span class="pl-2 pr-6">Non-Billable</span>
            </li>
            <li class="float-left">
              <i class="fa-solid fa-square text-emerald-400"></i>
              <span class="pl-2 pr-6">Leave</span>
            </li>
            <li class="float-left">
              <i class="fa-solid fa-square text-red-400"></i>
              <span class="pl-2 pr-6">Missing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 xl:mb-0 px-4">
      <assignment-list :assignments="rse.assignments" />
    </div>
  </div>
</template>
<script setup>
import TimeSummary from '@/components/Dashboard/TimeSummary.vue'
import AssignmentList from '@/components/Team/AssignmentList.vue'
import { useRoute } from 'vue-router'
import { useRSEsStore } from '../stores'

const route = useRoute()
const rsesStore = useRSEsStore()

const rse = rsesStore.getByName(route.path.split('/')[2])

rse.assignments = rse.assignments.reverse()
</script>