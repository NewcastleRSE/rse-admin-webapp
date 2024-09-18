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
      <nav class="isolate flex divide-x divide-gray-200 rounded-t-lg shadow cursor-pointer" aria-label="Tabs">
        <div v-for="(tab, tabIdx) in tabs" :key="tabIdx" v-on:click="setTab(tabIdx)" :class="[currentTabIdx == tabIdx ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', 'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10']">
          <span>{{ tab }}</span>
          <span aria-hidden="true" :class="[currentTabIdx == tabIdx ? 'bg-cyan-600' : 'bg-gray-200', 'absolute inset-x-0 bottom-0 h-0.5']" />
        </div>
      </nav>
      <calendar v-if="currentTabIdx === 0" :rse="rse" />
      <assignment-list v-if="currentTabIdx === 1" :assignments="assignments" />
      <div v-if="currentTabIdx === 2">
        Skills
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import Calendar from '../components/Team/Calendar.vue'
import TimeSummary from '@/components/Dashboard/TimeSummary.vue'
import AssignmentList from '@/components/Team/AssignmentList.vue'
import { useRoute } from 'vue-router'
import { useAssignmentsStore, useProjectsStore, useRSEsStore, useUserStore } from '../stores'
import { fetchObject } from '../utils/orm'

const route = useRoute()

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore(),
      userStore = useUserStore()

const { settings } = storeToRefs(userStore)

const dates = {
  startDate: DateTime.fromISO(`${settings.value.financialYear}-08-01`),
  endDate: DateTime.fromISO(`${(settings.value.financialYear + 1)}-07-31`)
}

let rse = rsesStore.getByName(route.path.split('/')[2])
let assignments = assignmentsStore.getByRSE(rse.id).reverse()

rse.calendar = await fetchObject('rses', `${rse.id}/calendar`, null, { year: { '$eq': dates.startDate.year } })

assignments.forEach((assignment, index) => {
  try {
    if(!!Object.hasOwn(assignment.project, 'name')) {
      assignments[index].project = projectsStore.getByID(assignment.project.id)
    }
  }
  catch(e) {
    console.log(assignment.id)
  }
})


let currentTabIdx = ref(0)

function setTab(index) {
  currentTabIdx.value = index
}

const tabs = ['Timesheets', 'Assignments', 'Skills']

</script>