<template>
    <div class="w-full">
        <div v-for="month in months" class="relative mb-8" aria-hidden="true">
            <h2 class="text-xl pb-2 font-semibold">
                {{month.month}}
            </h2>
            <h3 class="pb-2 font-semibold">
                {{((month.utilisation / 100) * 7.26).toFixed(2)}} of 7.26 hours
            </h3>
            <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
                <div class="h-4 absolute" :class="[month.utilisation > 100 ? 'bg-red-600' : 'bg-cyan-600']" :style="{ width: `${month.utilisation}%` }" />
            </div>
        </div>  
    </div>
</template>
<script setup>

const props = defineProps({
    months: null
})

</script>
  