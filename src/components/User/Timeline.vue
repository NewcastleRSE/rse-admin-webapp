<template>
  <div class="box">
    <highcharts
      
      class="hc"
      :options="chartOptions"
      ref="chart"

    ></highcharts>
  </div>
</template>

<script>
export default {
  name: "timeline",
  data() {
    return {

      chartOptions: {
        chart: {
          type: "timeline",
          inverted: true,
        },
        xAxis: {
          type: "datetime",
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        title: {
          text: "Timeline of Space Exploration",
        },
        subtitle: {
          text: 'Timeline of past projects',
        },
        series: [
          {
            dataLabels: {
              allowOverlap: false,
            },
            marker: {
              symbol: "circle",
            },
            data: null,
          },
        ],
      },
    };
  },
  async created() {
    this.chartOptions.series[0].data = this.getAssignments;
  },
  methods: {},
  computed: {
    getAssignments() {
      let id = this.$route.params.id
      let assignments = this.$store.getters["assignments/getAssignments"].filter(
        assignment => id == assignment.name);
      assignments.forEach( (assign) => {
        let project = this.$store.getters["get/getProjects"].filter(prj => prj.id == assign.projectId
        );
        if (project.length  > 0) {assign.name = project[0].name}
        assign.x = assign.start;
      });
      return assignments;      
    },
    
  },
  watch: {
    getAssignments(update) {
        this.chartOptions.series[0].data = update;

    },
   
  },
};
</script>