<template>
  <div :class="`bg-${backgroundColour}`" class="h-full relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 shadow-lg">
    <div class="flex p-4">
      <div class="relative w-auto pr-4 flex flex-col justify-center">
        <component :is="icon" :class="`text-${iconColour}`" class="align-middle m-2 text-6xl"></component>
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
          <span :class="`text-${fontColour}`" class="mr-2 font-bold">
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
    },
    icon: {
      required: true
    },
    iconColour: {
      type: String,
      required: true
    },
    backgroundColour: {
      type: String,
      required: true
    },
    fontColour: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log(props)
  }
};
</script>
