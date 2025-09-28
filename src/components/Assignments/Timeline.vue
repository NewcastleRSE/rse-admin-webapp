<template>
  <div class="gstc-wrapper" ref="gstcElement"></div>
</template>
<style>

.gstc__chart-timeline-items-row-item {
  background: var(--color-cyan-600);
  border-radius: 0.25rem;
}

</style>
<script>
import GSTC from 'gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js'
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js'
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js'
import { Plugin as ItemResizing } from 'gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js'
import { Plugin as ItemMovement } from 'gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js'
import { Plugin as Bookmarks } from 'gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js'
import { Plugin as HighlightWeekends } from 'gantt-schedule-timeline-calendar/dist/plugins/highlight-weekends.esm.min.js'
import { Plugin as ProgressBar } from 'gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js'

import 'gantt-schedule-timeline-calendar/dist/style.css'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { DateTime } from 'luxon'
import { useAssignmentsStore } from '../../stores'
import globalthis from 'globalthis'

// const globalthis = require('globalthis')

let globalThis = globalthis(),
    canChangeRow = true,
    canCollide = false

function isCollision(item) {
  const allItems = globalThis.gstc.api.getAllItems()
  for (const itemId in allItems) {
    if (itemId === item.id) continue
    const currentItem = allItems[itemId]
    // Collision with overview row
    if (item.rowId.split('-').length === 3) return true
    // Collision with assignment on same row
    if (currentItem.rowId === item.rowId) {
      if (item.time.start >= currentItem.time.start && item.time.start <= currentItem.time.end) return true
      if (item.time.end >= currentItem.time.start && item.time.end <= currentItem.time.end) return true
      if (item.time.start <= currentItem.time.start && item.time.end >= currentItem.time.end) return true
      if (item.time.start >= currentItem.time.start && item.time.end <= currentItem.time.end) return true
    }
  }
  return false
}

function generateRows(RSEs) {
  /**
   * @type { import('gantt-schedule-timeline-calendar').Rows }
   */
  const rows = {}
  RSEs.forEach(rse => {
    const id = GSTC.api.GSTCID(`rse-${rse.documentId}`),
          assignments = GSTC.api.GSTCID(`rse-${rse.documentId}-assignments`)
          rows[id] = {
            id,
            label: `<img src="${new URL(`../../assets/img/avatars/${rse.photo}`, import.meta.url).href}" class="h-6 float-left rounded-full mr-2" style="margin-top: 8px" />${rse.firstname} ${rse.lastname}`,
          }
          rows[assignments] = {
            assignments,
            parentId: id,
            classNames: ['child-row'],
            label: '<div class="m-2"></div>'
          }
  })
  return rows
}

function generateAvailability(RSEs, assignments) {
  const items = {}

  let rseAssignments = Object.groupBy(assignments, (assignment) => assignment.rse.documentId)

  RSEs.forEach(rse => {
      let assignmentEndDates = rseAssignments[rse.documentId].reduce(function (dates, assignment) { return [...dates, assignment.end] }, [])
      const maxDate = new Date(Math.max(...assignmentEndDates.map(date => { return new Date(date) })))

      const id = GSTC.api.GSTCID(`rse-${rse.documentId}`),
        rowId = GSTC.api.GSTCID(`rse-${rse.documentId}`),
        assignmentsLength = DateTime.fromISO(rse.contractStart).diff(DateTime.fromJSDate(maxDate), ['days']).toObject(),
        capacity = DateTime.fromISO(rse.contractStart).diff(DateTime.fromISO(rse.nextAvailableDate), ['days']).toObject()

      items[id] = {
        id,
        label: rse.firstname + ' ' + rse.lastname,
        rowId,
        time: {
          start: DateTime.fromISO(rse.contractStart).toMillis(),
          end: DateTime.fromJSDate(maxDate).toMillis(),
        },
        progress: (capacity.days / assignmentsLength.days) * 100,
        classNames: ['bg-cyan-600', 'rounded']
      }
  })

  return items
}

function generateAssignments(rses, assignments) {

  /**
   * @type { import('gantt-schedule-timeline-calendar').Items }
   */
  const items = {}

  let rseAssignments = Object.groupBy(assignments, (assignment) => assignment.rse.documentId)

  rses.forEach(rse => {
    rseAssignments[rse.documentId].forEach(assignment => {

      const id = GSTC.api.GSTCID(`assignment-${assignment.documentId}`),
            rowId = GSTC.api.GSTCID(`rse-${rse.documentId}-assignments`)

      const assignmentStart = DateTime.fromISO(assignment.start),
            assignmentEnd = DateTime.fromISO(assignment.end)

      items[id] = {
        id,
        label: assignment.project.name,
        rowId,
        time: {
          start: assignmentStart.toMillis(),
          end: assignmentEnd.toMillis(),
        },
        progress: 100,
        classNames: ['bg-cyan-500', 'rounded']
      }
    })
  })
  return items
}

