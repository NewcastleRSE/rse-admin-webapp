<template>
  <div>
    <div class="bg-white">
      <div
        class="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-4 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
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
            <div v-for="(day, dayIdx) in month.days" :key="day.date" v-on:mouseover="togglePopover($event, day)" :class="[
                day.hasEntries ? 'text-white' : 'text-gray-400',
                dayIdx === 0 && 'rounded-tl-lg',
                dayIdx === 6 && 'rounded-tr-lg',
                dayIdx === month.days.length - 7 && 'rounded-bl-lg',
                dayIdx === month.days.length - 1 && 'rounded-br-lg',
                'bg-gray-50 aspect-square flex items-center justify-center'
              ]"
              :style="day.style">
              <time :datetime="day.date">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
            </div>
            <div ref="popoverRef" :class="{ 'hidden': !popoverShow, 'block': popoverShow }"
              :style="{ 'left': popoverX + 'px', 'top': popoverY + 'px' }"
              class="bg-blueGray-700 text-white border-0 mb-3 fixed block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded">
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
<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../../stores'
import { DateTime, Duration } from 'luxon'
import { storeToRefs } from 'pinia'

const props = defineProps({
  rse: null
})

const popoverShow = ref(false)

const userStore = useUserStore()

const { settings } = storeToRefs(userStore)

let calendar = props.rse.calendar.data

let months = ref([])

let popoverTitle = '',
    popoverContent = '',
    popoverX = 0,
    popoverY = 0

// A full working day in seconds
const fullDay = 7.26 * 60 * 60

function renderCalendar() {

  months.value = []

  const dates = {
    startDate: DateTime.fromISO(`${settings.value.financialYear}-08-01`),
    endDate: DateTime.fromISO(`${(settings.value.financialYear + 1)}-07-31`)
  }

  const contractStart = DateTime.fromISO(props.rse.contractStart)

  let date = dates.startDate

  for (let i = 0; i < 12; i++) {

    let startPoint = date.minus({ days: (date.weekday - 1) })

    const days = []

    for (let d = 0; d < 42; d++) {

      let hasEntries = false,
          // 0: billable, 1: nonbillable, 2: leave
          timeSplit = [0, 0, 0],
          style = ''

      const calendarEntry = calendar.find(entry => entry.date === startPoint.toISODate())

      // If is a date in this month
      if (startPoint.month === date.month) {

        if (calendarEntry.holiday) {
          timeSplit[2] = 100
        }
        else {
          if (calendarEntry.timesheet.length > 0) {

            const billable = calendarEntry.timesheet.reduce((total, entry) => total += entry.billable ? entry.duration : 0, 0),
                  nonBillable = calendarEntry.timesheet.reduce((total, entry) => total += entry.billable ? 0 : entry.duration, 0),
                  recorded = billable + nonBillable

            if(recorded > fullDay) {
              timeSplit[0] = Number((billable / recorded * 100).toFixed(2))
              timeSplit[1] = Number((nonBillable / recorded * 100).toFixed(2))
            }
            else {
              timeSplit[0] = Number((billable / fullDay * 100).toFixed(2))
              timeSplit[1] = Number((nonBillable / fullDay * 100).toFixed(2))
            }
          }

          if(calendarEntry.leave) {
            if (calendarEntry.leave.durationCode === 'Y') {
              timeSplit[2] = 100
            }
            else {
              timeSplit[2] = 50
            }
          }
        }

        if(timeSplit.every(split => split === 0)) {
          style = { background: 'white' }
        }
        else {
          hasEntries = true
          style = {
            background: `linear-gradient(to bottom, rgb(8 145 178) 0%, rgb(8 145 178) ${timeSplit[0]}%, rgb(251 191 36) ${timeSplit[0]}%, rgb(251 191 36) ${(timeSplit[0] + timeSplit[1])}%, rgb(52, 211, 153) ${(timeSplit[0] + timeSplit[1])}%, rgb(52, 211, 153) ${(timeSplit[0] + timeSplit[1] + timeSplit[2])}%)`,
            color: timeSplit[0] >= 50 ? 'white' : 'black'
          }
        }
      }

      days.push({
        date: startPoint.toISODate(),
        isCurrentMonth: startPoint.month === date.month,
        calendarEntry: calendarEntry,
        style: style,
        hasEntries: hasEntries
      })

      startPoint = startPoint.plus({ days: 1 })
    }

    months.value.push({
      name: date.toFormat('MMMM yyyy'),
      id: date.toFormat('MMMyy'),
      days: days
    })

    date = date.plus({ months: 1 })
  }
}

function togglePopover(event, day) {

popoverShow.value = false

if (!day.isCurrentMonth) {
  popoverShow.value = false
}
else {
  const position = event.currentTarget.getBoundingClientRect()

  let entries = []
  if(day.calendarEntry.holiday) {
    entries.push({
      project: 'Public Holiday',
      client: day.calendarEntry.holiday.title,
      duration: '07:24:00'
    })
  }
  else {
    if (day.calendarEntry.leave) {
      if (day.calendarEntry.leave.durationCode === 'A') {
        entries.push({
          project: 'Annual Leave',
          client: 'Half Day (AM)',
          duration: '03:42:00'
        })
      }
      else if (day.calendarEntry.leave.durationCode === 'P') {
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
  }

  if (day.calendarEntry.timesheet) {
    day.calendarEntry.timesheet.forEach(entry => entries.push({
      project: entry.project,
      duration: Duration.fromObject({ seconds: entry.duration }).toFormat('hh:mm:ss')
    }))
  }

  popoverTitle = DateTime.fromISO(day.date).toFormat('MMMM dd')
  popoverContent = entries
  popoverX = position.x + (position.width / 2)
  popoverY = position.y + (position.height * 1.5)
  popoverShow.value = true
  }
}

watch(settings, async () => {
  renderCalendar()
},
{ deep: true })

renderCalendar()

</script>