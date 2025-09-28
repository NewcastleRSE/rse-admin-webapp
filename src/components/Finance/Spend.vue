<template>
    <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white">
      <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full max-w-full flex-grow flex-1">
            <h6 class="uppercase text-slate-900 mb-1 text-xs font-semibold">
              Monthly Spend
            </h6>
            <h2 class="text-slate-900 text-xl font-semibold">
              {{ props.title }}
            </h2>
          </div>
        </div>
      </div>
      <div class="p-4 flex-auto">
        <!-- Chart -->
        <div class="relative h-350-px">
          <canvas :id="props.id"></canvas>
        </div>
      </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'

defineOptions({
  name: 'capacity'
})

const props = defineProps(['data', 'id', 'title', 'yTitle', 'xTitle'])
  
Chart.register(annotationPlugin)

onMounted(async () => {
    let config = {
      type: "bar",
      data: props.data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Cloud Spend",
          fontColor: "#090909",
        },
        plugins: {
          legend: {
            labels: {
              color: "#090909",
            },
            align: "end",
            position: "bottom"
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
              stacked: true,
              ticks: {
                color: "#090909",
              },
              display: true,
              title: {
                text: props.xTitle,
                display: false,
                color:"#090909"
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
              color: "#090909",
            },
            display: true,
            title: {
              text: props.yTitle,
              display: true,
              color:"#090909"
            },
            gridLines: {
              borderDash: [3],
              borderDashOffset: [3],
              drawBorder: false,
              color: "rgba(255, 255, 255, 0.8)",
              zeroLineColor: "rgba(33, 37, 41, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        },
      },
    }
    var ctx = document.getElementById(props.id).getContext('2d')
    window.myLine = new Chart(ctx, config)
  })
  </script>
  