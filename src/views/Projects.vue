<template>
  <div>
    <highcharts
      v-if="chartOptions.series[0].data"
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
    <h1 v-else>loading icon to be added</h1>
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
          text: "Projects",
        },
        xAxis: {
          //   min: Date.UTC(2021, 0, 0),
          //   max: Date.UTC(2022, 0, 0),
          currentDateIndicator: true,
        },
        yAxis: {
          scrollbar: {
            //enabled: true,
          },
          tickLength: 0,
          //max: 8,
        },

        chart: {
          marginLeft: 250,
          height: 500,
          scrollablePlotArea: {
            minHeight: 3400, // have to make this dynamic
            opacity: 1,
          },
          events: {
            load() {
              //this.showLoading();
              this.xAxis[0].setExtremes(
                Date.UTC(
                  new Date().getFullYear(),
                  new Date().getMonth() - 3,
                  new Date().getDate()
                ),
                Date.UTC(
                  new Date().getFullYear(),
                  new Date().getMonth() + 3,
                  new Date().getDate()
                )
              );
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
            max: 30,
            reversed: true,
            categories: [],
          },
        },
        // scrollbar: {
        //   enabled: true,
        // },
        rangeSelector: {
          //enabled: true,
          //   y: -30,
          //   floating: true,
          selected: 1,
        },

        series: [
          {
            name: "Project",
            data: null,
          },
        ],
      },
    };
  },
  async created() {
    // dual date is broken when data is added after a delay
    this.$store.dispatch("get/getProjects").then(() => {
      //console.log(this.$store.getters["get/getProjects"][0]);
      this.chartOptions.series[0].data = this.$store.getters["get/getProjects"];
      //this.$refs.chart.chart.hideLoading();
    });
  },
  methods: {},
};
</script>
