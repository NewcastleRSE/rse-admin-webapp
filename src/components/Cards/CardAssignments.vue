<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="max-w-full flex-grow flex-1 w-full relative flex justify-between lg:w-auto pr-4 lg:static lg:block lg:justify-start">
          <h3 class="font-semibold text-lg text-white">
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
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-on:click="$refs.create.toggleModal()">
                <i class="fas fa-plus text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" @click="$refs.gantt.save()">
                <i class="fas fa-save text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" @click="$refs.gantt.cancel()">
                <i class="fas fa-undo text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" @click="$refs.gantt.delete()">
                <i class="fas fa-trash-alt text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <gantt-chart ref="gantt" />
  </div>
  <create-modal ref="create" />
</template>
<script>
import GanttChart from "./../Assignments/GanttChart.vue";
import CreateModal from "../Assignments/CreateModal.vue";

export default {
  name: "AssignmentGantt",
  components: { GanttChart, CreateModal },
  data() {
    return {
      assignments: [],
      projects: [],
      members: [],
      edited: false,
      showCreateModal: false
    }
  },
  methods: {
    addAssignment: function(assignment) {
      console.log(assignment)

      this.edited = true
      this.assignments.push(assignment);
    },
    save: function(assignments) {
      console.log(assignments);
    },
    cancel: function(assignments) {
      console.log(assignments);
    },
    remove: function(assignments) {
      console.log(assignments);
    },
  }
};
</script>
