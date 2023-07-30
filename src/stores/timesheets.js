import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useTimesheetsStore = defineStore('timesheets', () => {
    const timesheets = ref([])

    function getTimesheets() {
        return timesheets.value[0]
    }

    function getByID(id) {
        return timesheets.value.find(timesheet => timesheet.id == id)
    }

    function getByRSE(name) {
        return timesheets.value[0].team.find(rse => rse.name === name)
    }

    async function fetchTimesheets () {
        timesheets.value = await fetchObjects('timesheets', 0, 100)
    }

    async function reset () {
        timesheets.value = {}
    }

    return { timesheets, getTimesheets, getByID, getByRSE, fetchTimesheets, reset }
},
{
    persist: true
})