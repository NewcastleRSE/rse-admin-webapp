<template>
    <a :href="link" class="block h-full relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 shadow-lg" :class="background">
      <div class="flex p-4">
        <div class="relative w-auto pr-4 flex flex-col justify-center">
          <component :is="icon" class="h-14 w-14 text-white"/>
        </div>
        <div class="flex-1">
            <h3 class="font-bold text-white mb-1 text-lg">
              {{ title }}
            </h3>
            <span class="mr-2 font-semibold text-slate-100 text-sm">
              {{ subTitle }}
            </span>
        </div>
      </div>
    </a>
  </template>
  <script setup>
  defineProps(['icon', 'title', 'subTitle', 'background', 'link'])
  </script>
  