import { DateTime } from 'luxon-business-days'

DateTime.prototype.businessDiff = function(d2, relative) {
  var d1 = this;
  var positive = d1 >= d2;
  var start = d1 < d2 ? d1 : d2;
  var end = d2 > d1 ? d2 : d1;
  var daysBetween = 0;

  if (start.hasSame(end, 'day')) {
    return daysBetween;
  }

  const closures = JSON.parse(localStorage.getItem('facilities')).closureDates

  const closureDates = closures.map(closure => DateTime.fromISO(closure.date).toISODate())

  while (start.startOf('day') < end.startOf('day')) {
    if (start.isBusinessDay() && !closureDates.includes(start.toISODate())) {
      daysBetween += 1;
    }
    start = start.plus({ days: 1 })
  }

  if (!end.isBusinessDay()) {
    daysBetween -= 1;
  }

  if (relative) {
    return (positive ? daysBetween : -daysBetween);
  }

  return daysBetween;
}

export function workingDaysDiff(from, to) {
    if(DateTime.isDateTime(from) && DateTime.isDateTime(to)) {

      // Convert to luxon-business-days DateTime objects
      const start = DateTime.fromISO(from.toISO())
      const end = DateTime.fromISO(to.toISO())

      return end.plus({ days: 1 }).businessDiff(start, ['days'])
    }
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