<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Finance
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Cost Recovery
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <div class="relative pt-1 mb-8">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                Facility Year 2022/23 
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-emerald-600">
                80%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
            <div style="width:80%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
        </div>
        <div class="relative pt-1 mb-8">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                Facility Year 2023/24
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-red-600">
                30%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
            <div style="width:30%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
        </div>
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                Directly Incurred
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-amber-600">
                25%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
            <div style="width:25%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:30%"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        summary: this.$store.getters["transactions/getSummary"](2021)
      };
    }
  }
</script>
