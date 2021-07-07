<template>
  <h1>Projects</h1>

  <div>
    <highcharts
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
  </div>

  <p>{{ $store.getters["get/getProjects"] }}</p>
</template>

<script>
export default {
  name: "projects",
  data() {
    return {
      chartOptions: {
        title: {
          text: "Gantt Chart of Projects",
        },
        xAxis: {
          min: Date.UTC(2020, 0, 0),
          max: Date.UTC(2022, 12, 30),
        },

        chart: {
          events: {
            load() {
              this.showLoading();
            },
          },
        },

        series: [
          {
            name: "Projects",
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.$store.dispatch("get/getProjects").then(() => {
      this.chartOptions.series[0].data = this.$store.getters["get/getProjects"];
      this.$refs.chart.chart.hideLoading();
    });
  },
  methods: {},
};
</script>
