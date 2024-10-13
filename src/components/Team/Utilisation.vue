<template>
    <div class="w-full">
        <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Month</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hours</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Utilisation</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-1/3">Split</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="month in months" :key="month.month">
                <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div class="flex items-center">
                    <div>
                      <div class="font-medium text-gray-900">{{DateTime.fromObject({day: 1, month: month.month, year: month.year}).toFormat('MMMM')}}</div>
                      <div class="mt-1 text-gray-500">{{(month.recorded / 60 / 60 / 7.26).toFixed(2)}} of {{(month.capacity / 60 / 60 / 7.26).toFixed(2)}} days</div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="text-gray-900">{{ convertSeconds(month.billable) }} Billable</div>
                  <div class="mt-1 text-gray-900">{{ convertSeconds(month.nonBillable) }} Non-Billable</div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset "
                  :class="month.utilisation >= 85 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'"
                  >
                    {{month.utilisation.toFixed(2)}}%
                    </span>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
                        <div class="h-4 absolute bg-cyan-600" :style="{ width: `${(month.billable/month.capacity) * 100}%` }" />
                        <div class="h-4 absolute bg-yellow-400" :style="{ left: `${(month.billable/month.capacity) * 100}%`, width: `${(month.nonBillable/month.capacity) * 100}%` }" />
                    </div>
                </td>
                <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <a target="_blank" class="text-cyan-600 hover:text-cyan-900"
                    :href="`https://app.clockify.me/reports/summary?start=${month.startDate}&end=${month.endDate}&filterValuesData=%7B%22users%22:%5B%22${clockifyID}%22%5D%7D`"
                    >Clockify</a>
                </td>
              </tr>
            </tbody>
          </table>
    </div>
</template>
<script setup>

import { DateTime } from 'luxon'

const props = defineProps({
    months: null,
    clockifyID: null
})

props.months.forEach((month, index) => {
    props.months[index].startDate = DateTime.fromObject({month: month.month, year: month.year}).startOf('month').toISODate() + 'T00:00:00.000Z',
    props.months[index].endDate = DateTime.fromObject({month: month.month, year: month.year}).endOf('month').toISODate() + 'T23:59:59.000Z',
    props.months[index].utilisation = (month.recorded / month.capacity) * 100
})

const convertSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const hourString = hours > 0 ? hours : '00'
  const minuteString = minutes > 0 ? minutes : '00'
  const secondString = remainingSeconds > 0 ? remainingSeconds : '00'

  return `${hourString}:${minuteString}:${secondString}`
}

</script>
  