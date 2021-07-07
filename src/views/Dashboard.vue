<template>
  <h1>Dashboard</h1>
  <div>
    <highcharts
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
  </div>
  <div class="container">
    <h2>Members</h2>
    <p>{{ $store.state.get.members }}</p>
  </div>
  <div class="container">
    <h2>Assignments</h2>
    <p>{{ $store.state.get.assignments }}</p>
  </div>
</template>

<script>
//import axios from "axios";

export default {
  name: "dashboard",
  data() {
    return {
      chartOptions: {
        title: {
          text: "Gantt Chart with Progress Indicators",
        },
        xAxis: {
          min: Date.UTC(2014, 10, 17),
          max: Date.UTC(2015, 10, 30),
        },

        plotOptions: {
          series: {
            dragDrop: {
              draggableX: true,
            },
          },
        },

        navigator: {
          enabled: true,
          liveRedraw: true,
          series: {
            type: "gantt",
            pointPlacement: 0.5,
            pointPadding: 0.25,
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: [],
          },
        },
        scrollbar: {
          enabled: true,
        },
        rangeSelector: {
          enabled: true,
          selected: 0,
        },

        series: [
          {
            name: "Project 1",
            data: [
              {
                name: "Start prototype",
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                completed: 0.25,
              },
              {
                name: "Test prototype",
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29),
              },
              {
                name: "Develop",
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                completed: {
                  amount: 0.12,
                  fill: "#fa0",
                },
              },
              {
                name: "Run acceptance tests",
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.$store.dispatch("get/getMembers", "1");
    this.$store.dispatch("get/getAssignments");
    this.$store.dispatch("get/getProjects");
  },
  methods: {},
};
</script>
