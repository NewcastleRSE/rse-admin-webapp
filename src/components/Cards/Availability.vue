<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
  >
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex-none">
        <img :src="image" class="h-20 rounded-full m-2 shadow-lg" />
      </div>
      <div class="flex-1">
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ label }}
          </h5>
          <h3 class="font-semibold text-blueGray-700">
            {{ title }}
          </h3>
          <h1 class="font-semibold text-blueGray-700">
            {{ subTitle }}
          </h1>
          <span class="mr-2 font-bold text-cyan-600">
            <i class="fas fa-calendar-alt"></i>
            {{ value }}
          </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "availability-card",
  props: {
    image: {
      type: String,
    },
    label: {
      type: String,
    },
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    value: {
      type: String,
    }
  },
};
</script>
