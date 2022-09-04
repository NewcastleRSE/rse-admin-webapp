<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
  >
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex-none">
        <img :src="avatar" class="h-20 rounded-full m-2 shadow-lg" />
      </div>
      <div class="flex-1">
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ team }}
          </h5>
          <h3 class="font-semibold text-blueGray-700">
            {{ name }}
          </h3>
          <h1 class="font-semibold text-blueGray-700">
            {{ from }}
          </h1>
          <span class="mr-2 font-bold text-emerald-500">
            <i class="fas fa-calendar-alt"></i>
            {{ Math.floor(waitTime.months) }} Months {{ Math.floor(waitTime.days) }} Days
          </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "availability-card",
  props: {
    avatar: {
      type: String,
    },
    team: {
      type: String,
    },
    name: {
      type: String,
    },
    from: {
      type: String,
    },
    waitTime: {
      type: Object,
    }
  },
};
</script>
