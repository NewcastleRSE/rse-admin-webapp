<template>
  <div class="gstc-wrapper" ref="gstcElement"></div>
</template>

<script>
import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as Bookmarks } from "gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js";
import { Plugin as HighlightWeekends } from 'gantt-schedule-timeline-calendar/dist/plugins/highlight-weekends.esm.min.js';
import { Plugin as CalendarScroll } from 'gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as ProgressBar } from 'gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js';

import "gantt-schedule-timeline-calendar/dist/style.css";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { DateTime } from "luxon";

let globalThis = require('globalthis')(),
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
  return false;
}

const resizingPluginConfig = {
  snapToTime: {
    start({ startTime, vido }) {
      const date = vido.api.time.findOrCreateMainDateAtTime(startTime.valueOf());
      return date.leftGlobalDate.startOf('day');
    },
    end({ endTime, vido }) {
      const date = vido.api.time.findOrCreateMainDateAtTime(endTime.valueOf());
      return date.leftGlobalDate.endOf('day');
    },
  },
  events: {
    onEnd({ items }) {
      console.log(items)
      return items.after
    },
  }
};

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
        return myItem;
      });
    },
  },
  snapToTime: {
    start({ startTime, vido }) {
      const date = vido.api.time.findOrCreateMainDateAtTime(startTime.valueOf());
      return date.leftGlobalDate.startOf('day');
    },
  },
}

function generateRows(RSEs) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  RSEs.forEach(rse => {
    if (rse.active) {
      const id = GSTC.api.GSTCID(`rse-${rse.id}`),
            assignments = GSTC.api.GSTCID(`rse-${rse.id}-assignments`)
            rows[id] = {
              id,
              label: `${rse.firstname} ${rse.lastname}`,
            };
            rows[assignments] = {
              assignments,
              parentId: id,
              classNames: ['child-row'],
              label: '<div class="m-2"></div>'
            };
    }
  })
  return rows;
}

function generateAvailability(RSEs) {
  const items = {}

  RSEs.forEach(rse => {
    if (rse.active) {
      const id = GSTC.api.GSTCID(`rse-${rse.id}`),
        rowId = GSTC.api.GSTCID(`rse-${rse.id}`),
        contractLength = DateTime.fromISO(rse.contractStart).diff(DateTime.fromISO(rse.contractEnd), ['days']).toObject(),
        capacity = DateTime.fromISO(rse.contractStart).diff(DateTime.fromISO(rse.nextAvailableDate), ['days']).toObject()

      items[id] = {
        id,
        label: rse.firstname + ' ' + rse.lastname,
        rowId,
        time: {
          start: GSTC.api.date(rse.contractStart),
          end: GSTC.api.date(rse.contractEnd),
        },
        progress: (capacity.days / contractLength.days) * 100,
        classNames: ['bg-sky-600']
      }
    }
  });

  return items;
}

function generateAssignments(assignments, projects) {

  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {}

  assignments.forEach(assignment => {

    const id = GSTC.api.GSTCID(`assignment-${assignment.assignmentID}`),
          rowId = GSTC.api.GSTCID(`rse-${assignment.rse}-assignments`)

    assignment.project = projects.find(project => project.id === assignment.project.hubspotID )

    items[id] = {
      id,
      label: assignment.name,
      rowId,
      time: {
        start: GSTC.api.date(assignment.start),
        end: GSTC.api.date(assignment.end),
      },
      progress: 100,
      classNames: ['bg-sky-500']
    }

  });

  return items;
}

