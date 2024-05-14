<template>
    <li class="relative flex justify-between py-5">
        <div class="flex gap-x-4 pr-6 sm:w-1/4 sm:flex-none">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="getImageUrl(rse.photo)" :alt="rse.displayName" />
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                    <a :href="`/team/${(rse.displayName).replace(/\s+/g, '-').toLowerCase()}`">
                        <span class="absolute inset-x-0 -top-px bottom-0"></span>
                        {{ rse.displayName }}
                    </a>
                </p>
                <p class="mt-1 flex text-xs leading-5 text-gray-500">{{ rse.team }}</p>
            </div>
        </div>
        <div class="sm:w-3/4 flex flex-col flex-grow place-content-center">
            <TimeSummary :rse="rse" />
        </div>
    </li>
</template>
<script setup>
import { toRefs } from 'vue'
import TimeSummary from '@/components/Dashboard/TimeSummary.vue'

const props = defineProps({
    rse: null
})

let { rse } = toRefs(props)

function getImageUrl(name) {
  return new URL(`../../assets/img/avatars/${name}`, import.meta.url).href
}

</script>