<template>
    <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-lg sm:px-6 sm:pt-6">
        <dt>
            <div class="absolute rounded-md bg-cyan-500 p-3">
                <component :is="icon" class="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <p class="ml-24 truncate text-sm font-medium text-gray-500">{{ title }}</p>
        </dt>
        <dd class="ml-24 flex items-baseline pb-6 sm:pb-7">
            <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
            <p :class="[changeType === 'increase' ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold']">
            <ArrowUpIcon v-if="changeType === 'increase'" class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <ArrowDownIcon v-else class="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
            <span class="sr-only"> {{ changeType === 'increase' ? 'Increased' : 'Decreased' }} by </span>
            {{ change }}
            </p>
        </dd>
    </div>
  </template>
  <script setup>
  import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
  import { defineOptions, defineProps } from 'vue'
  
  defineOptions({
    name: 'finance-stat'
  })
  
  defineProps({
      icon: {
        required: true
      },
      title: {
        type: String,
      },
      value: {
        type: String,
      },
      change: {
        type: String,
      },
      changeType: {
        type: String,
      }
    })
  </script>
  