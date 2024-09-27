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
import { toRefs, ref, watch } from 'vue'
import { useUserStore } from '../../stores'
import { DateTime } from 'luxon-business-days'
import { storeToRefs } from 'pinia'

const props = defineProps({
    rse: null
})

const userStore = useUserStore()

const { settings } = storeToRefs(userStore)

let { rse } = toRefs(props)

const calendar = props.rse.calendar.data

let billable = ref(0),
    nonBillable = ref(0),
    leave = ref(0),
    accountedFor = ref(0),
    missing = ref(0),
    recorded = ref(0),
    progressThroughCapacity = ref(0)

const nextCapacity = calendar.find(entry => DateTime.fromISO(entry.date) >= DateTime.now() && entry.utilisation.capacity > 0),
      workingDaysToDate = calendar.filter(entry => DateTime.fromISO(entry.date) <= DateTime.now() && entry.metadata.isWorkingDay).length

function renderSummary() {
    // Calculate average capacity for the year
    const averageFTECapacity = calendar.reduce((total, entry) => total + entry.utilisation.capacity, 0) / (calendar.length - 1),
        averageCapacity = 220 * (averageFTECapacity / 100),
        proRata = averageCapacity / 220

    // Calculate days from seconds (3600 seconds per hour * 7.4 hours per day)
    billable.value = calendar.reduce((total, entry) => total + entry.utilisation.recorded.billable, 0) / 26640,
    nonBillable.value = calendar.reduce((total, entry) => total + entry.utilisation.recorded.nonBillable, 0) / 26640,
    // leave returned in hours not seconds
    leave.value = calendar.reduce((total, entry) => total + (entry.leave ? entry.leave.duration : 0), 0) / 7.4

    recorded.value = billable.value + nonBillable.value
    accountedFor.value = recorded.value + leave.value


    //const workingDaysTarget = DateTime.fromISO(nextCapacity.date).minus({days: 1})
    const workingDaysSoFar = (workingDaysToDate * proRata).toFixed(0)

    progressThroughCapacity.value = Number(workingDaysSoFar > 0 ? ((workingDaysSoFar / averageCapacity) * 100).toFixed(2) : 0)
}

watch(settings, async () => {
  renderSummary()
},
{ deep: true })

renderSummary()

</script>