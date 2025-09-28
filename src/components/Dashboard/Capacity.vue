<template>
  <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-slate-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-100 mb-1 text-xs font-semibold">
            Capacity
          </h6>
          <h2 class="text-white text-xl font-semibold">
            Distribution
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative h-350-px">
        <canvas id="line-chart"></canvas>
      </div>
    </div>
    <div v-if="isLoading" class=" absolute inset-0">
      <div class="flex items-center justify-center h-full">
        <svg class="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-slate-100">Loading…</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, defineOptions, ref } from 'vue'
import { useUserStore } from '../../stores'
import { storeToRefs } from 'pinia'
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'
import { fetchObject } from '../../utils/orm'
defineOptions({
  name: 'capacity'
})

const userStore = useUserStore()
const { settings } = storeToRefs(userStore)
const isLoading = ref(false)

Chart.register(annotationPlugin)

function groupBy(data, keyFn) {
    let m = new Map();

    for (let x of data) {
        let k = keyFn(x);
        if (!m.has(k))
            m.set(k, []);
        m.get(k).push(x);
    }

    return m;
}

onMounted(async () => {
  let startDate = DateTime.fromFormat(`${settings.value.financialYear}-08-01`, 'yyyy-MM-dd').startOf('day'),
      endDate = startDate.plus({ years: 1 }).minus({ days: 1 }).endOf('day')

  isLoading.value = true
  const summary = await fetchObject('timesheets', 'summary', null, { year: { '$eq': settings.value.financialYear } })
  isLoading.value = false

  let date = startDate,
      dateLabels = [],
      targetDays = summary.data.days.capacity.map(function(c) { return c ? c * 0.85 : null })

  while (date <= endDate) {
    dateLabels.push(date.toISODate())
    date = date.plus({ days: 1 })
  }

  let config = {
    data: {
      labels: dateLabels,
      datasets: [
        {
          label: 'Capacity',
          backgroundColor: "#0284c7",
          borderColor: "#0284c7",
          borderWidth: 1.5,
          data: summary.data.days.capacity,
          fill: false,
          stepped: 'middle',
          pointRadius: 0,
          type: 'line',
          stack: 'capacity'
        },
        {
          label: 'Target',
          backgroundColor: "#38bdf8",
          borderColor: "#38bdf8",
          borderWidth: 1.5,
          data: targetDays,
          fill: false,
          stepped: 'middle',
          pointRadius: 0,
          type: 'line',
          spanGaps: true,
          stack: 'target'
        },
        {
          label: 'Assigned',
          backgroundColor: "#f472b6",
          borderColor: "#f472b6",
          borderWidth: 1.5,
          data: summary.data.days.assigned,
          fill: false,
          stepped: 'middle',
          pointRadius: 0,
          type: 'line',
          spanGaps: true,
          stack: 'assigned'
        },
        {
          label: 'Billable',
          backgroundColor: "rgba(8,145,178,1)",
          borderColor: "rgba(8,145,178,0)",
          data: summary.data.days.billable,
          stepped: 'middle',
          pointRadius: 0,
          order: 4,
          type: 'bar',
          fill: true,
          stack: 'data'
        },
        {
          label: 'Non-Billable',
          backgroundColor: "rgba(250,204,21,1)",
          borderColor: "rgba(250,204,21,0)",
          data: summary.data.days.nonBillable,
          stepped: 'middle',
          pointRadius: 0,
          order: 3,
          type: 'bar',
          fill: true,
          stack: 'data'
        },
        {
          label: 'Volunteering',
          backgroundColor: "rgba(192,132,252,1)",
          borderColor: "rgba(192,132,252,0)",
          data: summary.data.days.volunteered,
          stepped: 'middle',
          pointRadius: 0,
          order: 2,
          type: 'bar',
          fill: true,
          stack: 'data'
        },
        {
          label: 'Leave',
          backgroundColor: "rgba(52,211,153,1)",
          borderColor: "rgba(52,211,153,0)",
          data: summary.data.days.leave,
          stepped: 'middle',
          pointRadius: 0,
          order: 0,
          spanGaps: true,
          type: 'bar',
          fill: true,
          stack: 'data'
        },
        {
          label: 'Sickness',
          backgroundColor: "rgba(244,63,94,1)",
          borderColor: "rgba(244,63,94,0)",
          data: summary.data.days.sickness,
          stepped: 'middle',
          pointRadius: 0,
          order: 1,
          type: 'bar',
          fill: true,
          stack: 'data'
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      spanGaps: true,
      title: {
        display: false,
        text: "Utilisation",
        fontColor: "white",
      },
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1",
            filter: function(legendItem, data) {
              let label = data.datasets[legendItem.datasetIndex].label || '';
              if (typeof(label) !== 'undefined') {
                if (legendItem.datasetIndex < 3){
                  return false;
                }
              }
              return label;
            }
          },
          align: "end",
          position: "bottom"
        },
        // annotation: {
        //   annotations: {
        //     today: {
        //       type: 'line',
        //       xMin: DateTime.utc().toFormat('LLL yy'),
        //       xMax: DateTime.utc().toFormat('LLL yy'),
        //       borderColor: '#cbd5e1',
        //       borderWidth: 1,
        //       label: {
        //         content: 'Today',
        //         display: true,
        //         position: 'end',
        //         yAdjust: -6
        //       }
        //     }
        //   }
        // }
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        x: {
            ticks: {
              color: "#cbd5e1",
            },
            display: true,
            title: {
              text: 'Day',
              display: false,
              color:"#cbd5e1"
            },
            gridLines: {
              display: false,
              borderDash: [2],
              borderDashOffset: [2],
              color: "#f1f5f9",
              zeroLineColor: "rgba(0, 0, 0, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
        },
        y: {
          stacked: true,
          min: 0,
          ticks: {
            color: "#cbd5e1",
          },
          display: true,
          title: {
            text: 'Days',
            display: true,
            color:"#cbd5e1"
          },
          gridLines: {
            borderDash: [3],
            borderDashOffset: [3],
            drawBorder: false,
            color: "rgba(255, 255, 255, 0.15)",
            zeroLineColor: "rgba(33, 37, 41, 0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
          },
        },
      },
    },
  }
  var ctx = document.getElementById("line-chart").getContext("2d")
  window.myLine = new Chart(ctx, config)
})
</script>
