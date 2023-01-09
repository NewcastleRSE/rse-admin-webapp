<template>
  <div>
    <availability-stats />
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="w-full mb-12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <menu-bar :edited="edited" :selected="selected" :zoom="zoom" :unallocated="unallocated" :unallocatedCount="unallocatedCount" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
          <Timeline ref="timeline" :rses="rses" :projects="projects" :assignments="assignments" @create="create" @selection="selection" />
        </div>
        <create-modal ref="create" />
        <unallocated-modal ref="unallocated" />
      </div>
    </div>
  </div>
</template>
<script>
import AvailabilityStats from "@/components/Headers/AvailabilityStats.vue"
import Timeline from "@/components/Assignments/Timeline.vue"
import CreateModal from "@/components/Assignments/CreateModal.vue"
import UnallocatedModal from "@/components/Assignments/UnallocatedModal.vue"
import MenuBar from "@/components/Assignments/MenuBar.vue"

export default {
  name: "AssignmentGantt",
  components: { AvailabilityStats, MenuBar, Timeline, CreateModal, UnallocatedModal },
  data() {
    return {
      edited: false,
      selected: false,
      rses: this.$store.getters["rses/getRses"],
      projects: this.$store.getters["projects/getProjects"](),
      assignments: this.$store.getters["assignments/getAssignments"]
    }
  },
  computed: {
    unallocatedCount() {
      return this.projects.filter(project => project.dealstage === 'Awaiting Allocation').length
    },
  },
  methods: {
    zoom: function(level) {
      this.$refs.timeline.changeZoomLevel(level)
    },
    selection: function(selected) {
      this.selected = selected
    },
    unallocated: function() {
      let projectIDs = this.projects.filter(project => project.dealstage === 'Awaiting Allocation')
                        .reduce(function (ids, project) { return [...ids, project.id] }, [])
      this.$refs.unallocated.toggleModal(projectIDs)
    },
    create: function(rseID, projectID, dateRange, split) {
      this.$refs.create.toggleModal(rseID, projectID, dateRange, split)
    },
    addAssignment: function(assignment) {
      this.edited = true
      this.$refs.timeline.addAssignment(assignment)
      this.$store.commit("assignments/createAssignment", assignment)
    },
    save: function() {
      // let savedAssignments = this.$store.getters["assignments/getSavedAssignments"]
      // let updates = this.$store.getters["assignments/getAssignments"]

      // let newAssignments = differenceWith(updates, savedAssignments, isEqual)
      // let deletedAssignments = differenceWith(savedAssignments, updates, isEqual)
      // let promises = []

      // console.log(newAssignments)

      // newAssignments.forEach((item) => {
      //   const assignment = {
      //     rse: { id: item.parent },
      //     startDate: new Date(item.start).toISOString(),
      //     endDate: new Date(item.end).toISOString(),
      //     projectID: item.project.id,
      //   }
      //   promises.push(
      //     this.$store.dispatch("assignments/saveAssignment", assignment)
      //   )
      // })
      // deletedAssignments.forEach((item) => {
      //   promises.push(
      //     this.$store.dispatch(
      //       "assignments/deleteAssignment",
      //       item.assignmentID
      //     )
      //   )
      // })

      this.$store.dispatch("assignments/commitAssignments").then(() => {
        this.assignments = this.$store.getters["assignments/getAssignments"]
        this.edited = false
        // this.$refs.timeline.redraw()
      })
    },
    cancel: function() {
      this.assignments = this.$store.getters["assignments/getAssignments"]
      this.edited = false
    },
    remove: function() {
      this.edited = true
      this.$refs.timeline.deleteAssignments()
      this.$refs.timeline.getSelectedAssignments().forEach((assignmentID) => {
        let assignment = this.assignments.filter(assignment => assignment.assignmentID === Number(assignmentID))[0]
        this.$store.commit("assignments/deleteAssignment", assignment)
      })
    },
    exportCSV: function() {

      const header = "id,start,end,name,dealname" + "\r\n"
      let body = ""
      let chart = this.$store.getters[
        "assignments/getAssignments"
      ]
      chart.forEach((el) => {
        let line = ""
        for (let key in el) {
          if (line != "") {line += ","} // add commas for csv
          if (key === "start" || key === "end") {
            console.log(key)
            let date = new Date(el[key])
            line += date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
          }
          else if (el[key]) {
            line += el[key] // to remove undefined values
          } 
          else {
            line += " " 
          }
        }
        body += line + "\r\n"
      })
      let csv = header + body
      let link = document.getElementById("download")
      let blob = new Blob([csv], { type: "text/csv"})
      link.download = "data.csv"
      link.href = URL.createObjectURL(blob)

    }
  }
}
</script>
