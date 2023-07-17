import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects, fetchTimesheetsSummary } from '../utils/orm'

export const useTimesheetsStore = defineStore('timesheets', () => {
    const timesheets = ref([])
    const summary = ref([])

    function getTimesheets() {
        return timesheets.value
    }

    function getSummary() {
        return summary.value
    }

    function getByID(id) {
        return timesheets.value.find(timesheet => timesheet.id == id)
    }

    async function fetchTimesheets () {
        timesheets.value = await fetchObjects('timesheets', 0, 100)
        summary.value = await fetchTimesheetsSummary('last6months')
    }

    async function reset () {
        timesheets.value = []
        summary.value = []
    }

    return { timesheets, summary, getTimesheets, getSummary, getByID, fetchTimesheets, reset }
},
{
    persist: true
})