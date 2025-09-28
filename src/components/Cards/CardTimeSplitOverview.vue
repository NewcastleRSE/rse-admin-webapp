<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
            Team
          </h6>
          <h2 class="text-slate-700 text-xl font-semibold">
            Last 30 Days Time Split
          </h2>
        </div>
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"
        >
          <a
            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            href="#"
          >
            See all
          </a>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead class="thead-light">
          <tr>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Name
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Team
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"
            >
              Split
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timesheet in overview" :key="timesheet.rse.documentId">
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ timesheet.rse.firstname }} {{ timesheet.rse.lastname }}
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ timesheet.rse.team }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <div class="flex items-center">
                <!-- <span class="mr-2">60%</span> -->
                <div class="relative w-full">
                  <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div v-for="(entry, index) in timesheet.distribution" :key="index"
                      :data-project="entry.name"
                      :style="{ width: ((entry.actualTime / timesheet.totalTarget) * 100) + '%' }"
                      :class="colour(entry, index)"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                    ></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        overview: this.$store.getters["timesheets/getOverview"]
      };
    },
    methods: {
      colour: (entry, index) => {
        let colours = ['bg-sky-300', 'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700']
        if(entry.targetFTE === 0) {
          return 'bg-amber-500'
        }
        else {
          return colours[index]
        }
        
      }
    },
    props: {
      color: {
        default: "light",
        validator: function (value) {
          // The value must match one of these strings
          return ["light", "dark"].indexOf(value) !== -1;
        },
      },
    },
  };
</script>