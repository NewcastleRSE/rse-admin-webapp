<template>
  <div>
    <div class="bg-white">
      <div class="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
        <section v-for="month in months" :key="month.name" class="text-center">
          <h2 class="text-sm font-semibold text-gray-900">{{ month.name }}</h2>
          <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            <div v-for="(day, dayIdx) in month.days" :key="day.date"
            
            :class="[
                day.isCurrentMonth ? day.type : 'bg-gray-50 text-gray-400',
                dayIdx === 0 && 'rounded-tl-lg',
                dayIdx === 6 && 'rounded-tr-lg',
                dayIdx === month.days.length - 7 && 'rounded-bl-lg',
                dayIdx === month.days.length - 1 && 'rounded-br-lg',
                'aspect-square flex items-center justify-center'
            ]">
              <time :datetime="day.date">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<style>

    .billable-billable {
        background: linear-gradient(135deg, theme('colors.cyan.600'), theme('colors.cyan.600') 50%, theme('colors.cyan.600') 50%, theme('colors.cyan.600'));
        color: white
    }

    .billable-nonbillable {
        background: linear-gradient(135deg, theme('colors.cyan.600'), theme('colors.cyan.600') 50%, theme('colors.yellow.400') 50%, theme('colors.yellow.400'));
        color: white
    }

    .billable-leave {
        background: linear-gradient(135deg, theme('colors.cyan.600'), theme('colors.cyan.600') 50%, theme('colors.emerald.400') 50%, theme('colors.emerald.400'));
        color: white
    }

    .billable-missing {
        background: linear-gradient(135deg, theme('colors.cyan.600'), theme('colors.cyan.600') 50%, theme('colors.red.400') 50%, theme('colors.red.400'));
        color: white
    }

    .nonbillable-billable {
        background: linear-gradient(135deg, theme('colors.yellow.400'), theme('colors.yellow.600') 50%, theme('colors.cyan.600') 50%, theme('colors.cyan.600'))
    }

    .nonbillable-nonbillable {
        background: linear-gradient(135deg, theme('colors.yellow.400'), theme('colors.yellow.400') 50%, theme('colors.yellow.400') 50%, theme('colors.yellow.400'))
    }

    .nonbillable-leave {
        background: linear-gradient(135deg, theme('colors.yellow.400'), theme('colors.yellow.400') 50%, theme('colors.emerald.400') 50%, theme('colors.emerald.400'))
    }

    .nonbillable-missing {
        background: linear-gradient(135deg, theme('colors.yellow.400'), theme('colors.yellow.400') 50%, theme('colors.red.400') 50%, theme('colors.red.400'))
    }

    .leave-billable {
        background: linear-gradient(135deg, theme('colors.emerald.400'), theme('colors.emerald.400') 50%, theme('colors.cyan.600') 50%, theme('colors.cyan.600'))
    }

    .leave-nonbillable {
        background: linear-gradient(135deg, theme('colors.emerald.400'), theme('colors.emerald.400') 50%, theme('colors.yellow.400') 50%, theme('colors.yellow.400'))
    }

    .leave-leave {
        background: linear-gradient(135deg, theme('colors.emerald.400'), theme('colors.emerald.400') 50%, theme('colors.emerald.400') 50%, theme('colors.emerald.400'))
    }

    .leave-missing {
        background: linear-gradient(135deg, theme('colors.emerald.400'), theme('colors.emerald.400') 50%, theme('colors.red.400') 50%, theme('colors.red.400'))
    }

    .missing-billable {
        background: linear-gradient(135deg, theme('colors.red.400'), theme('colors.red.400') 50%, theme('colors.cyan.600') 50%, theme('colors.cyan.600'))
    }

    .missing-nonbillable {
        background: linear-gradient(135deg, theme('colors.red.400'), theme('colors.red.400') 50%, theme('colors.yellow.400') 50%, theme('colors.yellow.400'))
    }

    .missing-leave {
        background: linear-gradient(135deg, theme('colors.red.400'), theme('colors.red.400') 50%, theme('colors.emerald.400') 50%, theme('colors.emerald.400'))
    }

    .missing-missing {
        background: linear-gradient(135deg, theme('colors.red.400'), theme('colors.red.400') 50%, theme('colors.red.400') 50%, theme('colors.red.400'))
    }
</style>
<!-- class="bg-gradient-to-tl from-emerald-600 from-50% via-amber-600 via-50% to-amber-600" -->
<script setup>
import { defineProps } from 'vue'
import { useLeaveStore } from '../../stores'
import { currentFY } from '../../utils/dates'
import { fetchObject } from '../../utils/orm'
import { DateTime } from 'luxon';

const props = defineProps({
  rse: null
})

const dates = currentFY()

const leaveStore = useLeaveStore()

const leave = leaveStore.getByRSE(props.rse.username),
      timesheets = await fetchObject('timesheets', props.rse.clockifyID)

let months = []

let date = dates.startDate

for(let i = 0; i < 12; i++) {

    let startPoint = date.minus({days: (date.weekday - 1)})

    const days = []

    for(let d = 0; d < 42; d++) {

        let type = [null, null]

        let leaveRequest = leave.find(request => request.DATE === startPoint.toISODate()),
            timesheet = timesheets.dates[startPoint.toISODate()]

        // If is a date in this month
        if(startPoint.month === date.month) {
          
          if(timesheet) {

            let types = timesheet.reduce((billable, entry) => [...billable, entry.billable], [])

            if(types.every(Boolean)) {
              type = ['billable','billable']
            }
            else if(!types.every(Boolean)) {
              type = ['nonbillable','nonbillable']
            }
            else {
              console.log(timesheet)
              type = ['billable','nonbillable']
            }
          }

          if(leaveRequest) {
              if(leaveRequest.DURATION === 'A') {
                  type[0] = 'leave'
              }
              else if(leaveRequest.DURATION === 'P') { 
                  type[1] = 'leave'
              }
              else {
                  type = ['leave','leave']
              }
          }

          if(startPoint < DateTime.now() && startPoint.weekday < 6) {
            type[0] = type[0] ? type[0] : 'missing'
            type[1] = type[1] ? type[1] : 'missing'
          }
        }

        days.push({
            date: startPoint.toISODate(),
            isCurrentMonth: startPoint.month === date.month,
            type: !type[0] && !type[1] ? 'bg-white' : type.join('-')
        })

        startPoint = startPoint.plus({days: 1})
    }

    months.push({
        name: date.toFormat('MMMM yyyy'),
        days: days
    })

    date = date.plus({months: 1})
}
</script>