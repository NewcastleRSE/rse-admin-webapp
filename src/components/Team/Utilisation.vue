<template>
    <div class="w-full">
        <div v-for="month in props.months" class="relative mb-8" aria-hidden="true">
            <h2 class="text-xl pb-2 font-semibold">
                {{DateTime.fromObject({day: 1, month: month.month, year: month.year}).toFormat('MMMM')}}
            </h2>
            <h3 class="pb-2 font-semibold">
                {{(month.recorded / 60 / 60 / 7.4).toFixed(2)}} of {{(month.capacity / 60 / 60 / 7.4).toFixed(2)}} days
            </h3>
            <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
                <div class="h-4 absolute bg-cyan-600" :style="{ width: `${(month.billable/month.capacity) * 100}%` }" />
                <div class="h-4 absolute bg-yellow-400" :style="{ left: `${(month.billable/month.capacity) * 100}%`, width: `${(month.nonBillable/month.capacity) * 100}%` }" />
            </div>
        </div>  
    </div>
</template>
<script setup>

import { DateTime } from 'luxon'

const props = defineProps({
    months: null
})

</script>
  