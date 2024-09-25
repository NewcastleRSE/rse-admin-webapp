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
              <div :class="[item.changeType === 'green' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0']">
                <component :is="item.changeIcon" class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center" :class="item.changeType === 'green' ? 'text-green-500' : 'text-red-500' " aria-hidden="true" />
                <span class="sr-only"> {{ item.changeType === 'green' ? 'Increased' : 'Decreased' }} by </span>
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
    <div class="w-full mb-12 xl:mb-0 mx-4 break-words bg-white px-4 py-5 shadow-lg rounded-lg">
      <div v-if="currentTabIdx === 0">
        <utilisation :months="utilisation.months" />
      </div>
        <calendar v-if="currentTabIdx === 1" :rse="rse" />
      <div v-if="currentTabIdx === 2">
        <LeaveList :leave="leaveDates" />
      </div>
      <div v-if="currentTabIdx === 3">
        <volunteering :months="volunteeringData" />
      </div>
      <assignment-list v-if="currentTabIdx === 4" :assignments="assignments" />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { DateTime } from 'luxon'
import Calendar from '../components/Team/Calendar.vue'
import AssignmentList from '@/components/Team/AssignmentList.vue'
import Volunteering from '../components/Team/Volunteering.vue'
import LeaveList from '../components/Team/LeaveList.vue'
import Utilisation from '../components/Team/Utilisation.vue'
import { useAssignmentsStore, useProjectsStore, useRSEsStore, useUserStore, useFacilitiesStore } from '../stores'
import { fetchObject } from '../utils/orm'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

const route = useRoute()
const rseName = route.path.split('/')[2]

// Tab state
let currentTabIdx = ref(0)

function setTab(index) {
  currentTabIdx.value = index
}

let tabs = ref([]),
    utilisation = ref({}),
    leaveDates = ref([]),
    volunteeringData = ref([]),
    assignments = ref([])

// Stores
const assignmentsStore = useAssignmentsStore(),
      projectsStore = useProjectsStore(),
      rsesStore = useRSEsStore(),
      userStore = useUserStore(),
      facilitiesStore = useFacilitiesStore()

// Global Settings
const { settings } = storeToRefs(userStore)

