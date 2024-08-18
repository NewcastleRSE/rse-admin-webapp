import { defineStore } from 'pinia'
import { ref } from 'vue'
import { currentFY } from '../utils/dates'
import { DateTime } from 'luxon-business-days'

export const useCalendarStore = defineStore('calendar', () => {

    const holidays = ref([])

    const workingDays = ref([])

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

    function getWorkingDays() {
        return workingDays.value
    }

    function getHolidaysByYear(year) {
        return holidays.value.filter(holiday => holiday.date.split('-')[0] === year )
    }

    function getWorkingDaysByYear(year) {
        return workingDays.value.filter(workingDay => workingDay.date.split('-')[0] === year )
    }

    function getHolidaysByAcademicYear() {
        const currentYear = currentFY()
        return holidays.value.filter(holiday => currentYear.startDate <= DateTime.fromISO(holiday.date) && currentYear.endDate >= DateTime.fromISO(holiday.date))
    }

    function getWorkingDaysByAcademicYear() {
        const currentYear = currentFY()
        return workingDays.value.filter(workingDay => currentYear.startDate <= DateTime.fromISO(workingDay.date) && currentYear.endDate >= DateTime.fromISO(workingDay.date))
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

        holidays.value = [...bankHolidays, ...closures].sort((a,b) => DateTime.fromISO(a.date) - DateTime.fromISO(b.date))

        const currentYear = currentFY()

        let startPoint = currentYear.startDate

        while (startPoint <= currentYear.endDate) {
            
            let holiday = holidays.value.find(holiday => holiday.date === startPoint.toISODate())

            // If day is not a holiday or a weekend
            if(!holiday && startPoint.weekday !== 5 && startPoint.weekday !== 6) {
               workingDays.value.push(startPoint.toISODate())
            }

            startPoint = startPoint.plus({ days: 1 })
        }
    }

    async function reset () {
        holidays.value = []
    }

    return { holidays, workingDays, getHolidays, getWorkingDays, getHolidaysByYear, getWorkingDaysByYear, getHolidaysByAcademicYear, getWorkingDaysByAcademicYear, fetchHolidays, reset }
},
{
    persist: true
})