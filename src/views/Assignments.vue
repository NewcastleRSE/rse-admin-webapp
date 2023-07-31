<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <menu-bar :edited="edited" :selected="selected" :zoom="zoom" :unallocated="unallocated" :unallocatedCount="unallocatedCount" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
      <Timeline ref="timeline" :rses="rses" :projects="projects" @create="create" @selection="selection" @edit="edit" />
    </div>
    <assignment-modal ref="assignmentModal" />
    <unallocated-modal ref="unallocated" />
  </div>
</template>
<script setup>
import Timeline from '@/components/Assignments/Timeline.vue'
import AssignmentModal from '@/components/Assignments/AssignmentModal.vue'
import UnallocatedModal from '@/components/Assignments/UnallocatedModal.vue'
import MenuBar from '@/components/Assignments/MenuBar.vue'
import { useAssignmentsStore, useRSEsStore, useProjectsStore } from '../stores'
import { ref, computed } from 'vue'

const assignmentsStore = useAssignmentsStore(),
      rsesStore = useRSEsStore(),
      projectsStore = useProjectsStore()

const assignmentModal = ref()

const timeline = ref(),
      edited = ref(false),
      rses = rsesStore.getRSEs(),
      projects = projectsStore.getProjects()

let selected = false

const unallocatedCount = computed(() => projects.filter(project => project.dealstage === 'Awaiting Allocation').length)

function zoom(level) {
  timeline.value.changeZoomLevel(level)
}

function selection(isSelected) {
  selected = isSelected
}

function unallocated() {
  let projectIDs = this.projects.filter(project => project.dealstage === 'Awaiting Allocation').reduce(function (ids, project) { return [...ids, project.id] }, [])
  this.$refs.unallocated.toggleModal(projectIDs)
}

function create(rseID, projectID, dateRange, split) {
  assignmentModal.value.createAssignment(null, rseID, projectID, dateRange, split)
}

function edit(assignmentID) {
  let assignment = assignmentsStore.getByID(assignmentID)
  //console.log(assignment)
  const dateRange = [{$d: new Date(assignment.start)}, {$d: new Date(assignment.end)}]
  assignmentModal.value.createAssignment(assignment.id, assignment.rse, assignment.project.id, dateRange, assignment.fte)
}

function addAssignment(assignment) {
  this.edited = true
  this.$refs.timeline.addAssignment(assignment)
  this.$store.commit('assignments/createAssignment', assignment)
}

function save() {
  this.$store.dispatch('assignments/commitAssignments').then(() => {
    this.assignments = this.$store.getters['assignments/getAssignments']
    this.edited = false
  })
}

function cancel() {
  this.assignments = this.$store.getters['assignments/getAssignments']
  this.edited = false
}

function remove() {
  this.edited = true
  let deletedItems = this.$refs.timeline.deleteAssignments()
  let assignmentIDs = deletedItems.map(item => Number(item.id.replace('gstcid-assignment-', '')))

  assignmentIDs.forEach((assignmentID) => {
    let assignment = this.assignments.filter(assignment => assignment.id === assignmentID)[0]
    this.$store.commit('assignments/deleteAssignment', assignment)
  })
}

function exportCSV() {
  const header = 'id,start,end,name,dealname' + '\r\n'
  let body = ''
  let chart = this.$store.getters[
    'assignments/getAssignments'
  ]
  chart.forEach((el) => {
    let line = ''
    for (let key in el) {
      if (line != '') {line += ','} // add commas for csv
      if (key === 'start' || key === 'end') {
        console.log(key)
        let date = new Date(el[key])
        line += date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
      }
      else if (el[key]) {
        line += el[key] // to remove undefined values
      } 
      else {
        line += ' ' 
      }
    }
    body += line + '\r\n'
  })
  let csv = header + body
  let link = document.getElementById('download')
  let blob = new Blob([csv], { type: 'text/csv'})
  link.download = 'data.csv'
  link.href = URL.createObjectURL(blob)

}

</script>
