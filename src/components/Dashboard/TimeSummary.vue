<template>
    <div class="relative" aria-hidden="true" v-if="rse.lastname !== 'Horsfall' && rse.lastname !== 'Lozada'">
        <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
            <div class="h-4 absolute bg-cyan-600 left-0" :style="{ width: `${billable}%` }" />
            <div class="h-4 absolute bg-yellow-400" :style="{ left: `${billable}%`, width: `${nonBillable}%` }" />
            <div class="h-4 absolute bg-emerald-400" :style="{ left: `${recorded}%`, width: `${leave}%` }" />
            <div class="h-4 absolute bg-red-400" :style="{ left: `${accountedFor}%`, width: `${missing}%` }" />
        </div>
        <div class="h-6 w-0.5 -top-1 absolute bg-black" :style="{ left: `${progressThroughCapacity}%` }" />
    </div>
</template>
<script setup>
import { defineProps, toRefs } from 'vue'
import { useLeaveStore, useTimesheetsStore } from '../../stores'
import { DateTime } from 'luxon-business-days'

const props = defineProps({
    rse: null
})

const leaveStore = useLeaveStore(),
      timesheetStore = useTimesheetsStore()

let { rse } = toRefs(props)

const leaveRequests = leaveStore.getByRSE(props.rse.username)
let summary = timesheetStore.getRSESummary(props.rse)

summary.leave = 0

leaveRequests.forEach(leave => {
    const leaveDate = DateTime.fromISO(leave.DATE)
    if(leaveDate <= DateTime.now() && leaveDate >= DateTime.fromISO(props.rse.contractStart)) {
        summary.leave += leave.DURATION === 'Y' ? 1 : 0.5
    }  
})

const capacity = props.rse.displayName === 'Mark Turner' ? 220 : rse.value.capacity

const workingDaysSoFar = (DateTime.now().workingDiff(DateTime.fromISO(props.rse.capacityStart), 'days') * (capacity / 220)).toFixed(0)

const progressThroughCapacity = workingDaysSoFar > 0 ? ((workingDaysSoFar / capacity) * 100).toFixed(2) : 0

let missingDays = workingDaysSoFar - (summary.recorded + summary.leave)

missingDays = missingDays < 0 ? 0 : missingDays

const recorded = ((summary.recorded / summary.capacity) * 100).toFixed(2),
      billable = ((summary.billable / summary.capacity) * 100).toFixed(2),
      nonBillable = ((summary.nonBillable / summary.capacity) * 100).toFixed(2),
      leave = ((summary.leave / summary.capacity) * 100).toFixed(2),
      accountedFor = (((summary.recorded + summary.leave) / summary.capacity) * 100).toFixed(2),
      missing = ((missingDays / summary.capacity) * 100).toFixed(2)

// console.log(summary)
console.log(`${summary.name}, billable: ${summary.billable}, nonBillable: ${summary.nonBillable}, leave: ${summary.leave} of ${workingDaysSoFar}`)
console.log(' ')

</script>