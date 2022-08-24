<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <menu-bar :edited="edited" :zoom="zoom" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
        
        <Timeline ref="timeline" :rses="rses" :projects="projects" :assignments="assignments" @create="create" />
      </div>
      <create-modal ref="create" />
    </div>
  </div>
</template>
<script>
import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
import Timeline from "@/components/Assignments/Timeline.vue";
import CreateModal from "@/components/Assignments/CreateModal.vue";
import MenuBar from "@/components/Assignments/MenuBar.vue";

export default {
  name: "AssignmentGantt",
  components: { MenuBar, Timeline, CreateModal },
  data() {
    return {
      edited: false,
      rses: this.$store.getters["rses/getRses"],
      projects: this.$store.getters["projects/getProjects"](),
      assignments: this.$store.getters["assignments/getAssignments"]
    }
  },
  methods: {
    zoom: function(level) {
      this.$refs.timeline.changeZoomLevel(level)
    },
    create: function(rseID, projectID, dateRange, split) {
      this.$refs.create.toggleModal(rseID, projectID, dateRange, split);
    },
    addAssignment: function(assignment) {
      this.edited = true
      this.$refs.timeline.addAssignment(assignment)
      // this.$store.commit("assignments/addAssignment", assignment)
    },
    save: function() {
      let savedAssignments = this.$store.getters["assignments/getSavedAssignments"];
      let updates = this.$store.getters["assignments/getAssignments"];

      let newAssignments = differenceWith(updates, savedAssignments, isEqual);
      let deletedAssignments = differenceWith(savedAssignments, updates, isEqual);
      let promises = [];

      newAssignments.forEach((item) => {
        const assignment = {
          rse: { id: item.parent },
          startDate: new Date(item.start).toISOString(),
          endDate: new Date(item.end).toISOString(),
          projectID: item.project.id,
        };
        promises.push(
          this.$store.dispatch("assignments/saveAssignment", assignment)
        );
      });
      deletedAssignments.forEach((item) => {
        promises.push(
          this.$store.dispatch(
            "assignments/deleteAssignment",
            item.assignmentID
          )
        );
      });

      Promise.allSettled(promises).then(() => {
        // updates chart to match what is stored in the db
        this.assignments = this.$store.getters["assignments/getSavedAssignments"];
        this.edited = false;
        this.$refs.gantt.redraw()
      });
    },
    cancel: function() {
      this.assignments = this.$store.getters["assignments/getSavedAssignments"];
      this.edited = false;
    },
    remove: function() {
      this.edited = true;
      this.$refs.gantt.getSelectedAssignment().forEach((point) => {
        this.$store.commit("assignments/removeAssignment", point.assignmentID)
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
