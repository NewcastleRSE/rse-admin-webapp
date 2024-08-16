<template>
  <div>
    <div class="bg-white">
      <div class="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
        <section v-for="(month, monthIdx) in months" :key="month.name" class="text-center">
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
            <div v-for="(day, dayIdx) in month.days" :key="day.date" :ref="el => { calendarDates.push(el) }" v-on:mouseover="togglePopover($event, day)"
            
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
            <div ref="popoverRef" :class="{'hidden': !popoverShow, 'block': popoverShow}" :style="{ 'left': popoverX +'px', 'top': popoverY +'px' }" class="bg-blueGray-700 text-white border-0 mb-3 fixed block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded">
              <div class="font-semibold p-3 mb-0 border-b border-solid border-slate-100 uppercase rounded-t-lg">
                  {{ popoverTitle }}
              </div>
              <div class="p-3">
                  <div v-for="entry in popoverContent" class="group relative flex justify-between gap-x-6 mb-2">
                    <div>
                      <div class="font-semibold">
                        {{ entry.project }}
                        <span class="absolute inset-0" />
                      </div>
                      <p>{{ entry.client }}</p>
                    </div>
                    <div>
                      <div class="font-semibold">
                        {{ entry.duration }}
                        <span class="absolute inset-0" />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<style>

    .holiday-holiday {
        background: linear-gradient(135deg, theme('colors.teal.400'), theme('colors.teal.400') 50%, theme('colors.teal.400') 50%, theme('colors.teal.400'))
    }

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
import { ref } from 'vue'
import { useCapacitiesStore, useLeaveStore, useCalendarStore } from '../../stores'
import { currentFY } from '../../utils/dates'
import { fetchObject } from '../../utils/orm'
import { DateTime, Duration } from 'luxon';

const props = defineProps({
  rse: null
})

const dates = currentFY()

const calendarDates = ref([]),
      popoverShow = ref(false)

const leaveStore = useLeaveStore(),
      capacitiesStore = useCapacitiesStore(),
      calendarStore = useCalendarStore()

const leave = leaveStore.getByRSE(props.rse.username),
      calendar = calendarStore.getByAcademicYear(),
      timesheets = await fetchObject('timesheets', props.rse.clockifyID)

let months = []

const contractStart = DateTime.fromISO(props.rse.contractStart)
const capacities = capacitiesStore.getCapacityInPeriod(dates.startDate.toISODate(), dates.endDate.toISODate(), props.rse.username)

let date = dates.startDate

for(let i = 0; i < 12; i++) {

    let startPoint = date.minus({days: (date.weekday - 1)})

    const days = []

    for(let d = 0; d < 42; d++) {

        let type = [null, null]

        let leaveRequest = leave.find(request => request.DATE === startPoint.toISODate()),
            timesheet = timesheets.dates[startPoint.toISODate()],
            holiday = calendar.find(holiday => holiday.date === startPoint.toISODate())

        // If is a date in this month
        if(startPoint.month === date.month) {

          if(holiday) {
            type = ['holiday','holiday']
          }
          
          if(timesheet) {

            let types = timesheet.reduce((billable, entry) => [...billable, entry.billable], [])

            if(types.every(type => type)) {
              type = ['billable','billable']
            }
            else if(types.every(type => !type)) {
              type = ['nonbillable','nonbillable']
            }
            else {
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

          if(startPoint < DateTime.now() && startPoint.weekday < 6 && startPoint > contractStart) {
            type[0] = type[0] ? type[0] : 'missing'
            type[1] = type[1] ? type[1] : 'missing'
          }
        }

        days.push({
            date: startPoint.toISODate(),
            isCurrentMonth: startPoint.month === date.month,
            leave: leaveRequest,
            timesheet: timesheet,
            type: !type[0] && !type[1] ? 'bg-white' : type.join('-')
        })

        startPoint = startPoint.plus({days: 1})
    }

    months.push({
        name: date.toFormat('MMMM yyyy'),
        id: date.toFormat('MMMyy'),
        days: days
    })

    date = date.plus({months: 1})
}

let popoverTitle = '',
    popoverContent  = '',
    popoverX = 0,
    popoverY = 0

    function togglePopover(event, day) {

      const idx = calendarDates.value.findIndex((element) => {  return element.contains(event.target) })                 
      const reference = calendarDates.value[idx]

      popoverShow.value = false

      if (!day.isCurrentMonth || day.type === 'bg-white' || day.type === 'missing-missing') {
          popoverShow.value = false
      }
      else {
        const position = reference.getBoundingClientRect()

        let entries = []

        if(day.leave) {
          if(day.leave.DURATION === 'A') {
            entries.push({
              project: 'Annual Leave',
              client: 'Half Day (AM)',
              duration: '03:42:00'
            })
          }
          else if(day.leave.DURATION === 'P') {
            entries.push({
              project: 'Annual Leave',
              client: 'Half Day (PM)',
              duration: '03:42:00'
            })
          }
          else {
            entries.push({
              project: 'Annual Leave',
              client: 'Full Day',
              duration: '07:24:00'
            })
          }
        }

        if(day.timesheet) {
          day.timesheet.forEach(entry => entries.push({
            project: entry.projectName,
            client: entry.clientName,
            duration: Duration.fromObject({ seconds: entry.timeInterval.duration }).toFormat('hh:mm:ss')
          }))
        }

        popoverTitle = DateTime.fromISO(day.date).toFormat('MMMM dd')
        popoverContent = entries
        popoverX = position.x + (position.width / 2)
        popoverY = position.y + (position.height * 1.5)
        popoverShow.value = true
      }
  }

</script>