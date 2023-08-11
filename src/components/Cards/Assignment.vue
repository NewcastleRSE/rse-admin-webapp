<template>
  <div :class="`bg-white`" class="h-full relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 shadow-lg">
    <div class="flex p-4">
      <div class="flex-1">
          <h3 class="font-semibold text-ellipsis overflow-hidden">
            {{ projectName }}
          </h3>
          <h5 class="text-blueGray-400 uppercase font-bold text-xs">
            {{ projectPI }}
          </h5>
          <div class="flex flex-row mt-4">
            <div class="grow">
              <h3 class="text-blueGray-900 uppercase font-bold">
                {{ start }}
              </h3>
              <h6 class="text-blueGray-400 mr-2 uppercase font-bold text-xs">
                Start
              </h6>
            </div>
            <div class="grow">
              <h3 class="text-blueGray-900 uppercase font-bold">
                {{ end }}
              </h3>
              <h6 class="text-blueGray-400 mr-2 uppercase font-bold text-xs">
                End
              </h6>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    projectName: {
      type: String,
      required: true
    },
    projectPI: {
      type: String,
      required: true
    },
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  setup() {

  }
};
</script>
