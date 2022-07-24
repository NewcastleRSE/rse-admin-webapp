<template>
  <div>
    <div class="toolbox">
      <button @click="updateFirstRow">Update first row</button>
      <button @click="changeZoomLevel">Change zoom level</button>
    </div>
    <div class="gstc-wrapper" ref="gstcElement"></div>
  </div>
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

import "gantt-schedule-timeline-calendar/dist/style.css";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useStore } from 'vuex';

var globalThis = require('globalthis')();

function generateRows(RSEs) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  RSEs.forEach(rse => {
    const id = GSTC.api.GSTCID(rse.id),
          assignments = GSTC.api.GSTCID(rse.id + '-assignments')
    rows[id] = {
      id,
      label: rse.name,
    };
    rows[assignments] = {
      assignments,
      label: '',
      parentId: id,
    };
  })
  return rows;
}
function generateAssignments(assignments) {

  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {};
  assignments.forEach(assignment => {
    const id = GSTC.api.GSTCID(assignment.assignmentID),
          rowId = GSTC.api.GSTCID(assignment.rse.id + '-assignments')
 
    items[id] = {
      id,
      label: assignment.project.name,
      rowId,
      time: {
        start: GSTC.api.date(assignment.start),
        end: GSTC.api.date(assignment.end),
      },
    }

  });

  return items;
}
// main component
export default {
  name: "Timeline",
  setup() {
    let gstc, state;
    const gstcElement = ref(null);
    onMounted(() => {

      const store = useStore()

      /**
       * @type { import("gantt-schedule-timeline-calendar").Config }
       */
      const config = {
        licenseKey:
          `${process.env.VUE_APP_GANTT_KEY}`,
        plugins: [HighlightWeekends(), TimelinePointer(), Selection(), ItemResizing(), ItemMovement(), Bookmarks(), CalendarScroll()],
        list: {
          columns: {
            data: {
              [GSTC.api.GSTCID("label")]: {
                id: GSTC.api.GSTCID("label"),
                width: 200,
                data: "label",
                sortable: 'label',
                expander: true,
                header: {
                  content: "Name",
                },
              },
            },
          },
          rows: generateRows(store.getters["rses/getRses"]),
        },
        chart: {
          items: generateAssignments(store.getters["assignments/getAssignments"]),
          // time: {
          //   from: GSTC.api.date("2020-01-01").valueOf(), // from 2020-01-01
          //   to: GSTC.api.date("2020-06-01").endOf("month").valueOf(), // to 2020-06-31
          //   calculatedZoomMode: true,
          // }
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
    function changeZoomLevel() {
      state.update("config.chart.time.zoom", 23);
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