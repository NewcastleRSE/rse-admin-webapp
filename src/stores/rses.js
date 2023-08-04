import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { fetchObjects } from '../utils/orm'
import * as Stores from '@/stores'

export const useRSEsStore = defineStore('rses', () => {
    const rses = ref([])

    function getRSEs(inactive = false) {
        return rses.value.filter(rse => {
            return inactive ? true : rse.active
        }).sort(function(a, b) {
            return a.lastname.localeCompare(b.lastname);
        })
    }

    function getByName(name) {
        return rses.value.find(rse => `${rse.firstname.replace(/\s+/g, '-').toLowerCase()}-${rse.lastname.replace(/\s+/g, '-').toLowerCase()}` == name)
    }

    function getByID(id) {
        return rses.value.find(rse => rse.id == id)
    }

    function getNext(teamName) {

        let team = rses.value.filter(rse => rse.nextAvailableDate && rse.active)

        if(teamName) {
            team = team.filter(rse => rse.team === teamName)
        }

        team.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let index = 0

          if(`${team[0].firstname} ${team[0].lastname}` === 'Mark Turner') {
            index = 1
          }
          
          let nextRSE = team[index]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
          return nextRSE
    }

    function addAssignment (assignment) {
        const position = rses.value.map(e => e.id).indexOf(assignment.rse)
        const project = { data: assignment.project }
        delete assignment.project
        assignment.project = project
        rses.value[position].assignments.push(assignment)
    }

    function updateAssignment (assignment) {
        const rseIndex = rses.value.map(e => e.id).indexOf(assignment.rse)
        const assignmentIndex = rses.value[rseIndex].assignments.map(e => e.id).indexOf(assignment.id)

        rses.value[rseIndex].assignments[assignmentIndex] = assignment
    }

    function deleteAssignment (assignment) {
        const rseIndex = rses.value.map(e => e.id).indexOf(assignment.rse)
        const assignmentIndex = rses.value[rseIndex].assignments.map(e => e.id).indexOf(assignment.id)

        rses.value[rseIndex].assignments.splice(assignmentIndex, 1)
    }

    async function fetchRSEs () {
        let rseData = await fetchObjects('rses', 0, 100, ['assignments', 'assignments.project', 'capacities'])

        Object.keys(import.meta.glob('@/assets/img/avatars/*.*')).forEach(key => {

            const rseIndex = rseData.findIndex(rse => {
                let name = `${rse.firstname} ${rse.lastname}`
                return name.toLowerCase() === key.replace(/^.*[\\/]/, '').split('.')[0].split('-').join(' ')
            })

            rseData[rseIndex].photo = key.replace(/^.*[\\/]/, '')
            rseData[rseIndex].displayName = `${rseData[rseIndex].firstname} ${rseData[rseIndex].lastname}`
        })

        let assignmentData = []
        let capacityData = []

        rseData.forEach((rse) => {
            assignmentData = [...assignmentData, ...rse.assignments.map(assignment => ({...assignment, rse: rse.id}))]
            capacityData = [...capacityData, ...rse.capacities.map(capacity => ({...capacity, rse: rse.id}))]
        })

        assignmentData.forEach((assignment, index) => {
            assignmentData[index].project = assignment.project.data
        })

        const assignmentsStore = Stores.useAssignmentsStore()
        assignmentsStore.setAssignments(assignmentData)

        const capacitiesStore = Stores.useCapacitiesStore()
        capacitiesStore.setCapacities(capacityData)

        rses.value = rseData
    }

    async function reset () {
        rses.value = []
    }

    return { rses, getRSEs, getByName, getByID, getNext, addAssignment, updateAssignment, deleteAssignment, fetchRSEs, reset }
},
{
    persist: true
})