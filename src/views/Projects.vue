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
        // add categories for projects in different stages
        title: {
          text: "Gantt Chart of Projects",
        },
        xAxis: {
          min: Date.UTC(2020, 0, 0),
          max: Date.UTC(2022, 12, 30),
        },
        yAxis: {
          labels: {
            style: {
              width: "250px",
              fontSize: "12px",
              textOverflow: "none",
            },
          },
        },

        chart: {
          events: {
            load() {
              this.showLoading();
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
