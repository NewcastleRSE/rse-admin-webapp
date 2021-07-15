<template>
  <div class="columns">
    <div class="box column is-four-fifths">
      <highcharts
        v-if="chartOptions.series[0].data.length > 0"
        :constructorType="'ganttChart'"
        class="hc"
        :options="chartOptions"
        ref="chart"
      ></highcharts>
      <progress
        v-else
        class="progress is-small is-primary"
        max="100"
      ></progress>
    </div>
    <div class="column ">
      <ProjectsCard @toggleModal="toggleModal" />
    </div>
  </div>
  <Modal
    v-if="showModal"
    :project="projectForModal"
    @toggleModal="toggleModal"
  />
</template>

<script>
import ProjectsCard from "./ProjectsCard.vue";
import Modal from "./AssignmentsFormModal.vue";

export default {
  name: "AssignmentGantt",
  components: { ProjectsCard, Modal },
  data() {
    return {
      showModal: false,
      projectForModal: null,

      chartOptions: {
        title: {
          text: "Assignments",
          floating: true,
          align: "left",
        },

        xAxis: {
          currentDateIndicator: true,
        },
        yAxis: {},

        plotOptions: {
          series: {
            animation: false, // Do not animate dependency connectors
            dragDrop: {
              draggableX: true,
              draggableY: true,
            },
            dataLabels: {
              enabled: true,
              format: "{point.project}",
              style: {
                cursor: "default",
                pointerEvents: "none",
              },
            },
            allowPointSelect: true,
          },
        },

        navigator: {
          enabled: true,
          liveRedraw: true,
          adaptToUpdatedData: false,
          yAxis: {
            min: 0,
            max: 10,
          },
        },
        scrollbar: {
          enabled: true,
          trackBackgroundColor: "rgba(230, 230, 230, 0.2)",
        },
        // rangeSelector: {
        //   enabled: true,
        //   selected: 0,
        // },

        series: [
          {
            name: "Assignment",
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.chartOptions.series[0].data = this.getAssignments;
  },

  methods: {
    toggleModal(project) {
      if (project) {
        this.projectForModal = project;
      }
      this.showModal = !this.showModal;
    },

    addAssignment(assignment) {
      this.chartOptions.series[0].data.push(assignment);
      // need to add createAssignment call to DB
    },
  },

  computed: {
    getAssignments() {
      // gets updated value from store
      return this.$store.getters["assignments/getAssignments"];
    },
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.chartOptions.series[0].data = update;
    },
  },
};
</script>

<style scoped></style>
