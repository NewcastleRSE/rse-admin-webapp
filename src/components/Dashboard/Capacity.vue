<template>
  <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-blueGray-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
            Monthly
          </h6>
          <h2 class="text-white text-xl font-semibold">
            Utilisation
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
  </div>
</template>
<script setup>
import { onMounted, defineOptions } from 'vue'
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'
import { currentFY } from '../../utils/dates'
import { fetchObject } from '../../utils/orm'
defineOptions({
  name: 'capacity'
})

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

  const dates = currentFY()

  let startDate = dates.startDate,
      endDate = dates.endDate

  const summary = await fetchObject('timesheets', 'summary', null, { year: { '$eq': startDate.year } })

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
          type: 'line',
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
          type: 'line',
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
          type: 'line',
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
          type: 'line',
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
          type: 'line',
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
