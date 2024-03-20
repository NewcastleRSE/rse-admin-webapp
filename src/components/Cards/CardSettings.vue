<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-white border-0 mt-16">
    <div class="relative flex flex-col min-w-0 h-350-px break-words p-4 m-6 lg:-mt-16 shadow-lg rounded-lg bg-blueGray-700">
        <canvas id="availability-chart"></canvas>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0 mb-6">
      <ol class="relative border-l border-gray-200 dark:border-gray-700 ">
        <li class="mb-10 ml-8" v-for="assignment in assignments" v-bind:key="assignment.id">
          <span v-if="assignment.project.faculty === 'Science, Agriculture & Engineering'" class="flex absolute -left-4 justify-center items-center w-8 h-8 bg-cyan-700 rounded-full ring-cyan-200 ">
            <i class="fa-solid fa-atom text-white"></i>
          </span>
          <span v-else-if="assignment.project.faculty === 'Humanities & Social Sciences'" class="flex absolute -left-4 justify-center items-center w-8 h-8 bg-lime-700 rounded-full ring-lime-200">
            <i class="fa-solid fa-people-group text-white"></i>
          </span>
          <span v-else-if="assignment.project.faculty === 'Medical Sciences'" class="flex absolute -left-4 justify-center items-center w-8 h-8 bg-rose-700 rounded-full ring-rose-200">
            <i class="fa-solid fa-heart-pulse text-white"></i>
          </span>
          <span v-else>
            <i class="fa-solid fa-code text-white"></i>
          </span>
          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{{assignment.project.name}}
            <span v-if="assignment.project.status === 'Red'" class="bg-red-200 text-red-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Red</span>
            <span v-else-if="assignment.project.status === 'Amber'" class="bg-amber-200 text-amber-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Red</span>
          </h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-500">{{formatDate(assignment.start)}} to {{formatDate(assignment.end)}}</time>
          <p class="mb-1 text-base font-normal text-gray-700">
            <i class="fa-solid fa-user pr-2"></i>{{assignment.project.contacts[0].firstname}} {{assignment.project.contacts[0].lastname}}
          </p>
          <p class="mb-4 text-base font-normal text-gray-700">
            <i class="fa-solid fa-building pr-2"></i>{{assignment.project.school}}, {{assignment.project.faculty}}
          </p>
          <!-- <a href="#"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg
              class="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clip-rule="evenodd"></path>
            </svg> Download ZIP</a> -->
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import Chart from 'chart.js/auto'
import { DateTime } from 'luxon'

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

    console.log(assignments)

    return {
      rse: RSE, 
      assignments: assignments
    }
  },
  methods: {
        formatDate(date) {
          return DateTime.fromISO(date).toFormat('LLLL yyyy')
        }
    },
  mounted: function () {
    this.$nextTick(function () {

      let startDate = DateTime.fromISO(this.rse.contractStart).startOf('month'),
          endDate = DateTime.local().startOf('month').plus({month: 12}),
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
              backgroundColor: "#7dd3fc",
              borderColor: "#7dd3fc",
              data: directlyAllocated,
            },
            {
              label: 'Facility',
              backgroundColor: "#3b82f6",
              borderColor: "#3b82f6",
              data: facility,
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
                  text: 'FTE',
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
    })
  }
}
</script>