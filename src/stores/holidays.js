import { defineStore } from 'pinia'
import { ref } from 'vue'
import { currentFY } from '../utils/dates'
import { fetchObject } from '../utils/orm'
import { DateTime } from 'luxon-business-days'

export const useHolidaysStore = defineStore('holidays', () => {
    const holidays = ref([])
    const leave = ref([])

    const isHoliday = function(inst) {
        const closureDates = holidays.value.map(holiday => DateTime.fromISO(holiday.date))
        console.log(closureDates)
        return closureDates.includes(inst)
    }
      
    const dt = DateTime.local();
    dt.setupBusiness({ holidayMatchers: [isHoliday] })

    function getHolidays() {
        return holidays.value
    }

    function getByYear(year) {
        return holidays.value.filter(holiday => holiday.date.split('-')[0] === year )
    }

    function getByAcademicYear() {
        const currentYear = currentFY()
        return holidays.value.filter(holiday => currentYear.startDate <= DateTime.fromISO(holiday.date) && currentYear.endDate >= DateTime.fromISO(holiday.date))
    }

    async function fetchHolidays () {
        const ukBankHolidays = await fetch('https://www.gov.uk/bank-holidays.json').then((response) => response.json())
        
        const bankHolidays = ukBankHolidays['england-and-wales'].events,
              closures = []

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
        })

        holidays.value = [...bankHolidays, ...closures].sort((a,b) => DateTime.fromISO(a.date) - DateTime.fromISO(b.date))
    }

    async function fetchLeave () {
        leave.value = await fetchObject('timesheets', 'leave', '*')
    }

    async function reset () {
        holidays.value = []
    }

    return { holidays, leave, getHolidays, getByYear, getByAcademicYear, fetchHolidays, fetchLeave, reset }
},
{
    persist: true
})