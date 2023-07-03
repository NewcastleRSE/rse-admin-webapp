import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useAssignmentsStore = defineStore('assignments', () => {
    const assignments = ref([])

    function getAssignments() {
        return assignments.value
    }

    function getByID(id) {
        return assignments.value.find(rse => rse.id == id)
    }

    async function fetchAssignments () {
        assignments.value = await fetchObjects('assignments', 0, 100, ['rse', 'project'])
    }

    return { assignments, getAssignments, getByID, fetchAssignments }
},
{
    persist: true
})