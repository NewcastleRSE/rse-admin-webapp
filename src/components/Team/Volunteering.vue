<template>
    <div class="w-full">
        <div v-for="month in months" class="relative mb-8" aria-hidden="true">
            <h2 class="text-xl pb-2 font-semibold">
                {{month.month}}
            </h2>
            <div class="overflow-hidden rounded-full bg-gray-200 h-4 relative">
                <div class="h-4 absolute" :class="[month.duration > 100 ? 'bg-red-600' : 'bg-cyan-600']" :style="{ width: `${month.duration}%` }" />
            </div>
        </div>  
    </div>
</template>
<script setup>

const props = defineProps({
    months: null
})

</script>
  