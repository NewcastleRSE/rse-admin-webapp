import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useTimesheetsStore = defineStore('timesheets', () => {
    const timesheets = ref([])

    function getTimesheets() {
        return timesheets.value
    }

    function getByID(id) {
        return timesheets.value.find(timesheet => timesheet.id == id)
    }

    async function fetchTimesheets () {
        timesheets.value = await fetchObjects('timesheets', 0, 100)
    }

    return { timesheets, getTimesheets, getByID, fetchTimesheets }
},
{
    persist: true
})