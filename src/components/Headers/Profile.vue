<template>
  <div class="flex items-stretch flex-wrap">
    <div class="w-full lg:w-full xl:w-1/2 px-4">
      <profile-card
        :image=getImageUrl(rse.photo)
        :name="rse.displayName"
        :team="rse.team"
        :availableDate=formatDate(rse.nextAvailableDate)
        :availablePercentage="rse.nextAvailableFTE"
        :email="rse.email"
        :timesheetURL="timesheetURL"
        :githubURL="`https://github.com/${rse.github}`"
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Assignment :assignment="assignments[0]" />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
      <Assignment :assignment="assignments[1]" />
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useRoute } from 'vue-router'
import { currentFY } from '../../utils/dates'
import Assignment from '@/components/Cards/Assignment.vue' 
import ProfileCard from '@/components/Cards/Profile.vue'
import { useAssignmentsStore, useRSEsStore } from '@/stores'

const route = useRoute()
const dates = currentFY()

const assignmentsStore = useAssignmentsStore(),
      rseStore = useRSEsStore()

const rse = rseStore.getByName(route.path.split('/')[2]),
      assignments = assignmentsStore.getByPeriod(DateTime.now().toISODate(), dates.startDate.toISODate(), rse.id)

assignments.forEach((assignment, index) => {
  if(assignment.project.name && (assignment.project.name === 'Management' || assignment.project.name === 'Carpentries Training')) {
    assignments[index].project.dealname = assignment.project.name
    assignments[index].project.contacts = [{ firstname: 'Mark', lastname: 'Turner' }]
  }
})

const timesheetURL = `https://app.clockify.me/reports/summary?start=${dates.startDate.toISO()}&end=${dates.currentDate.toISO()}&filterValuesData=%7B%22users%22:%5B%22${rse.clockifyID}%22%5D%7D`

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function getImageUrl(name) {
  return new URL(`../../assets/img/avatars/${name}`, import.meta.url).href
}

</script>
