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
            <div v-for="(day, dayIdx) in month.days" :key="day.date" :class="[day.isCurrentMonth ? 'bg-white text-gray-800' : 'bg-gray-50 text-gray-400', day.status === 'leave' && day.isCurrentMonth && '!bg-emerald-500 !text-white', dayIdx === 0 && 'rounded-tl-lg', dayIdx === 6 && 'rounded-tr-lg', dayIdx === month.days.length - 7 && 'rounded-bl-lg', dayIdx === month.days.length - 1 && 'rounded-br-lg', 'py-1.5 focus:z-10']">
              <time :datetime="day.date" class="mx-auto flex h-7 w-7 items-center justify-center rounded-full">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { currentFY } from '../../utils/dates'

const props = defineProps({
  leave: null
})

const dates = currentFY()

let months = []

let date = dates.startDate

for(let i = 0; i < 12; i++) {

    let startPoint = date.minus({days: (date.weekday - 1)})

    const days = []

    for(let d = 0; d < 42; d++) {

        let status = 'missing'

        if(props.leave.find(request => request.DATE === startPoint.toISODate())) {
            status = 'leave'
        }

        days.push({
            date: startPoint.toISODate(),
            isCurrentMonth: startPoint.month === date.month,
            status: status
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