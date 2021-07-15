<template>
  <div class="box">
    <highcharts
      v-if="chartOptions.series[0].data.length > 0"
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
    <progress v-else class="progress is-small is-primary" max="100"></progress>

    <ProjectModal
      v-if="showModal"
      :project="projectForModal"
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
      projectForModal: null,

      chartOptions: {
        title: {
          text: "Projects",
          floating: true,
          align: "left",
        },
        xAxis: [
          {
            currentDateIndicator: true,
            plotLines: [
              {
                label: "testline",
                value: Date.UTC(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + 7
                ),
                dashStyle: "ShortDash",
              },
            ],
          },
          {},
        ],
        yAxis: {},

        tooltip: {
          followPointer: true,
          formatter: function() {
            var start = new Date(this.point.start);
            var end = new Date(this.point.end);
            return (
              "<b>" +
              this.point.name +
              "</b>" +
              "<br/>Stage: " +
              this.point.stage +
              "<br/>Amount: £" +
              this.point.amount +
              "<br/>" +
              "<br/>Start: " +
              start.toDateString() +
              "<br/>End: " +
              end.toDateString()
            );
          },
        },

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
          yAxis: {
            min: 0,
            max: 30,
          },
        },
        scrollbar: {
          enabled: true,
          trackBackgroundColor: "rgba(230, 230, 230, 0.2)",
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
            data: [],
          },
        ],
      },
    };
  },
  async created() {
    // loads data to chart if its ready before loading this component,
    // 'watch' wont load the data if it isnt updated while component is loaded
    this.chartOptions.series[0].data = this.getProjects;
  },
  methods: {
    toggleModal(event) {
      if (event) {
        // passes clicked on project to modal
        this.projectForModal = event.point.options;
      }
      this.showModal = !this.showModal;
    },
  },
  computed: {
    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"]; // even when projects is identical to get, dont work
    },
  },
  watch: {
    getProjects(update) {
      // watches 'getProjects()' to update data in chart
      this.chartOptions.series[0].data = update;
    },
  },
};
</script>
