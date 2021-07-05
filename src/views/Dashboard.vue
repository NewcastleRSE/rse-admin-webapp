<template>
  <h1>Dashboard</h1>
  <button @click="showLength">Length</button>
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
    <p>{{ $store.state.getters.members }}</p>
  </div>
  <div class="container">
    <h2>Assignments</h2>
    <p>{{ $store.state.getters.assignments }}</p>
  </div>
  <div class="container">
    <h2>Project</h2>
    <p>{{ $store.state.getters.project }}</p>
  </div>
  <div class="container">
    <h2>Projects</h2>
    <p>{{ $store.state.getters.projects }}</p>
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
          max: Date.UTC(2014, 10, 30),
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
    this.$store.dispatch("getters/getMembers", "1");
    this.$store.dispatch("getters/getAssignments");
    // array passed to getProjects must be max len 3
    this.$store.dispatch("getters/getProjects");
    this.$store.dispatch("getters/getProject", "503089324");
  },
  methods: {
    showLength() {
      console.log(this.$store.state.getters.projects.length);
    },
  },
};
</script>
