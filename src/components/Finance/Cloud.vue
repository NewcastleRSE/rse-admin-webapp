<template>
    <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white">
      <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full max-w-full flex-grow flex-1">
            <h6 class="uppercase text-blueGray-900 mb-1 text-xs font-semibold">
              Monthly
            </h6>
            <h2 class="text-blueGray-900 text-xl font-semibold">
              Cloud Spend
            </h2>
          </div>
        </div>
      </div>
      <div class="p-4 flex-auto">
        <!-- Chart -->
        <div class="relative h-350-px">
          <canvas id="cloud-spend"></canvas>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { onMounted, defineOptions, defineProps } from 'vue'
  import Chart from 'chart.js/auto'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import { currentFY } from '../../utils/dates'
  
  defineOptions({
    name: 'capacity'
  })

  const props = defineProps(['data'])

  const dates = currentFY()
  
  Chart.register(annotationPlugin)
  
  onMounted(async () => {

    let labels = [],
        azure = new Array(12).fill(0),
        aws = new Array(12).fill(0),
        google = new Array(12).fill(0)

    let month = dates.startDate

    for(let i=0; i < 12; i++) {
        month = dates.startDate.plus({months: i})
        labels.push(month.toFormat('LLL'))
    }

    props.data.forEach(transaction => {
        if(transaction.name.toLowerCase().includes('azure')) {
            azure[transaction.fiscalPeriod - 1] += (transaction.value * -1)
        }
        else if(transaction.name.toLowerCase().includes('google')) {
            google[transaction.fiscalPeriod - 1] += (transaction.value * -1)
        }
        else {
            console.log(transaction)
        }
    })
  
    let config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Azure',
            backgroundColor: "#0175BC",
            borderColor: "#0175BC",
            data: azure,
          },
          {
            label: 'AWS',
            backgroundColor: "#0284c7",
            borderColor: "#0284c7",
            data: aws,
          },
          {
            label: 'Google',
            backgroundColor: "#DB4437",
            borderColor: "#DB4437",
            data: google,
          }
        ],
      },
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
                text: 'Month',
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
              text: 'Spend',
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
    var ctx = document.getElementById("cloud-spend").getContext("2d")
    window.myLine = new Chart(ctx, config)
  })
  </script>
  