<template>
    <div class="relative" aria-hidden="true" v-if="rse.lastname !== 'Horsfall' && rse.lastname !== 'Lozada'">
        <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
            <div class="h-4 absolute bg-cyan-600 left-0" :style="{ width: `${billable}%` }" />
            <div class="h-4 absolute bg-yellow-400" :style="{ left: `${billable}%`, width: `${nonBillable}%` }" />
            <div class="h-4 absolute bg-red-400" :style="{ left: `${recorded}%`, width: `${missing}%` }" />
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

const leave = leaveStore.getByRSE(props.rse.displayName)
const summary = timesheetStore.getRSESummary(props.rse)

console.log(leave)

const recorded = ((summary.recorded / summary.capacity) * 100).toFixed(2),
      billable = ((summary.billable / summary.capacity) * 100).toFixed(2),
      nonBillable = ((summary.nonBillable / summary.capacity) * 100).toFixed(2),
      missing = ((summary.missing / summary.capacity) * 100).toFixed(2)

const capacity = props.rse.displayName === 'Mark Turner' ? 1 : rse.value.capacity

const workingDaysSoFar = DateTime.now().workingDiff(DateTime.fromISO(props.rse.capacityStart), 'days')

const progressThroughCapacity = workingDaysSoFar > 0 ? ((workingDaysSoFar / capacity) * 100).toFixed(2) : 0

</script>