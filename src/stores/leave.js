import { defineStore } from 'pinia'
import { ref } from 'vue'
import { currentFY } from '../utils/dates'
import { fetchObject } from '../utils/orm'
import { DateTime } from 'luxon'

export const useLeaveStore = defineStore('leave', () => {
    const leave = ref([])

    function getLeave() {
        return leave.value
    }

    function getByYear(year) {
        return leave.value.filter(leave => leave.DATE.split('-')[0] === year )
    }

    function getByAcademicYear() {
        const currentYear = currentFY()
        return leave.value.filter(leave => currentYear.startDate <= DateTime.fromISO(leave.DATE) && currentYear.endDate >= DateTime.fromISO(leave.DATE))
    }

    function getByRSE(username) {
        const currentYear = currentFY()
        return leave.value.filter(leave => currentYear.startDate <= DateTime.fromISO(leave.DATE) && currentYear.endDate >= DateTime.fromISO(leave.DATE) && leave.ID === username)
    }

    async function fetchLeave () {
        leave.value = await fetchObject('timesheets', 'leave', '*')
    }

    async function reset () {
        leave.value = []
    }

    return { leave, getLeave, getByYear, getByAcademicYear, getByRSE, fetchLeave, reset }
},
{
    persist: true
})