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

var globalThis = require('globalthis')();

function generateRows(RSEs) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  RSEs.forEach(rse => {
    if (rse.active) {
      const id = GSTC.api.GSTCID(rse.id),
        assignments = GSTC.api.GSTCID(rse.id + '-assignments')
      rows[id] = {
        id,
        label: `${rse.firstname} ${rse.lastname}`,
      };
      rows[assignments] = {
        assignments,
        parentId: id,
        classNames: ['child-row'],
        label: '<div class="m-2">Assignment summary goes here.</div>'
      };
    }
  })
  return rows;
}

function generateAvailability(RSEs) {

  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {}

  RSEs.forEach(rse => {
    if (rse.active) {
      const id = GSTC.api.GSTCID(rse.id),
        rowId = GSTC.api.GSTCID(rse.id),
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

    const id = GSTC.api.GSTCID(assignment.assignmentID),
          rowId = GSTC.api.GSTCID(assignment.rse + '-assignments')

    let classNames

    assignment.project = projects.find(project => project.id === assignment.project.hubspotID )

    switch(assignment.project.faculty) {
      case 'Science, Agriculture & Engineering':
        classNames = ['bg-green-600']
        break
      case 'Humanities & Social Sciences':
        classNames = ['bg-amber-400']
        break
      case 'Medical Sciences':
        classNames = ['bg-purple-400']
        break
      default:
        break
    }

    items[id] = {
      id,
      label: assignment.project.dealname,
      rowId,
      time: {
        start: GSTC.api.date(assignment.start),
        end: GSTC.api.date(assignment.end),
      },
      classNames: classNames
    }

  });

  return items;
}

// main component
export default {
  name: "Timeline",
  props: ['rses', 'projects', 'assignments'],
  setup(props) {
    let gstc, state;
    const gstcElement = ref(null);
    onMounted(() => {
      /**
       * @type { import("gantt-schedule-timeline-calendar").Config }
       */
      const config = {
        licenseKey:
          `${process.env.VUE_APP_GANTT_KEY}`,
        plugins: [ProgressBar(), HighlightWeekends(), TimelinePointer(), Selection(), ItemResizing(), ItemMovement(), Bookmarks(), CalendarScroll()],
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
            ...generateAvailability(props.rses) },
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
    return {
      gstcElement,
      updateFirstRow,
      changeZoomLevel,
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