// main component
export default {
  name: 'Timeline',
  props: ['rses', 'projects', 'assignments'],
  emits: ['create', 'selection', 'edit', 'resize'],
  setup(props, { emit }) {
    let gstc, state
    const gstcElement = ref(null)
    onMounted(() => {
      const selectionOptions = {
        events: {
          onEnd(selected) {

            let cells = selected['chart-timeline-grid-row-cell']

            // Selection includes cells
            if (cells.length) {
              let rseID = cells[0].row.documentId.split('-')[2],
                  rse = props.rses.find(rse => rse.documentId == rseID)
              emit('create', rse, cells[0].time.leftGlobalDate.$d, cells[cells.length-1].time.rightGlobalDate.$d)
              gstc.api.plugins.Selection.selectItems([])
            }

            return selected
          },
        },
      }

      const resizingPluginConfig = {
        snapToTime: {
          start({ startTime, vido }) {
            const date = vido.api.time.findOrCreateMainDateAtTime(startTime.valueOf())
            return date.leftGlobalDate.startOf('day')
          },
          end({ endTime, vido }) {
            const date = vido.api.time.findOrCreateMainDateAtTime(endTime.valueOf())
            return date.leftGlobalDate.endOf('day')
          },
        },
        events: {
          onEnd({ items }) {
            items.after.forEach((assignment, index) => {
              const assignmentID = Number(assignment.documentId.split('-')[2]),
                    rseID = Number(assignment.rowId.split('-')[2])
              
              if(assignment.time.start !== items.initial[index].time.start || assignment.time.end !== items.initial[index].time.end) {
                emit('resize', assignmentID, rseID, assignment.time.start, assignment.time.end)
              }
            })
            return items.after
          }
        }
      }

      const movementPluginConfig = {
        events: {
          onMove({ items }) {
            // prevent items to change row
            return items.before.map((beforeMovementItem, index) => {
              const afterMovementItem = items.after[index]
              const myItem = GSTC.api.merge({}, afterMovementItem)
              if (!canChangeRow) {
                myItem.rowId = beforeMovementItem.rowId
              }
              if (!canCollide && isCollision(myItem)) {
                myItem.time = { ...beforeMovementItem.time }
                myItem.rowId = beforeMovementItem.rowId
              }
              return myItem
            })
          },
          onEnd({ items }) {
            items.after.forEach((assignment, index) => {
              const assignmentID = Number(assignment.documentId.split('-')[2]),
                    rseID = Number(assignment.rowId.split('-')[2])

              if(assignment.time.start !== items.initial[index].time.start || assignment.time.end !== items.initial[index].time.end) {
                emit('resize', assignmentID, rseID, assignment.time.start, assignment.time.end)
              }
            })
            return items.after
          }
        },
        snapToTime: {
          start({ startTime, vido }) {
            const date = vido.api.time.findOrCreateMainDateAtTime(startTime.valueOf())
            return date.leftGlobalDate.startOf('day')
          },
        },
      }

      function eventClickHandler(event, data){
          let itemData = data.item.id.split('-')
          // Only allow edit on assignment items
          if(itemData[1] === 'assignment') {
            let assignmentID = itemData[2]
            emit('edit', assignmentID)
          }
      }

      function clickAction(element, data){
        function onEventClick(event){
            eventClickHandler(event, data)
        }

        element.addEventListener('dblclick', onEventClick)

        return {
          update(element, newData){
            data = newData
          },
          destroy(element){
            element.removeEventListener('dblclick', onEventClick)
          }
        }
      }

      let FY = DateTime.local().month > 7 ? DateTime.local().year : DateTime.local().year - 1,
          FYStart = DateTime.fromObject({ year: FY, month: 8, day: 1}),
          FYEnd = DateTime.fromObject({ year: FY + 1, month: 7, day: 31})

      /**
       * @type { import('gantt-schedule-timeline-calendar').Config }
       */
      const config = {
        licenseKey:
          `${import.meta.env.VITE_GANTT_KEY}`,
        plugins: [ProgressBar(), HighlightWeekends(), TimelinePointer(), Selection(selectionOptions), ItemResizing(resizingPluginConfig), ItemMovement(movementPluginConfig), Bookmarks()],
        innerHeight: (props.rses.length * 40) + 72,
        list: {
          columns: {
            data: {
              [GSTC.api.GSTCID('label')]: {
                id: GSTC.api.GSTCID('label'),
                width: 200,
                data: 'label',
                isHTML: true,
                sortable: 'label',
                expander: true,
                header: {
                  content: 'Name',
                },
              },
            },
          },
          rows: generateRows(props.rses),
        },
        chart: {
          items: {
            ...generateAssignments(props.rses, props.assignments),
            ...generateAvailability(props.rses, props.assignments)
          },
          time: {
            calculatedZoomMode: true,
            from: FYStart.valueOf(),
            to: FYEnd.valueOf()
          }
        },
        actions: {
          'chart-timeline-items-row-item':[clickAction]
        }
      }
      state = GSTC.api.stateFromConfig(config)
      globalThis.state = state
      gstc = GSTC({
        element: gstcElement.value,
        state,
      })
      globalThis.gstc = gstc
      gstc.api.scrollToTime(DateTime.now().startOf('month').valueOf())

      const assignmentsStore = useAssignmentsStore()

      assignmentsStore.$subscribe((mutation) => {
        // New assignment
        if(mutation.events.type === 'add') {
          addAssignment(mutation.events.newValue)
        }
        // Deleted assignment
        else if(mutation.events.type === 'delete') {
          deleteAssignments()
        }
        // Edited Assignment
        else {
          updateAssignment(mutation.events.newValue)
        }
      })
    })
    onBeforeUnmount(() => {
      if (gstc) gstc.destroy()
    })
    function updateFirstRow() {
      state.update(`config.list.rows.${GSTC.api.GSTCID('0')}`, (row) => {
        row.label = 'Changed dynamically'
        return row
      })
    }
    function changeTeam(team) {
      if(team.key == 'All') {
        state.update('config.list.rows', generateRows(props.rses))
        state.update('config.chart.items', {...generateAssignments(props.rses, props.assignments), ...generateAvailability(props.rses, props.assignments)})
      }
      else {
        const filteredRSEs = props.rses.filter(rse => rse.team === team.key)

        state.update('config', config => {
          config.list.rows = generateRows(filteredRSEs)
          config.chart.items = {...generateAssignments(filteredRSEs, props.assignments), ...generateAvailability(filteredRSEs, props.assignments)}
          return config
        })
      }
    }
    function changeFY(period) {
      let year = period.name.split('/')[0],
          from = DateTime.fromISO(`${year}-08-01`).startOf('day'),
          to = from.plus({ years: 1 }).minus({ days:1 }).endOf('day')

      setTimeout(() => {
        state.update('config.chart.time', (time) => {
          time.from = from.valueOf()
          time.to = to.valueOf()
          return time;
        })
      }, 250)      
    }
    function addAssignment(assignment){
      let newItem = {
        id: GSTC.api.GSTCID(`assignment-${assignment.documentId}`),
        rowId: GSTC.api.GSTCID(`rse-${assignment.rse.documentId}-assignments`),
        label: assignment.project.name,
        time: {
          start: DateTime.fromISO(assignment.start).startOf('day').valueOf(),
          end: DateTime.fromISO(assignment.end).endOf('day').valueOf(),
        },
        progress: 100,
        classNames: ['bg-cyan-500', 'rounded']
      }
      gstc.api.plugins.Selection.selectItems([])
      state.update(`config.chart.items.${GSTC.api.GSTCID(`assignment-${assignment.documentId}`)}`, (item) => { item = newItem; return item } )
    }
    function updateAssignment(assignment){
      state.update(`config.chart.items.${GSTC.api.GSTCID(`assignment-${assignment.documentId}`)}`, item=>{
        item.label = assignment.project.name
        item.time = {
          start: DateTime.fromISO(assignment.start).startOf('day').valueOf(),
          end: DateTime.fromISO(assignment.end).endOf('day').valueOf(),
        }
        return item
      })
    }
    function deleteAssignments(){
      const selectedItems = gstc.api.plugins.Selection.getSelected()['chart-timeline-items-row-item']
      state.update('config.plugin.Selection.lastSelecting.chart-timeline-items-row-item',[])
      gstc.api.plugins.Selection.selectItems([])

      const allItems = state.get('config.chart.items')

      for(const item of selectedItems) {
        delete allItems[item.id];
      }

      state.update('config.chart.items', allItems)

      // Return the items that have been deleted
      return selectedItems
    }
    function getSelectedItems() {
      return state
        .get(`config.plugin.Selection.selected.chart-timeline-items-row-item`)
        .map((itemId) => globalThis.gstc.api.mergeDeep({}, globalThis.gstc.api.getItem(itemId)))
    }

    function getSelectedItemsData(selectedItems) {
      const itemsData = []
      for (const item of selectedItems) {
        itemsData.push(item.id.replace('gstcid-assignment-', ''))
      }
      return itemsData
    }
    function getSelectedAssignments () {
      return getSelectedItemsData(getSelectedItems())
    }

    return {
      gstcElement,
      updateFirstRow,
      changeTeam,
      changeFY,
      addAssignment,
      updateAssignment,
      deleteAssignments,
      getSelectedAssignments,
    }
  }
}
</script>
<style lang="scss">
.gstc-component {
  margin: 0;
  padding: 0;
}

.toolbox {
  padding: 10px;
}

.gstc__scroll-bar {
  display: none !important;
}

.gstc__list-column-row-expander-toggle {
  display: flex;

  img {
    align-self: center;
  }

  .gstc__list-column-row-expander-toggle-child {
    display: none;
  }
}

.gstc__chart-timeline-items-row-item--left-cut {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}
</style>