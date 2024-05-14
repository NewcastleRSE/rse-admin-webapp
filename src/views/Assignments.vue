<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <menu-bar :edited="edited" :changeTeam="changeTeam" :changeFY="changeFY" :unallocated="unallocated" :unallocatedCount="unallocatedCount" :create="create" :export="exportCSV"/>
      <Timeline ref="timeline" :rses="rses" :projects="projects" @create="create" @edit="edit" @resize="resize" />
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

const unallocatedCount = computed(() => projects.filter(project => project.stage === 'Awaiting Allocation').length)

function changeTeam(team) {
  timeline.value.changeTeam(team)
}

function changeFY(year) {
  timeline.value.changeFY(year)
}

function unallocated() {
  unallocatedModalRef.value.toggleModal()
}

function create(rseID, projectID, dateRange, split) {
  assignmentModalRef.value.createAssignment(null, rseID, projectID, dateRange, split)
}

function edit(assignmentID, rseID, start, end) {
  let assignment = assignmentsStore.getByID(assignmentID)

  if(rseID) {
    assignment.rse = rseID !== assignment.rse ? rseID : assignment.rse
  }
  
  if(start && end) {
    assignment.start = DateTime.fromMillis(start).toISODate() !== assignment.start ? DateTime.fromMillis(start).toISODate() : assignment.start
    assignment.end = DateTime.fromMillis(end).toISODate() !== assignment.end ? DateTime.fromMillis(end).toISODate() : assignment.end
  }

  const dateRange = [{$d: new Date(assignment.start)}, {$d: new Date(assignment.end)}]
  assignmentModalRef.value.createAssignment(assignment.id, assignment.rse, assignment.project.id, dateRange, assignment.fte)
}

async function resize(assignmentID, rseID, start, end) {

  let assignment = assignmentsStore.getByID(assignmentID)

  assignment.rse = rseID !== assignment.rse ? rseID : assignment.rse
  assignment.start = DateTime.fromMillis(start).toISODate() !== assignment.start ? DateTime.fromMillis(start).toISODate() : assignment.start
  assignment.end = DateTime.fromMillis(end).toISODate() !== assignment.end ? DateTime.fromMillis(end).toISODate() : assignment.end

  await assignmentsStore.updateAssignment(assignment)
}

function exportCSV() {
  const header = 'id,start,end,name,name' + '\r\n'
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
