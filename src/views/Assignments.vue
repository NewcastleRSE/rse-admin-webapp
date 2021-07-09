<template>
  <h1>Assignments</h1>
  
   <div>
   <highcharts
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
    </div>
</template>


<script>
//import axios from "axios";

export default {
  name: "dashboard",
  data() {
    console.log("here");
    var assignments = this.$store.state.getters.assignments
    var members = [];
    //var dictAssignments = [];
    assignments.forEach( (assign) => {
      members.push(assign.member.firstname + " " + assign.member.surname)}
    
    )
   
    return {
      chartOptions: {
        title: {
          text: "Gantt Chart with Progress Indicators",
        },

        yAxis: {
        type: 'category',
        categories: members,
        min: 0,
        max: members.length - 1
        },

        xAxis: {
          currentDateIndicator: true
        },

        plotOptions: {
          series: {
            dragDrop: {
              draggableX: true,
            },
          },
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
  },
  methods: {},
};
</script>
