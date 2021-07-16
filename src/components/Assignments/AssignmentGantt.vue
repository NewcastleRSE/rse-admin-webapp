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
    @test="test"
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
      members: [
        { id: 1, name: "Mark" },
        { id: 4, name: "Max" },
      ],

      chartOptions: {
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
          //   categories: [
          //     { id: 1, name: "Mark", y: 1 },
          //     { id: 2, name: "Max", y: 2 },
          //     { id: 3, name: "Three", y: 3 },
          //     { id: 4, name: "Four", y: 4 },
          //   ],
          //categories: [],
          //type: "category",
          labels: {
            // formatter: () => {
            //   return this.members.find((member) => member.id === 4).name;
            // },
            // formatter: function() {
            //   let members = [
            //     { id: 1, name: "One" },
            //     { id: 2, name: "Two" },
            //     { id: 3, name: "Three" },
            //     { id: 4, name: "four" },
            //   ];
            //   console.log(members);
            //   console.log(this.value);
            //   //return members.find((member) => member.id === this.value).name;
            //   return members.find(function(member) {
            //     member.id === this.value;
            //   }).name;
            // },
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
            allowPointSelect: true,
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.chartOptions.series[0].data = this.getAssignments;
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

      //this.chartOptions.series[0].data.push(assignment);

      this.$store.commit("assignments/addAssignment", assignment);

      this.edited = true;
    },

    test() {
      console.log("after emit");
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
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.chartOptions.series[0].data = update;
    },
    getMembers(update) {
      console.log(update);
      //   update.forEach((member) => {
      //     this.chartOptions.yAxis.categories.push(member.id);
      //   });
      //this.chartOptions.yAxis.categories = update;
    },
  },
};
</script>

<style scoped></style>
