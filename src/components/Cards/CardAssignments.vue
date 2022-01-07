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
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-on:click="save()">
                <i class="fas fa-save text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-on:click="cancel()">
                <i class="fas fa-undo text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-on:click="remove()">
                <i class="fas fa-trash-alt text-lg leading-lg opacity-75 text-blueGray-700"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="px-3 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 text-blueGray-700" v-on:click="exportCSV()">
                <i class="fas fa-download-alt text-lg leading-lg opacity-75 text-blueGray-700"></i>
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
import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
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
    /**
     * getNewItems():
     * All assignments dictionaries which are in currentAssignments
     * however not in tempAssignements
     * @returns dictionary
     */
    getNewItems: function(savedAssignments, notSavedAssignments) {
      return differenceWith(notSavedAssignments, savedAssignments, isEqual);
    },
    /**
     * getDeletedItems():
     * All assignments dictionaries which are in tempAssignments
     * however not in currentAssignements
     * @returns dictionary
     */
    getDeletedItems: function(savedAssignments, notSavedAssignments) {
      return differenceWith(savedAssignments, notSavedAssignments, isEqual);
    },
    addAssignment: function(assignment) {
      console.log(assignment)

      this.edited = true
      this.assignments.push(assignment);
    },
    save: function() {
      let savedAssignments = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      let notSavedAssignments = this.chart;

      let newItems = this.getNewItems(savedAssignments, notSavedAssignments);
      let deletedItems = this.getNewItems(
        notSavedAssignments,
        savedAssignments
      );

      console.log("new: ", newItems);
      console.log("deleted: ", deletedItems);

      let promises = [];

      newItems.forEach((item) => {
        const assignment = {
          //id: this.$store.getters["assignments/getUID"],
          member: { id: item.parent },
          startDate: new Date(item.start).toISOString(),
          endDate: new Date(item.end).toISOString(),
          projectID: item.name,
        };
        promises.push(
          this.$store.dispatch("assignments/saveAssignment", assignment)
        );
      });
      deletedItems.forEach((item) => {
        promises.push(
          this.$store.dispatch(
            "assignments/deleteAssignment",
            item.assignmentID
          )
        );
      });

      Promise.allSettled(promises).then(() => {
        // updates chart to match what is stored in the db
        this.chart = this.$store.getters["assignments/getSavedAssignments"];
        this.edited = false;
      });
    },
    cancel: function() {
      this.assignments = this.$store.getters["assignments/getSavedAssignments"];
      this.edited = false;
    },
    remove: function() {

      this.edited = true;
      console.log(this.$refs.chart.chart.getSelectedPoints())
      this.$refs.chart.chart.getSelectedPoints().forEach((point) => {
        try {
          this.assignments = this.assignments.filter(
            (item) => item.assignmentID !== point.assignmentID
          );
        } catch {
          console.log("Failed To Delete");
        }
      });
    },
    exportCSV: function() {

      const header = "id,start,end,name,dealname" + "\r\n";
      let body = "";
      let chart = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      chart.forEach((el) => {
        let line = "";
        for (let key in el) {
          if (line != "") {line += ","} // add commas for csv
          if (key === "start" || key === "end") {
            console.log(key)
            let date = new Date(el[key]);
            line += date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          else if (el[key]) {
            line += el[key]; // to remove undefined values
          } 
          else {
            line += " "; 
          }
        }
        body += line + "\r\n";
      })
      let csv = header + body;
      let link = document.getElementById("download");
      let blob = new Blob([csv], { type: "text/csv"});
      link.download = "data.csv";
      link.href = URL.createObjectURL(blob);

    }
  }
};
</script>
