<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <menu-bar :edited="edited" :selected="selected" :zoom="zoom" :unallocated="unallocated" :unallocatedCount="unallocatedCount" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
      <Timeline ref="timeline" :rses="rses" :projects="projects" @create="create" @selection="selection" @edit="edit" />
    </div>
    <assignment-modal ref="assignmentModalRef" />
    <unallocated-modal ref="unallocatedModalRef" @createAssignment="create" />
  </div>
</template>
<script setup>
import Timeline from '@/components/Assignments/Timeline.vue'
import AssignmentModal from '@/components/Assignments/AssignmentModal.vue'
import UnallocatedModal from '@/components/Assignments/UnallocatedModal.vue'
import MenuBar from '@/components/Assignments/MenuBar.vue'
import { useAssignmentsStore, useRSEsStore, useProjectsStore } from '../stores'
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'

const assignmentsStore = useAssignmentsStore(),
      rsesStore = useRSEsStore(),
      projectsStore = useProjectsStore()

const assignmentModalRef = ref(),
      unallocatedModalRef = ref()

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
  unallocatedModalRef.value.toggleModal()
}

function create(rseID, projectID, dateRange, split) {
  assignmentModalRef.value.createAssignment(null, rseID, projectID, dateRange, split)
}

function edit(assignmentID, rseID, start, end) {

  let assignment = assignmentsStore.getByID(assignmentID)

  assignment.rse = rseID !== assignment.rse ? rseID : assignment.rse
  assignment.start = DateTime.fromMillis(start).toISODate() !== assignment.start ? DateTime.fromMillis(start).toISODate() : assignment.start
  assignment.end = DateTime.fromMillis(end).toISODate() !== assignment.end ? DateTime.fromMillis(end).toISODate() : assignment.end

  const dateRange = [{$d: new Date(assignment.start)}, {$d: new Date(assignment.end)}]
  assignmentModalRef.value.createAssignment(assignment.id, assignment.rse, assignment.project.id, dateRange, assignment.fte)
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