// main component
export default {
  name: "Timeline",
  props: ['rses', 'projects', 'assignments'],
  emits: ['create', 'selection'],
  setup(props, { emit }) {
    let gstc, state, selectedAssignments
    const gstcElement = ref(null)
    onMounted(() => {
      const selectionOptions = {
        events: {
          onEnd(selected) {

            let cells = selected['chart-timeline-grid-row-cell'],
                items = selected["chart-timeline-items-row-item"]

            // Selection includes cells
            if (cells.length) {
              let rseID = cells[0].row.id.split('-')[2],
                  range = [
                    cells[0].time.leftGlobalDate,
                    cells[cells.length-1].time.rightGlobalDate
                  ];
              emit('create', rseID, null, range)
            }
            // Selection includes assignments
            if (items.length) {
              selectedAssignments = items
              emit('selection', true)
            }
            else {
              emit('selection', false)
            }
            return selected;
          },
        },
      }

      /**
       * @type { import("gantt-schedule-timeline-calendar").Config }
       */
      const config = {
        licenseKey:
          `${process.env.VUE_APP_GANTT_KEY}`,
        plugins: [ProgressBar(), HighlightWeekends(), TimelinePointer(), Selection(selectionOptions), ItemResizing(resizingPluginConfig), ItemMovement(movementPluginConfig), Bookmarks(), CalendarScroll()],
        innerHeight: (props.rses.length * 40) + 72,
        list: {
          columns: {
            data: {
              [GSTC.api.GSTCID("label")]: {
                id: GSTC.api.GSTCID("label"),
                width: 200,
                data: "label",
                isHTML: true,
                sortable: 'label',
                expander: true,
                header: {
                  content: "Name",
                },
              },
            },
          },
          rows: generateRows(props.rses),
        },
        chart: {
          items: {
            ...generateAssignments(props.assignments, props.projects),
            ...generateAvailability(props.rses)
          },
          time: {
            zoom: 25.5
          }
        },
      };
      state = GSTC.api.stateFromConfig(config);
      globalThis.state = state;
      gstc = GSTC({
        element: gstcElement.value,
        state,
      });
      globalThis.gstc = gstc;
      gstc.api.scrollToTime(DateTime.now().startOf('month').valueOf());
    });
    onBeforeUnmount(() => {
      if (gstc) gstc.destroy();
    });
    function updateFirstRow() {
      state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
        row.label = "Changed dynamically";
        return row;
      });
    }
    function changeZoomLevel(period) {
      let zoom = null,
        start = null
      switch (period) {
        case 'days':
          zoom = 20
          start = DateTime.now().startOf('day').minus({ days: 7 })
          break;
        case 'months':
          zoom = 25.5
          start = DateTime.now().startOf('month').minus({ months: 6 })
          break;
        case 'years':
          zoom = 26.5
          start = DateTime.now().startOf('month').minus({ months: 6 })
          break;
      }

      state.update('config.chart.time.zoom', zoom);
      const api = gstc.api;
      api.scrollToTime(start.toUTC(), false);
    }
    function addAssignment(assignment){

      // Use timestamp as temporary ID
      let newID = Date.now()

      let newItem = {
        id: GSTC.api.GSTCID(newID),
        rowId: GSTC.api.GSTCID(`rse-${assignment.rse.id}-assignments`),
        label: assignment.project.dealname,
        time: {
          start: DateTime.fromISO(assignment.startDate).startOf('day').valueOf(),
          end: DateTime.fromISO(assignment.endDate).endOf("day").valueOf(),
        },
        progress: 100,
        classNames: ['bg-sky-500']
      }

      state.update(`config.chart.items.${GSTC.api.GSTCID(newID)}`, (item) => { item = newItem; return item; } );
    }
    function deleteAssignments(){
      if(selectedAssignments) {
        selectedAssignments.forEach(assignment => {
          state.update(`config.chart.items`, (items) => { delete items[assignment.id]; return items } )
        })
        state.update("config.plugin.selection.selected.chart-timeline-items-row-item", [])
        selectedAssignments = null
      }
    }
    return {
      gstcElement,
      updateFirstRow,
      changeZoomLevel,
      addAssignment,
      deleteAssignments
    };
  }
};
</script>
<style scoped>
.gstc-component {
  margin: 0;
  padding: 0;
}

.toolbox {
  padding: 10px;
}
</style>