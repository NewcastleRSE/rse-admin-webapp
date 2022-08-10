<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
            Utilisation
          </h6>
          <h2 class="text-white text-xl font-semibold">
            Overview
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
<script>
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'

Chart.register(annotationPlugin)

export default {
  mounted: function () {
    this.$nextTick(function () {
      var utilisationData = this.$store.getters["capacity/getUtilisation"],
          labels = utilisationData.reduce(function (dates, month) {
            let date = DateTime.fromISO(month.date)
            return [...dates, date.toFormat('LLL yy')]
          }, [])
      var config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Target',
              backgroundColor: "#38bdf8",
              borderColor: "#38bdf8",
              data: utilisationData.reduce(function (targets, month) { return [...targets, month.targetDays] }, []),
              fill: false,
              stepped: 'middle',
            },
            {
              label: 'Capacity',
              backgroundColor: "#0284c7",
              borderColor: "#0284c7",
              data: utilisationData.reduce(function (capacity, month) { return [...capacity, month.capacityDays] }, []),
              fill: false,
              stepped: 'middle',
            },
            {
              label: 'Actual',
              backgroundColor: "#f472b6",
              borderColor: "#f472b6",
              data: utilisationData.reduce(function (actual, month) { return [...actual, month.actualDays] }, []),
              fill: false,
              stepped: 'middle',
            }
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Utilisation",
            fontColor: "white",
          },
          plugins: {
            legend: {
              labels: {
                color: "#cbd5e1",
              },
              align: "end",
              position: "bottom"
            },
            annotation: {
              annotations: {
                today: {
                  type: 'line',
                  xMin: DateTime.utc().toFormat('LLL yy'),
                  xMax: DateTime.utc().toFormat('LLL yy'),
                  borderColor: '#cbd5e1',
                  borderWidth: 1,
                  label: {
                    content: 'Today',
                    display: true,
                    position: 'end',
                    yAdjust: -6
                  }
                }
              }
            }
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
                  text: 'Month',
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
      };
      var ctx = document.getElementById("line-chart").getContext("2d")
      window.myLine = new Chart(ctx, config)
    });
  },
};
</script>
