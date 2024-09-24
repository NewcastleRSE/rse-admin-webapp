<template>
  <div class="flex flex-wrap">
    <div class="w-full mb-12 xl:mb-0 px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <dl class="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white cursor-pointer shadow md:grid-cols-5 md:divide-x md:divide-y-0">
          <div v-for="(item, index) in tabs" :key="index" v-on:click="setTab(index)" class="px-4 py-5 sm:p-6">
            <dt class="text-base font-normal text-gray-900">{{ item.name }}</dt>
            <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div class="flex items-baseline text-2xl font-semibold text-cyan-600">
                {{ item.stat }}
              </div>
              <div :class="[item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0']">

                <component :is="item.changeIcon" class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center" :class="item.changeType === 'increase' ? 'text-green-500' : 'text-red-500' " aria-hidden="true" />
                <!-- <ArrowUpIcon v-if="item.changeType === 'increase'" class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                <ArrowDownIcon v-else class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" /> -->

                <span class="sr-only"> {{ item.changeType === 'increase' ? 'Increased' : 'Decreased' }} by </span>
                {{ item.change }}
              </div>
            </dd>
            <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5" :class="[currentTabIdx == index ? 'bg-cyan-600' : 'bg-white']" />
          </div>
        </dl>
      </div>
    </div>
  </div>
  <div class="flex flex-wrap">
    <div class="w-full mb-12 xl:mb-0 mx-4 break-words bg-white w-full mb-6 px-4 py-5 shadow-lg rounded-lg">
      <div v-if="currentTabIdx === 0">
        Skills
      </div>
      <calendar v-if="currentTabIdx === 1" :rse="rse" />
      <div v-if="currentTabIdx === 2">
        Leave
      </div>
      <div v-if="currentTabIdx === 3">
        <volunteering :months="volunteeringData" />
      </div>
      <assignment-list v-if="currentTabIdx === 4" :assignments="assignments" />
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
import Volunteering from '../components/Team/Volunteering.vue'
import { useRoute } from 'vue-router'
import { useAssignmentsStore, useProjectsStore, useRSEsStore, useUserStore, useFacilitiesStore } from '../stores'
import { fetchObject } from '../utils/orm'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

let currentTabIdx = ref(0)

function setTab(index) {
  currentTabIdx.value = index
}

const route = useRoute()

const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore(),
      userStore = useUserStore(),
      facilitiesStore = useFacilitiesStore()

const { settings } = storeToRefs(userStore)

const dates = {
  startDate: DateTime.fromISO(`${settings.value.financialYear}-08-01`),
  endDate: DateTime.fromISO(`${(settings.value.financialYear + 1)}-07-31`)
}

let rse = rsesStore.getByName(route.path.split('/')[2])
let assignments = assignmentsStore.getByRSE(rse.id).reverse()
let utilisation = rsesStore.getUtilisation(rse.id)
let facility = facilitiesStore.getByYear(dates.startDate.year)

rse.calendar = await fetchObject('rses', `${rse.id}/calendar`, null, { year: { '$eq': dates.startDate.year } })

let assignmentCount = 0,
    assignmentFTE = 0

assignments.forEach((assignment, index) => {
  try {
    if(!!Object.hasOwn(assignment.project, 'name')) {
      assignments[index].project = projectsStore.getByID(assignment.project.id)
    }
    if(DateTime.fromISO(assignment.start) <= DateTime.now() && DateTime.fromISO(assignment.end) >= DateTime.now()) {
      assignmentCount++
      assignmentFTE += assignment.fte
    }
  }
  catch(e) {
    console.log(assignment.id)
  }
})

let utilisationRate = utilisation.total.recorded / utilisation.total.capacity * 100,
    utilisationRateDiff = utilisationRate - (facility.utilisationRate * 100),
    utilisationCap = 100 - (facility.utilisationRate * 100)

let volunteeringDates = rse.calendar.data.filter(date => date.timesheet.some(entery => entery.project === 'Volunteering'))

let months = {}

volunteeringDates.forEach(entry => {
  let date = DateTime.fromISO(entry.date),
      timesheets = entry.timesheet.filter(entry => entry.project === 'Volunteering')
  
  let duration = timesheets.reduce((acc, entry) => acc + entry.duration, 0)

  if (!months[date.toFormat('MMMM')]) {
    months[date.toFormat('MMMM')] = 0
  }

  months[date.toFormat('MMMM')] = months[date.toFormat('MMMM')] + duration
})

const monthlyCap = 7.26 * 60 * 60

// Convert duration in seconds to percentage of monthly cap
Object.keys(months).forEach((month) => {
  let duration = months[month]
  months[month] = (duration / monthlyCap) * 100
})

const volunteeringData = Object.keys(months).map((month) => {
  return {
    month: month,
    duration: months[month]
  }
}).reverse()

const tabs = [
  { 
    name: 'Utilisation',
    stat: `${utilisationRate.toFixed(2)}%`,
    change: utilisationRateDiff < utilisationCap ? `${utilisationRateDiff.toFixed(2)}%` : `${(utilisationRateDiff - utilisationCap).toFixed(2)}%`,
    changeType: utilisationRateDiff < 0 || utilisationRateDiff > utilisationCap ? 'decrease' : 'increase',
    changeIcon: utilisationRateDiff < 0 ? ArrowDownIcon : ArrowUpIcon
  },
  { 
    name: 'Calendar',
    stat: '58.16%',
    change: '2.02%',
    changeType: 'increase',
    changeIcon: CheckIcon
  },
  { 
    name: 'Leave',
    stat: '24.57%',
    change: '4.05%',
    changeType: 'decrease',
    changeIcon: CheckIcon
  },
  {
    name: 'Volunteering',
    stat: assignmentCount,
    change: `${assignmentFTE}%`,
    changeType: assignmentFTE < 100 ? 'decrease' : 'increase',
    changeIcon: CheckIcon
  }, 
  {
    name: 'Assignments',
    stat: assignmentCount,
    change: `${assignmentFTE}%`,
    changeType: assignmentFTE < 100 ? 'decrease' : 'increase',
    changeIcon: assignmentFTE < 100 ? XMarkIcon : CheckIcon
  }  
]

</script>