async function renderStatsBar() {
  // Selected FY dates
  const dates = {
    startDate: DateTime.fromISO(`${settings.value.financialYear}-08-01`),
    endDate: DateTime.fromISO(`${(settings.value.financialYear + 1)}-07-31`)
  }

  const targetDate = DateTime.now() > dates.endDate ? dates.endDate : DateTime.now()

  // RSE Data
  
  let rse = rsesStore.getByName(rseName)
  let facility = facilitiesStore.getByYear(dates.startDate.year)

  assignments.value = assignmentsStore.getByRSE(rse.id).reverse()
  utilisation.value = rsesStore.getUtilisation(rse.id)

  // RSE Calendar
  rse.calendar = await fetchObject('rses', `${rse.id}/calendar`, null, { year: { '$eq': dates.startDate.year } })

  // Utilisation
  let utilisationRate = utilisation.value.total.recorded / utilisation.value.total.capacity * 100,
      utilisationRateDiff = utilisationRate - (facility.utilisationRate * 100),
      utilisationCap = 100 - (facility.utilisationRate * 100)

  // Calendar
  let workingDaysToDate = rse.calendar.data.filter(date => DateTime.fromISO(date.date) <= targetDate && date.metadata.isWorkingDay)
  let missingDays = workingDaysToDate.filter(date => date.leave === null && date.timesheet.length === 0)

  // Leave
  leaveDates.value = rse.calendar.data.filter(date => date.leave !== null).reverse()

  const averageCapacity = rse.calendar.data.reduce((acc, entry) => acc + entry.utilisation.capacity, 0) / rse.calendar.data.length

  const today = rse.calendar.data.find(entry => entry.date === targetDate.toISODate()),
        yearCompleted = Math.abs(dates.startDate.diff(targetDate, 'days').days) / 365,
        leaveTarget = ((30 * (averageCapacity/100)) * yearCompleted).toFixed(0),
        leaveDiff = (leaveTarget - leaveDates.value.filter(date => date.leave.type === 'AL').length) * -1

  // Volunteering
  let volunteeringDates = rse.calendar.data.filter(date => date.timesheet.some(entery => entery.project === 'Volunteering'))
      
  let months = {}

  let date = dates.startDate

  while (date <= targetDate) {
    if (!months[date.toFormat('MMMM')]) {
      months[date.toFormat('MMMM')] = 0
    }

    date = date.plus({ months: 1 })
  }

  volunteeringDates.forEach(entry => {
    let date = DateTime.fromISO(entry.date),
        timesheets = entry.timesheet.filter(entry => entry.project === 'Volunteering')
    
    let duration = timesheets.reduce((acc, entry) => acc + entry.duration, 0)

    months[date.toFormat('MMMM')] = months[date.toFormat('MMMM')] + duration
  })

  const monthlyCap = 7.26 * 60 * 60

  volunteeringData.value = Object.keys(months).map((month) => {
    return {
      month: month,
      duration: months[month],
      utilisation: (months[month] / monthlyCap) * 100
    }
  }).reverse()

  // Assignments

  let assignmentCount = 0,
      assignmentFTE = 0

  console.log(assignments.value)

  assignments.value.forEach((assignment, index) => {
    try {
      if(!!Object.hasOwn(assignment.project, 'name')) {
        assignments.value[index].project = projectsStore.getByID(assignment.project.id)
      }
      if(DateTime.fromISO(assignment.start) <= targetDate && DateTime.fromISO(assignment.end) >= targetDate) {
        assignmentCount++
        assignmentFTE += assignment.fte
      }
    }
    catch(e) {
      console.log(assignment)
      console.log(assignments[index])
      console.log(e)
      console.log(assignment.id)
    }
  })

  // Tab construction
  tabs.value = [
    { 
      name: 'Utilisation',
      stat: `${utilisationRate.toFixed(2)}%`,
      change: utilisationRateDiff < utilisationCap ? `${utilisationRateDiff.toFixed(2)}%` : `${(utilisationRateDiff - utilisationCap).toFixed(2)}%`,
      changeType: utilisationRateDiff < 0 || utilisationRateDiff > utilisationCap ? 'red' : 'green',
      changeIcon: utilisationRateDiff < 0 ? ArrowDownIcon : ArrowUpIcon
    },
    { 
      name: 'Timesheets',
      stat: `${(workingDaysToDate.length - missingDays.length)} of ${(workingDaysToDate.length - leaveDates.value.filter(date => date.leave.type === 'AL').length)}`,
      change: `${((workingDaysToDate.length - missingDays.length) / workingDaysToDate.length).toFixed(2) * 100}%`,
      changeType: (workingDaysToDate.length - missingDays.length) / workingDaysToDate.length >= 0.80 ? 'green' : 'red',
      changeIcon: (workingDaysToDate.length - missingDays.length) / workingDaysToDate.length >= 0.80 ? CheckIcon : ExclamationTriangleIcon
    },
    { 
      name: 'Leave',
      stat: `${leaveDates.value.filter(date => date.leave.type === 'AL').length} of ${(30 * (averageCapacity/100)).toFixed(1)}`,
      change: leaveDiff > 0 ? `+${leaveDiff}` : `${leaveDiff}`,
      changeType: leaveDates.value.filter(date => date.leave.type === 'AL').length >= leaveTarget ? 'green' : 'red',
      changeIcon: leaveDates.value.filter(date => date.leave.type === 'AL').length >= leaveTarget ? ArrowUpIcon : ArrowDownIcon
    },
    {
      name: 'Volunteering',
      stat: `${volunteeringData.value.filter(month => month.duration > 0).length} of ${Math.ceil(Math.abs(dates.startDate.diff(targetDate, 'months').months))}`,
      change: volunteeringData.value[0] ? `${volunteeringData.value[0].utilisation.toFixed(0)}%` : '0%',
      changeType: volunteeringData.value[0] ? 75 <= volunteeringData.value[0].utilisation && volunteeringData.value[0].utilisation <= 100 ? 'green' : 'red' : 'red',
      changeIcon: volunteeringData.value[0] ? 75 <= volunteeringData.value[0].utilisation && volunteeringData.value[0].utilisation <= 100 ? CheckIcon : ExclamationTriangleIcon : ExclamationTriangleIcon
    }, 
    {
      name: 'Assignments',
      stat: assignmentCount,
      change: `${assignmentFTE}%`,
      changeType: assignmentFTE < today.utilisation.capacity ? 'red' : 'green',
      changeIcon: assignmentFTE < today.utilisation.capacity ? XMarkIcon : CheckIcon
    }  
  ]
}

watch(settings, async () => {
  renderStatsBar()
},
{ deep: true })

renderStatsBar()

</script>