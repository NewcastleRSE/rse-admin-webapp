<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <menu-bar :edited="edited" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
        <gantt-chart ref="gantt" />
      </div>
      <create-modal ref="create" />
    </div>
  </div>
</template>
<script>
import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
import GanttChart from "@/components/Assignments/GanttChart.vue";
import CreateModal from "@/components/Assignments/CreateModal.vue";
import MenuBar from "@/components/Assignments/MenuBar.vue";

export default {
  name: "AssignmentGantt",
  components: { MenuBar, GanttChart, CreateModal },
  data() {
    return {
      edited: false,
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
    create: function() {
      this.$refs.create.toggleModal();
    },
    addAssignment: function(assignment) {
      this.edited = true
      this.$store.commit("assignments/addAssignment", assignment)
    },
    save: function() {
      let savedAssignments = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      let updates = this.assignments;

      let newItems = this.getNewItems(savedAssignments, updates);
      let deletedItems = this.getNewItems(
        updates,
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
