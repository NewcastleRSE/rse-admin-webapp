<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-white border-0 mt-16">
    <div class="relative flex flex-col min-w-0 h-350-px break-words m-6 lg:-mt-16 shadow-lg rounded-lg bg-blueGray-700">
        <canvas id="availability-chart"></canvas>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0 mb-6">
      <ol class="relative border-l border-gray-200 dark:border-gray-700 ">
        <li class="mb-10 ml-6">
          <span
            class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg aria-hidden="true" class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{{rse.firstname}} {{rse.lastname}}
            <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">Latest</span>
          </h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on January
            13th, 2022</time>
          <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including
            a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &amp; Marketing pages.</p>
          <a href="#"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg
              class="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clip-rule="evenodd"></path>
            </svg> Download ZIP</a>
        </li>
        <li class="mb-10 ml-6">
          <span
            class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg aria-hidden="true" class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Flowbite Figma v1.3.0</h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on
            December 7th, 2021</time>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first
            designed in Figma and we keep a parity between the two versions even as we update the project.</p>
        </li>
        <li class="ml-6">
          <span
            class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg aria-hidden="true" class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Flowbite Library v1.2.2</h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on
            December 2nd, 2021</time>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components
            and interactive elements built on top of Tailwind CSS.</p>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'
import { DateTime } from 'luxon'

Chart.register(annotationPlugin)
export default {
  data() {

    const RSE = this.$store.getters["rses/getRse"](this.$route.params.name),
          startDate = DateTime.fromISO(RSE.contractStart).startOf('month'),
          endDate = DateTime.local().startOf('month').plus({month: 24}),
          assignments = this.$store.getters["assignments/getAssignmentsInPeriod"](startDate.toISODate(), endDate.toISODate(), RSE.id),
          projects = this.$store.getters["projects/getProjects"](assignments.reduce(function (ids, assignment) { return [...ids, assignment.project.hubspotID] }, []))

    assignments.forEach(assignment => {
      assignment.project = projects.find(project => project.id == assignment.project.hubspotID)
    })

    return {
      rse: RSE, 
      assignments: assignments
    }
  },
    mounted: function () {
    this.$nextTick(function () {

      let startDate = DateTime.fromISO(this.rse.contractStart).startOf('month'),
          endDate = DateTime.local().startOf('month').plus({month: 24}),
          labels = [],
          directlyAllocated = [],
          facility = []

      while(startDate < endDate) {
        labels = [...labels, startDate.toFormat('LLL yy')]

        let assignments = this.assignments.filter(assignment => {
          return DateTime.fromISO(assignment.start) <= startDate &&
                 DateTime.fromISO(assignment.end) >= startDate
        })
        
        let facilityFTE = 0,
            directlyAllocatedFTE = 0

        if(assignments.length > 0) {
          assignments.forEach(assignment => {
            if(assignment.project.costModel === 'Facility') {
              facilityFTE += assignment.fte
            }
            else {
              directlyAllocatedFTE += assignment.fte
            }
          })
        }

        facility.push(facilityFTE)
        directlyAllocated.push(directlyAllocatedFTE)

        startDate = startDate.plus({month: 1})
      }

      let config = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Directly Allocated',
              backgroundColor: "#38bdf8",
              borderColor: "#38bdf8",
              data: directlyAllocated,
              fill: false,
              stepped: 'middle',
            },
            {
              label: 'Facility',
              backgroundColor: "#f472b6",
              borderColor: "#f472b6",
              data: facility,
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
                stacked: true,
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
      };
      var ctx = document.getElementById("availability-chart").getContext("2d")
      window.myLine = new Chart(ctx, config)
    });
  },
}
</script>