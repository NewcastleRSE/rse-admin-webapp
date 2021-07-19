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
      <button @click="deleteAssignments" class="button is-primary">
        Delete Selected
      </button>
      <button @click="save" class="button is-primary">
        Save
      </button>
    </div>
    <div class="column ">
      <ProjectsCard @toggle-modal="toggleModal" />
    </div>
  </div>
  <Modal
    v-if="showModal"
    :project="projectForModal"
    @toggleModal="toggleModal"
    @add-assignment="addAssignment"
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
      edited: false,
      savedAssignments: [],
      members: [],
      data: [],
    };
  },
  created() {
    this.data = this.getAssignments;
    this.members = this.getMembers;
    this.savedAssignments = this.getAssignments;
  },

  methods: {
    toggleModal(project) {
      console.log("i am here");
      if (project) {
        this.projectForModal = project;
      }
      this.showModal = !this.showModal;
    },

    addAssignment(assignment) {
      //console.log(assignment);

      this.chartOptions.series[0].data.push(assignment);

      //this.$store.commit("assignments/addAssignment", assignment);

      this.edited = true;
    },

    save() {
      console.log("save");
    },

    deleteAssignments() {
      console.log("delete");

      var points = this.$refs.chart.chart.getSelectedPoints();
      points.forEach((point) => {
        point.remove();
      });
    },
  },

  computed: {
    getAssignments() {
      // gets updated value from store
      return this.$store.getters["assignments/getAssignments"];
    },
    getMembers() {
      return this.$store.state.members.members;
    },

    chartOptions() {
      let data = this.data;
      let members = this.members;

      return {
        title: {
          text: "Assignments",
          floating: true,
          align: "left",
        },

        xAxis: [
          {
            currentDateIndicator: true,
          },
          {},
        ],
        yAxis: {
          uniqueNames: true,

          labels: {
            formatter: (label) => {
              const memberObj = members.find((member) => {
                if (member.id.toString() === label.value) {
                  return member;
                }
              });

              try {
                return memberObj.firstname + " " + memberObj.surname;
              } catch {
                return label.value;
              }
            },
          },
        },

        plotOptions: {
          series: {
            animation: false, // Do not animate dependency connectors
            dragDrop: {
              draggableX: true,
              draggableY: true,
            },
            dataLabels: {
              enabled: true,
              //format: "{point.project}",
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
            allowPointSelect: true,
            data: data,
          },
        ],
      };
    },
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.data = update;
    },
    getMembers(update) {
      this.members = update;
    },
  },
};
</script>

<style scoped></style>
