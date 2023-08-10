<template>
  <div @scroll.prevent class="gstc-wrapper" ref="gstcElement"></div>
</template>

<script>
import GSTC from 'gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js'
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js'
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js'
import { Plugin as ItemResizing } from 'gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js'
import { Plugin as ItemMovement } from 'gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js'
import { Plugin as Bookmarks } from 'gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js'
import { Plugin as HighlightWeekends } from 'gantt-schedule-timeline-calendar/dist/plugins/highlight-weekends.esm.min.js'
import { Plugin as CalendarScroll } from 'gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js'
import { Plugin as ProgressBar } from 'gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js'

import 'gantt-schedule-timeline-calendar/dist/style.css'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { DateTime } from 'luxon'
import { useAssignmentsStore } from '../../stores'

const globalthis = require('globalthis')

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
    const id = GSTC.api.GSTCID(`rse-${rse.id}`),
          assignments = GSTC.api.GSTCID(`rse-${rse.id}-assignments`)
          rows[id] = {
            id,
            label: `<img src="/src/assets/img/avatars/${rse.photo}" class="h-6 float-left rounded-full mr-2" style="margin-top: 8px" />${rse.firstname} ${rse.lastname}`,
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

function generateAvailability(RSEs) {
  const items = {}

  RSEs.forEach(rse => {
      let assignmentEndDates = rse.assignments.reduce(function (dates, assignment) { return [...dates, assignment.end] }, [])
      const maxDate = new Date(Math.max(...assignmentEndDates.map(date => { return new Date(date) })))

      const id = GSTC.api.GSTCID(`rse-${rse.id}`),
        rowId = GSTC.api.GSTCID(`rse-${rse.id}`),
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

function generateAssignments(rses) {

  /**
   * @type { import('gantt-schedule-timeline-calendar').Items }
   */
  const items = {}

  rses.forEach(rse => {
    rse.assignments.forEach(assignment => {

      const id = GSTC.api.GSTCID(`assignment-${assignment.id}`),
            rowId = GSTC.api.GSTCID(`rse-${rse.id}-assignments`)

      const assignmentStart = DateTime.fromISO(assignment.start),
            assignmentEnd = DateTime.fromISO(assignment.end)

      items[id] = {
        id,
        label: assignment.project.data.name,
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
  props: ['rses', 'projects'],
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
              let rseID = cells[0].row.id.split('-')[2],
                  range = [
                    cells[0].time.leftGlobalDate,
                    cells[cells.length-1].time.rightGlobalDate
                  ]
              emit('create', rseID, null, range)
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
            items.after.forEach(assignment => {
              const assignmentID = Number(assignment.id.split('-')[2]),
                    rseID = Number(assignment.rowId.split('-')[2])
              emit('resize', assignmentID, rseID, assignment.time.start, assignment.time.end)
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
            items.after.forEach(assignment => {
              const assignmentID = Number(assignment.id.split('-')[2]),
                    rseID = Number(assignment.rowId.split('-')[2])
              emit('resize', assignmentID, rseID, assignment.time.start, assignment.time.end)
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
          let assignmentID = data.item.id.split('-')[2]
          emit('edit', assignmentID)
          gstc.api.plugins.Selection.selectItems([])
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

      /**
       * @type { import('gantt-schedule-timeline-calendar').Config }
       */
      const config = {
        licenseKey:
          `${import.meta.env.VITE_GANTT_KEY}`,
        plugins: [ProgressBar(), HighlightWeekends(), TimelinePointer(), Selection(selectionOptions), ItemResizing(resizingPluginConfig), ItemMovement(movementPluginConfig), Bookmarks(), CalendarScroll()],
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
            ...generateAssignments(props.rses),
            ...generateAvailability(props.rses)
          },
          time: {
            zoom: 25.5
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
        // console.log(mutation)
        // New assignment
        if(mutation.events.type === 'add') {
          addAssignment(mutation.events.newValue)
        }
        // Deleted assignment
        else if(mutation.events.type === 'set' && mutation.events.key === 'length' && mutation.events.newValue < mutation.events.oldValue) {
          deleteAssignments(mutation.events.newValue)
        }
        // Edited Assignment
        else {
          console.log(mutation.events)
        }
      })

      nextTick(()=>{
        document.querySelectorAll('.gstc__chart-timeline').forEach(timeline => {
          timeline.addEventListener('wheel', (event) => {
            event.preventDefault()
          }, false)
        })
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
    function changeZoomLevel(period) {
      let zoom = null,
          start = null
      switch (period) {
        case 'days':
          zoom = 20
          start = DateTime.now().startOf('day').minus({ days: 7 })
          break
        case 'months':
          zoom = 25.5
          start = DateTime.now().startOf('month').minus({ months: 6 })
          break
        case 'years':
          zoom = 26.5
          start = DateTime.now().startOf('month').minus({ months: 6 })
          break
      }

      state.update('config.chart.time.zoom', zoom)
      const api = gstc.api
      api.scrollToTime(start.toUTC(), false)
    }
    function addAssignment(assignment){
      let newItem = {
        id: GSTC.api.GSTCID(assignment.id),
        rowId: GSTC.api.GSTCID(`rse-${assignment.rse}-assignments`),
        label: assignment.project.data.name,
        time: {
          start: DateTime.fromISO(assignment.start).startOf('day').valueOf(),
          end: DateTime.fromISO(assignment.end).endOf('day').valueOf(),
        },
        progress: 100,
        classNames: ['bg-cyan-500', 'rounded']
      }
      gstc.api.plugins.Selection.selectItems([])
      state.update(`config.chart.items.${GSTC.api.GSTCID(assignment.id)}`, (item) => { item = newItem; return item } )
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
      changeZoomLevel,
      addAssignment,
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