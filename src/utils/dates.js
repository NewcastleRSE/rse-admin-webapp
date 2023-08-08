import { DateTime } from 'luxon'

export function currentFY(){
    const currentDate = DateTime.utc()

    let startDate = DateTime.utc(currentDate.year, 8),
        endDate = startDate.plus({ year: 1 }).minus({ day: 1 })

    if(currentDate.month < 8) {
      startDate = startDate.minus({ year: 1 }),
      endDate = endDate.minus({ year: 1 })
    }

    return {
        startDate: startDate,
        endDate: endDate,
        currentDate: currentDate
    }
}