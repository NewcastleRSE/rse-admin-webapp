<template>
  <div class="h-full relative flex flex-col min-w-0 break-words bg-blueGray-700 rounded mb-6 xl:mb-0 shadow-lg">
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex flex-col justify-center">
        <i class="align-middle m-2 fas fa-bars-staggered text-cyan-400 text-6xl"></i>
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
          <span class="mr-2 font-bold text-blueGray-100">
            {{ subTitle }}
          </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subLabel: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: true
    }
  },
  setup() {

  }
};
</script>
