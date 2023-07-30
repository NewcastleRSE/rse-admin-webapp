import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { DateTime } from 'luxon'
import { fetchObjects } from '../utils/orm'

export const useAssignmentsStore = defineStore('assignments', () => {
    
    const store = useAuthStore()
    const assignments = ref([])

    function getAssignments() {
        return assignments.value
    }

    function setAssignments(data) {
      assignments.value = data
  }

    function getByID(id) {
        return assignments.value.find(assignment => assignment.id == id)
    }

    function getByRSE(rse) {
        return assignments.value.find(assignment => assignment.rse == rse)
    }

    function getByPeriod(start,end,rse = null) {
      let response
      
      if(rse) {
        response = assignments.value.filter(assignment =>
          (assignment.rse === rse
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
          (DateTime.fromISO(assignment.start) <= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(start)) ||
          (DateTime.fromISO(assignment.start) <= DateTime.fromISO(end)
            && DateTime.fromISO(assignment.end) >= DateTime.fromISO(end))
        )
      }

      return response.sort(function(a, b) {
        return DateTime.fromISO(b.end) - DateTime.fromISO(a.end)
      })
    }

    async function fetchAssignments () {
        assignments.value = await fetchObjects('assignments', 0, 100)
    }

    async function createAssignment (assignment) {
      return axios.post(`${import.meta.env.VITE_API_URL}/assignments`, 
        { 
          data: assignment
        },
        {
          headers: {
            Authorization: `Bearer ${store.jwt}`
          }
      }).then(response => {
        response.data.rse = assignment.rse
        response.data.project = assignment.project
        assignments.value.push(response.data)
      })
    }

    async function reset () {
      assignments.value = []
  }

    return { assignments, getAssignments, setAssignments, getByID, getByRSE, getByPeriod, fetchAssignments, createAssignment, reset }
},
{
    persist: true
})