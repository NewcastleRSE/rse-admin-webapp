<template>
    <div class="w-full mb-12">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 px-4 pt-4 shadow-lg rounded bg-white h-full">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        Finance
                    </h6>
                    <h2 class="text-blueGray-700 text-xl font-semibold">
                        Cost Recovery
                    </h2>
                </div>
            </div>
            <div class="relative my-4" aria-hidden="true">
                <div class="overflow-hidden rounded-full bg-gray-200 h-8 relative">
                    <div ref="billableBar" v-on:mouseover="togglePopover(billableBar, 'billable')" v-on:mouseleave="togglePopover(billableBar, 'billable')" class="h-8 absolute bg-cyan-600 left-0" :style="{ width: `${billable}%` }" />
                    <div ref="nonBillableBar" v-on:mouseover="togglePopover(nonBillableBar, 'nonBillable')" v-on:mouseleave="togglePopover(nonBillableBar, 'nonBillable')" class="h-8 absolute bg-yellow-400" :style="{ left: `${billable}%`, width: `${nonBillable}%` }" />
                    <div ref="missingBar" v-on:mouseover="togglePopover(missingBar, 'missing')" v-on:mouseleave="togglePopover(missingBar, 'missing')" class="h-8 absolute bg-red-400" :style="{ left: `${recorded}%`, width: `${missing}%` }" />
                </div>
                <div class="h-12 w-0.5 -top-2 absolute bg-black" :style="{ left: `${progressThroughCapacity}%` }" />
                <div ref="popoverRef" :class="{'hidden': !popoverShow, 'block': popoverShow}" :style="{ 'left': popoverX +'px', 'top': popoverY +'px' }" class="bg-blueGray-700 border-0 mb-3 fixed block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg">
                    <div>
                    <div class="text-white opacity-75 font-semibold p-3 mb-0 border-b border-solid border-slate-100 uppercase rounded-t-lg">
                        {{ popoverTitle }}
                    </div>
                    <div class="text-white p-3">
                        {{ popoverRatio }}% or {{ popoverDays }} days
                    </div>
                    </div>
                </div>
            </div>
            <div class="flex px-4 py-3">
                <ul class="py-2">
                    <li class="float-left">
                        <i class="fa-solid fa-square text-cyan-600"></i>
                        <span class="pl-2 pr-6">Billable</span>
                    </li>
                    <li class="float-left">
                        <i class="fa-solid fa-square text-yellow-400"></i>
                        <span class="pl-2 pr-6">Non-Billable</span>
                    </li>
                    <li class="float-left">
                        <i class="fa-solid fa-square text-red-400"></i>
                        <span class="pl-2 pr-6">Missing</span>
                    </li>
                </ul>
            </div>
            <dl class="grow grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="stat in stats" :key="stat.name" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white p-4 sm:px-6 xl:px-8">
                <dt class="text-sm font-medium leading-6 text-gray-500">{{ stat.name }}</dt>
                <dd class="text-gray-700 text-xs font-medium">{{ stat.ratio }}</dd>
                <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">{{ stat.value }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>
<script setup>
import { useRSEsStore, useTimesheetsStore } from '../../stores'
import { DateTime } from 'luxon-business-days'
import { createPopper } from '@popperjs/core'
import { ref } from 'vue'
import { currentFY } from '../../utils/dates'

const timesheetStore = useTimesheetsStore(),
      rsesStore = useRSEsStore(),
      dates = currentFY(),
      popoverShow = ref(false)

const popover = ref(),
      billableBar = ref(),
      nonBillableBar = ref(),
      missingBar = ref()

let popoverTitle = '',
    popoverRatio = 0,
    popoverDays = 0,
    popoverX = 0,
    popoverY = 0

const teamSummary = []

rsesStore.getRSEs().forEach(rse => teamSummary.push(timesheetStore.getRSESummary(rse)))

const totalCapacity = teamSummary.reduce((capacity, summary) => capacity + summary.capacity, 0),
      totalRecorded = teamSummary.reduce((recorded, summary) => recorded + summary.recorded, 0),
      totalBillable = teamSummary.reduce((billable, summary) => billable + summary.billable, 0),
      totalNonBillable = teamSummary.reduce((nonBillable, summary) => nonBillable + summary.nonBillable, 0),
      totalMissing = teamSummary.reduce((missing, summary) => missing + summary.missing, 0),
      averageProRata = totalCapacity / (220 * teamSummary.length)

const recorded = ((totalRecorded / totalCapacity) * 100).toFixed(2),
      billable = ((totalBillable / totalCapacity) * 100).toFixed(2),
      nonBillable = ((totalNonBillable / totalCapacity) * 100).toFixed(2),
      missing = ((totalMissing / totalCapacity) * 100).toFixed(2)

const workingDaysSoFar = DateTime.now().workingDiff(dates.startDate, 'days') * (teamSummary.length * averageProRata)

const progressThroughCapacity = workingDaysSoFar > 0 ? ((workingDaysSoFar / totalCapacity) * 100).toFixed(2) : 0

function togglePopover(reference, classification) {
      if(popoverShow.value){
        popoverShow.value = false
      }
      else {

        const position = reference.getBoundingClientRect()

        if(classification === 'billable') {
            popoverTitle = 'Billable Time'
            popoverRatio = billable
            popoverDays = totalBillable
            popoverX = position.x + (position.width / 2)
            popoverY = position.y + (position.height * 1.5)
            popoverShow.value = true
        }
        else if(classification === 'nonBillable') {
            popoverTitle = 'Non-Billable Time'
            popoverRatio = nonBillable
            popoverDays = totalNonBillable
            popoverX = position.x + (position.width / 2)
            popoverY = position.y + (position.height * 1.5)
            popoverShow.value = true
        }
        else if(classification === 'missing') {
            popoverTitle = 'Missing Time'
            popoverRatio = missing
            popoverDays = totalMissing
            popoverX = position.x + (position.width / 2)
            popoverY = position.y + (position.height * 1.5)
            popoverShow.value = true
        }
        
        createPopper(reference, popover, {
          placement: 'right'
        })

      }
    }

// console.log(totalCapacity)
// console.log(totalCapacity * 0.85)
// console.log(totalBillable)
// console.log(totalNonBillable)

const stats = [
  { name: 'Revenue', value: '£0', ratio: '0%' },
  { name: 'Invoiced', value: '£0', ratio: '0%' },
  { name: 'Secured', value: '£0', ratio: '0%' },
  { name: 'Expenses', value: '£0', ratio: '0%' },
]
</script>