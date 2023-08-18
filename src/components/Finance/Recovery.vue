<template>
    <div class="w-full mb-12">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 p-4 shadow-lg rounded bg-white h-full">
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
                    <div class="h-8 absolute bg-cyan-600 left-0" :style="{ width: `${billable}%` }" />
                    <div class="h-8 absolute bg-yellow-400" :style="{ left: `${billable}%`, width: `${nonBillable}%` }" />
                    <div class="h-8 absolute bg-red-400" :style="{ left: `${recorded}%`, width: `${missing}%` }" />
                </div>
                <div class="h-12 w-0.5 -top-2 absolute bg-black" :style="{ left: `${progressThroughCapacity}%` }" />
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
        </div>
    </div>
</template>
<script setup>
import { useRSEsStore, useTimesheetsStore } from '../../stores'
import { DateTime } from 'luxon-business-days'
import { currentFY } from '../../utils/dates'

const timesheetStore = useTimesheetsStore(),
      rsesStore = useRSEsStore(),
      dates = currentFY()

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

</script>