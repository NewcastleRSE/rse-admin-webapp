<template>
  <div>
    <highcharts
      v-if="chartOptions.series[0].data"
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
    <progress v-else class="progress is-small is-primary" max="100"></progress>

    <ProjectModal
      v-if="showModal"
      :project="project"
      @toggleModal="toggleModal"
    />
  </div>
</template>

<script>
import ProjectModal from "./ProjectModal.vue";

export default {
  name: "ProjectGantt",
  components: { ProjectModal },
  data() {
    return {
      showModal: false,
      project: null,

      chartOptions: {
        // add categories for projects in different stages
        xAxis: {
          currentDateIndicator: true,
        },
        yAxis: {},

        chart: {
          marginLeft: 250,
          height: "50%", // chart overflows div when trying to change div height
          scrollablePlotArea: {
            minHeight: 3400, // have to make this dynamic
            opacity: 1,
          },
          events: {
            load() {
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

        series: [
          {
            name: "Project",
            point: {
              events: {
                click: (event) => {
                  this.toggleModal(event);
                },
              },
            },
            data: null,
          },
        ],
      },
    };
  },
  async created() {
    this.$store.dispatch("get/getProjects").then(() => {
      this.chartOptions.series[0].data = this.$store.getters["get/getProjects"];
    });
  },
  methods: {
    toggleModal(event) {
      if (event) {
        // passes clicked on project to modal
        this.project = event.point.options;
      }
      this.showModal = !this.showModal;
    },
  },
};
</script>
