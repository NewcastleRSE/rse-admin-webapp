<template>
  <div
    class="h-full relative flex flex-col min-w-0 break-words bg-blueGray-700 rounded mb-6 xl:mb-0 shadow-lg"
  >
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex flex-col justify-center">
        <i class="align-middle m-2 fas fa-bars-staggered text-emerald-400 text-6xl"></i>
      </div>
      <div class="flex-1">
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ label }}
          </h5>
          <h3 class="font-semibold text-white mb-3">
            {{ title }}
          </h3>
          <h1 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ subLabel }}
          </h1>
          <span class="mr-2 font-bold text-white">
            {{ subTitle }}
          </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "availability-card",
  props: {
    label: {
      type: String,
    },
    title: {
      type: String,
    },
    subLabel: {
      type: String,
    },
    subTitle: {
      type: String,
    }
  },
};
</script>
