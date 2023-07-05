<template>
    <li class="relative flex justify-between py-5">
        <div class="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
        <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="'/src/assets/img/avatars/' + rse.photo" :alt="rse.displayName" />
        <div class="min-w-0 flex-auto">
            <p class="text-sm font-semibold leading-6 text-gray-900">
            <a :href="`/team/${rse.id}`">
                <span class="absolute inset-x-0 -top-px bottom-0"></span>
                {{ rse.displayName }}
            </a>
            </p>
            <p class="mt-1 flex text-xs leading-5 text-gray-500">
            <a :href="`mailto:${rse.email}`" class="relative truncate hover:underline">{{ rse.email }}</a>
            </p>
        </div>
        </div>
        <div class="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
        <div class="hidden sm:block">
            <p class="text-sm leading-6 text-gray-900">{{ rse.team }}</p>
        </div>
        <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </div>
    </li>
</template>
<script setup>
import { defineProps } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

defineProps({
    rse: null
})
</script>