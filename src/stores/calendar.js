import { defineStore } from 'pinia'
import { fetchObject } from '../utils/orm'

export const useCalendarStore = defineStore('calendar', () => {

    async function fetchCalendar (rse, year) {
        return await fetchObject('rse', `${rse.id}/calendar`, '*', { year: { $eq: year }})
    }

    return { fetchCalendar }
},
{
    persist: true
})