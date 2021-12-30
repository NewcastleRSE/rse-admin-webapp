<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="max-w-full flex-grow flex-1 w-full relative flex justify-between lg:w-auto pr-4 lg:static lg:block lg:justify-start">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"
          >
            Project Assignments
          </h3>
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span class="block relative w-6 h-px rounded-sm bg-white"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div class="flex lg:flex-grow items-center" id="example-navbar-info">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <a class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']" href="#pablo">
                <i class="fas fa-save text-lg leading-lg opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']" href="#pablo">
                <i class="fas fa-times text-lg leading-lg opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']" href="#pablo">
                <i class="fas fa-trash-alt text-lg leading-lg opacity-75" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <gantt-chart />
  </div>
</template>
<script>
import GanttChart from "./../Assignments/GanttChart.vue";
export default {
  name: "AssignmentGantt",
  components: { GanttChart },
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
