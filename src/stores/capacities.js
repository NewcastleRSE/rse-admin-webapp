import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { useAssignmentsStore, useProjectsStore } from '@/stores'

export const useCapacitiesStore = defineStore('capacities', () => {
    const capacities = ref([])

    function getCapacities() {
        return capacities.value
    }

    function setCapacities(data) {
      capacities.value = data
    }

    function getByID(id) {
        return capacities.value.find(capacity => capacity.id == id)
    }

    function getCapacityInPeriod(start, end, rse) {
        return capacities.value.filter(capacity =>
          (
            capacity.rse === rse &&
            DateTime.fromISO(capacity.start) <= DateTime.fromISO(start) && 
            (
              DateTime.fromISO(capacity.end) >= DateTime.fromISO(start) || !capacity.end
            )
          ) ||
          (
            capacity.rse === rse &&
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
        assignments.forEach((assignment, index) => {
          if(assignment.project.name !== 'Management' && assignment.project.name !== 'Carpentries Training') {
            assignments[index].project = projectsStore.getByID(assignment.project.id)
          }    
        })

        let monthlyUtilisation = {
          date: startDate.toISODate(),
          capacityFTE: Math.round(capacitiesInPeriod.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0)),
          targetFTE: Math.round(capacitiesInPeriod.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0) * 0.8),
          actualFTE: Math.round(assignments.reduce(function (totalFTE, assignment) { return totalFTE + assignment.fte }, 0)),
          facilityFTE: Math.round(assignments.reduce(function (facilityFTE, assignment) { return assignment.project.costModel === 'Facility' ? (facilityFTE + assignment.fte) : facilityFTE + 0}, 0)),
          nonFacilityFTE: Math.round(assignments.reduce(function (nonFacilityFTE, assignment) { return assignment.project.costModel !== 'Facility' ? (nonFacilityFTE + assignment.fte) : nonFacilityFTE + 0 }, 0)),
          capacityDays: Math.round(capacitiesInPeriod.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0)),
          targetDays: Math.round(capacitiesInPeriod.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0) * 0.8),
          actualDays: Math.round(assignments.reduce(function (totalDays, assignment) { return totalDays + ((220/12) * (assignment.fte/100)) }, 0)),
          facilityDays: Math.round(assignments.reduce(function (facilityDays, assignment) { return assignment.project.costModel === 'Facility' ? (facilityDays + ((220/12) * (assignment.fte/100))) : facilityDays + 0}, 0)),
          nonFacilityDays: Math.round(assignments.reduce(function (nonFacilityDays, assignment) { return assignment.project.costModel !== 'Facility' ? (nonFacilityDays + ((220/12) * (assignment.fte/100))) : nonFacilityDays + 0 }, 0))
        }

        utilisation.push(monthlyUtilisation)

        startDate = startDate.plus({months: 1})
      }
      return utilisation
    }

    async function reset () {
      capacities.value = []
    }

    return { capacities, getCapacities, setCapacities, getByID, getCapacityInPeriod, getUtilisation, reset }
},
{
    persist: true
})