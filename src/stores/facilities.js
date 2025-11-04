import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'
import axios from 'axios'
import { DateTime } from 'luxon'

export const useFacilitiesStore = defineStore('facilities', () => {
    const facilities = ref([])
    const closureDates = ref([])

    function getFacilities() {
        return facilities.value
    }

    function getByID(documentId) {
        return facilities.value.find(facility => facility.documentId == documentId)
    }

    function getByYear(year) {
        return facilities.value.find(facility => facility.year == year)
    }

    function getClosureDates() {
        return closureDates.value
    }

    async function fetchFacilities () {
        facilities.value = await fetchObjects('facilities', 0, 100)
    }

    async function fetchClosureDates(year) {

        const response = await axios.get('/bank-holidays.json', { baseURL: 'https://www.gov.uk' })
        
        let bankHolidays = response.data['england-and-wales'].events,
                closures = []

        if(year) {
            const startDate = DateTime.fromISO(`${year}-08-01`),
                  endDate = DateTime.fromISO(`${(Number(year)+1)}-07-31`)

            bankHolidays = bankHolidays.filter(holiday => {
                const holidayDate = DateTime.fromISO(holiday.date)
                return holidayDate >= startDate && holidayDate <= endDate
            })
        }

        const christmases = bankHolidays.filter(holiday => holiday.title === 'Christmas Day')

        christmases.forEach(christmas => {
            const christmasBankHoliday = DateTime.fromISO(christmas.date)
            const christmasEve = DateTime.fromISO(`${christmasBankHoliday.year}-12-24`)

            for(let i=0; i<=7; i++) {
                let closureDate = christmasEve.plus({days: i})
                
                if(closureDate.toISODate() !== christmasBankHoliday.toISODate()) {
                    closures.push({
                        title: 'University Closure',
                        date: closureDate.toISODate(),
                        notes: '',
                        bunting: false
                    })
                } 
            }

            // If Christmas Eve is a Tuesday, the closure will start the day before
            if(christmasEve.weekday === 2) {
                closures.push({
                    title: 'University Closure',
                    date: christmasEve.minus({days: 1}).toISODate(),
                    notes: '',
                    bunting: false
                })
            }
        })

        closureDates.value = [...closures, ...bankHolidays]
    }

    async function reset () {
        facilities.value = []
        closureDates.value = []
    }

    return { facilities, closureDates, getFacilities, getByID, getByYear, getClosureDates, fetchFacilities, fetchClosureDates, reset  }
},
{
    persist: true
})