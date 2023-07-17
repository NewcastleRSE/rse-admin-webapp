import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useAssignmentsStore, useProjectsStore } from '@/stores'
import { fetchObjects } from '../utils/orm'

export const useCapacitiesStore = defineStore('capacities', () => {
    const capacities = ref([])

    function getCapacities() {
        return capacities.value
    }

    function getByID(id) {
        return capacities.value.find(capacity => capacity.id == id)
    }

    function getCapacityInPeriod(start, end, rse) {
        return capacities.value.filter(capacity =>
          (
            capacity.rse.data.id === rse &&
            DateTime.fromISO(capacity.start) <= DateTime.fromISO(start) && 
            (
              DateTime.fromISO(capacity.end) >= DateTime.fromISO(start) || !capacity.end
            )
          ) ||
          (
            capacity.rse.data.id === rse &&
            DateTime.fromISO(capacity.start) <= DateTime.fromISO(end) &&
            (
              DateTime.fromISO(capacity.end) >= DateTime.fromISO(end) || !capacity.end
            )
          )
        )
    }

    function getUtilisation(startDate, endDate) {
        
        const assignmentsStore = useAssignmentsStore(),
              projectsStore = useProjectsStore()
        
        let utilisation = []

        while(startDate < endDate) {
          
          let capacitiesInPeriod = capacities.value.filter(capacity => {
            let capacityStart = DateTime.fromISO(capacity.start),
                capacityEnd = capacity.end ? DateTime.fromISO(capacity.end) : endDate

            return startDate >= capacityStart.startOf('month') && startDate <= capacityEnd.startOf('month')
          })

          let assignments = assignmentsStore.getAssignments().filter(assignment => {
            let assignmentStart = DateTime.fromISO(assignment.start),
                assignmentEnd = assignment.end ? DateTime.fromISO(assignment.end) : endDate

            return startDate >= assignmentStart && startDate <= assignmentEnd
          })

          // Expand assignments to include full HubSpot project details
          assignments.forEach(assignment => {
            assignment.project = projectsStore.getByID(assignment.project)
          })

          let monthlyUtilisation = {
            date: startDate.toISODate(),
            capacityFTE: Math.round(capacitiesInPeriod.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0)),
            targetFTE: Math.round(capacitiesInPeriod.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0) * 0.7),
            actualFTE: Math.round(assignments.reduce(function (totalFTE, assignment) { return totalFTE + assignment.fte }, 0)),
            facilityFTE: Math.round(assignments.reduce(async function (facilityFTE, assignment) { return await projectsStore.getByHubspotID(assignment.project.data.hubspotID).costModel === 'Facility' ? (facilityFTE + assignment.fte) : facilityFTE + 0}, 0)),
            nonFacilityFTE: Math.round(assignments.reduce(async function (nonFacilityFTE, assignment) { return await projectsStore.getByHubspotID(assignment.project.data.hubspotID).costModel !== 'Facility' ? (nonFacilityFTE + assignment.fte) : nonFacilityFTE + 0 }, 0)),
            capacityDays: Math.round(capacitiesInPeriod.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0)),
            targetDays: Math.round(capacitiesInPeriod.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0) * 0.7),
            actualDays: Math.round(assignments.reduce(function (totalDays, assignment) { return totalDays + ((220/12) * (assignment.fte/100)) }, 0)),
            facilityDays: Math.round(assignments.reduce(async function (facilityDays, assignment) { return await projectsStore.getByHubspotID(assignment.project.data.hubspotID).costModel === 'Facility' ? (facilityDays + ((220/12) * (assignment.fte/100))) : facilityDays + 0}, 0)),
            nonFacilityDays: Math.round(assignments.reduce(async function (nonFacilityDays, assignment) { return await projectsStore.getByHubspotID(assignment.project.data.hubspotID).costModel !== 'Facility' ? (nonFacilityDays + ((220/12) * (assignment.fte/100))) : nonFacilityDays + 0 }, 0))
          }

          utilisation.push(monthlyUtilisation)

          startDate = startDate.plus({months: 1})
        }
        return utilisation
      }

    async function fetchCapacities () {
        capacities.value = await fetchObjects('capacities', 0, 100, ['rse'])
    }

    async function reset () {
      capacities.value = []
    }

    return { capacities, getCapacities, getByID, getCapacityInPeriod, getUtilisation, fetchCapacities, reset }
},
{
    persist: true
})