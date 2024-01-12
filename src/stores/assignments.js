import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore, useRSEsStore } from '@/stores'
import { DateTime, Interval } from 'luxon'
import { fetchObjects } from '../utils/orm'

export const useAssignmentsStore = defineStore('assignments', () => {
    
    const store = useAuthStore()
    const rses = useRSEsStore()
    const assignments = ref([])

    function getAssignments() {
        return assignments.value
    }

    function setAssignments(data) {
      assignments.value = data
  }

    function getByID(id) {
        return assignments.value.find(assignment => assignment.id === Number(id))
    }

    function getByRSE(rse) {
        return assignments.value.filter(assignment => assignment.rse.id === rse)
    }

    function getByProject(projectId) {
      return assignments.value.filter(assignment => assignment.project.id === Number(projectId))
    }

    function getByPeriod(start,end,rse = null) {
      let response

      const period = Interval.fromDateTimes(DateTime.fromISO(start).startOf('day'), DateTime.fromISO(end).endOf('day'))
      
      if(rse) {
        response = assignments.value.filter(assignment =>
          (assignment.rse.id === rse
          // assignment crosses start date provided
          && DateTime.fromISO(assignment.start) <= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(start)) ||
          (assignment.rse === rse
          // assignment crosses end date provided
          && DateTime.fromISO(assignment.start) <= DateTime.fromISO(end)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(end)) ||
          (assignment.rse === rse
          // assignment within start and end date provided
          && DateTime.fromISO(assignment.start) >= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) <= DateTime.fromISO(end))
        )
      }
      else {
        response = assignments.value.filter(assignment =>
          period.overlaps(Interval.fromDateTimes(DateTime.fromISO(assignment.start), DateTime.fromISO(assignment.end)))
        )
      }

      return response.sort(function(a, b) {
        return DateTime.fromISO(a.start) - DateTime.fromISO(b.start)
      })
    }

    async function fetchAssignments () {
        assignments.value = await fetchObjects('assignments', 0, 100, ['project', 'rse'])
    }

    async function createAssignment (assignment) {
      return axios.post(`${import.meta.env.VITE_API_URL}/assignments?populate=*`, 
        { 
          data: assignment
        },
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
      }).then(response => {
        let newAssignment = response.data.data
        newAssignment.rse = response.data.data.rse.data.id
        newAssignment.project = response.data.data.project.data

        rses.addAssignment(newAssignment)
        assignments.value.push(newAssignment)
      })
    }

    async function updateAssignment (assignment) {
      return axios.put(`${import.meta.env.VITE_API_URL}/assignments/${assignment.assignmentId}?populate=*`, 
        { 
          data: assignment
        },
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
      }).then(response => {
        let updatedAssignment = response.data.data
        updatedAssignment.rse = response.data.data.rse.data.id
        updatedAssignment.project = response.data.data.project.data
        
        const position = assignments.value.map(e => e.id).indexOf(assignment.assignmentId)
        rses.updateAssignment(updatedAssignment)
        assignments.value[position] = updatedAssignment
      })
    }

    async function deleteAssignment (assignmentId) {
      return axios.delete(`${import.meta.env.VITE_API_URL}/assignments/${assignmentId}`, 
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
      }).then(() => {
          const position = assignments.value.map(e => e.id).indexOf(assignmentId)
          rses.deleteAssignment(assignments.value[position])
          assignments.value.splice(position, 1)
      })
    }

    async function reset () {
      assignments.value = []
  }

    return { assignments, getAssignments, setAssignments, getByID, getByRSE, getByProject, getByPeriod, fetchAssignments, createAssignment, updateAssignment, deleteAssignment, reset }
},
{
    persist: true
})