<template>
  <div>
    <div class="mx-auto w-full -m-24">
      <div class="w-full mb-12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <menu-bar :edited="edited" :selected="selected" :zoom="zoom" :unallocated="unallocated" :unallocatedCount="unallocatedCount" :create="create" :save="save" :cancel="cancel" :remove="remove" :export="exportCSV"/>
          <Timeline ref="timeline" :rses="rses" :projects="projects" @create="create" @selection="selection" @edit="edit" />
        </div>
        <create-modal ref="create" />
        <unallocated-modal ref="unallocated" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Timeline from '@/components/Assignments/Timeline.vue'
import CreateModal from '@/components/Assignments/CreateModal.vue'
import UnallocatedModal from '@/components/Assignments/UnallocatedModal.vue'
import MenuBar from '@/components/Assignments/MenuBar.vue'
import { DateTime } from 'luxon'
import { useRSEsStore, useProjectsStore } from '../stores'
import { ref, computed } from 'vue'

const rsesStore = useRSEsStore()
const projectsStore = useProjectsStore()

const edited = ref(false),
      selected = ref(false),
      rses = rsesStore.getRSEs(),
      projects = projectsStore.getProjects()

const unallocatedCount = computed(() => projects.filter(project => project.dealstage === 'Awaiting Allocation').length)

function zoom(level) {
  this.$refs.timeline.changeZoomLevel(level)
}

function selection(selected) {
  this.selected = selected
}

function unallocated() {
  let projectIDs = this.projects.filter(project => project.dealstage === 'Awaiting Allocation').reduce(function (ids, project) { return [...ids, project.id] }, [])
  this.$refs.unallocated.toggleModal(projectIDs)
}

function create(rseID, projectID, dateRange, split) {
  this.$refs.create.toggleModal(rseID, projectID, dateRange, split)
}

function edit(assignmentID, rseID, start, end) {
  let assignment = this.$store.getters['assignments/getAssignment'](assignmentID)

  assignment.rse = rseID
  assignment.start = DateTime.fromMillis(start).toISODate()
  assignment.end = DateTime.fromMillis(end).toISODate()

  this.$store.commit('assignments/editAssignment', assignment)
  this.edited = true
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
