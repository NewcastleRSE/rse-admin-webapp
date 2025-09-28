<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-slate-700' : 'text-white']"
          >
            All Projects
          </h3>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Name
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Lead
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              School
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Progress
            </th>
            <th
              class="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Condition
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ project.name }}
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <div class="flex items-center">
                <img :src="avatars.default" class="w-10 h-10 rounded-full border-2 border-slate-50 shadow mr-2" />{{ project.project_lead }}
              </div>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ project.school  }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <div class="flex items-center">
                <span class="mr-2">60%</span>
                <div class="relative w-full">
                  <div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                    <div class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500" style="width: 60%;"></div>
                  </div>
                </div>
              </div>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <span v-if="project.condition === 'Red'" class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200 uppercase last:mr-0 mr-1">
                <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i> {{ project.condition }}
              </span>
              <span v-if="project.condition === 'Amber'" class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200 uppercase last:mr-0 mr-1">
                <i class="fas fa-exclamation text-amber-600 mr-2"></i> {{ project.condition }}
              </span>
              <span v-if="project.condition === 'Green'" class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1">
                <i class="fas fa-check text-emerald-600 mr-2"></i> {{ project.condition }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import defaultAvatar from "@/assets/img/avatars/mark-turner.png"

  export default {
    data() {
      return {
        avatars: {
          default: defaultAvatar
        },

      }
    },
    computed: {
      projects() {
        return this.$store.state.projects.projects
      }
    },
    watch: {
      '$store.state.projects.projects': function() { }  
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
