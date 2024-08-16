import { DateTime } from 'luxon-business-days'

DateTime.prototype.workingDiff = function(d2, relative) {

    const holidays = JSON.parse(localStorage.getItem('calendar')).holidays
    const closureDates = holidays.map(holiday => holiday.date)

    let d1 = this
    let positive = d1 >= d2
    let start = d1 < d2 ? d1 : d2
    let end = d2 > d1 ? d2 : d1
    let daysBetween = 0
  
    if (start.hasSame(end, 'day')) {
      return daysBetween
    }
  
    while (start.startOf('day') < end.startOf('day')) {
      if (start.isBusinessDay() && !closureDates.includes(start.toISODate())) {
        daysBetween += 1
      }
      start = start.plus({ days: 1 })
    }
  
    if (!end.isBusinessDay()) {
      daysBetween -= 1
    }
  
    if (relative) {
      return (positive ? daysBetween : -daysBetween)
    }
  
    return daysBetween
}

export function currentFY(){
    const currentDate = DateTime.utc()

    let startDate = DateTime.utc(currentDate.year, 8),
        endDate = startDate.plus({ year: 1 }).minus({ day: 1 })

    if(currentDate.month < 8) {
      startDate = startDate.minus({ year: 1 }),
      endDate = endDate.minus({ year: 1 })
    }

    return {
        startDate: startDate.startOf('day'),
        endDate: endDate.endOf('day'),
        currentDate: currentDate
    }
}