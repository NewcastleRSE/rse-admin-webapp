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
      <button :disabled="!edited" @click="save" class="button is-primary">
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
      assignments: [],
    };
  },
  created() {
    this.assignments = this.getAssignments;
    this.savedAssignments = this.getAssignments;
    this.members = this.getMembers;
  },

  methods: {
    toggleModal(project) {
      if (project) {
        this.projectForModal = project;
      }
      this.showModal = !this.showModal;
    },

    addAssignment(assignment) {
      if (!this.edited) {
        this.savedAssignments = this.assignments;
        this.edited = true;
      }

      this.$store.commit("assignments/addAssignment", assignment);
    },

    deleteAssignments() {
      console.log("delete");

      var points = this.$refs.chart.chart.getSelectedPoints();
      points.forEach((point) => {
        point.remove();
      });
    },

    save() {
      console.log(this.savedAssignments);
      console.log(this.assignments);
      console.log(this.getNewItems(this.savedAssignments, this.assignments));
    },

    /**
     * getNewItems():
     * All assignments dictionaries which are in currentAssignments
     * however not in tempAssignements
     * @returns dictionary
     */
    getNewItems(savedAssignments, notSavedAssignments) {
      return this.difference(notSavedAssignments, savedAssignments);
    },

    /**
     * getDeletedItems():
     * All assignments dictionaries which are in tempAssignments
     * however not in currentAssignements
     * @returns dictionary
     */
    getDeletedItems(savedAssignments, notSavedAssignments) {
      return this.difference(savedAssignments, notSavedAssignments);
    },

    /**
     * compareDictionary(): This will compare two dictionaries
     * @param {dictionary} a
     * @param {dictionary} b
     * @returns boolean
     */
    compareDictionary(a, b) {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        return true;
      }
      return false;
    },

    /**
     * difference(): This would returns the difference of two dictionaries
     * @param {dictionary} a
     * @param {dictionary} b
     * @returns dictionary
     */
    difference(a, b) {
      var items = [];
      for (var idx in a) {
        var temp = a[idx];
        var notFound = true;
        for (var idx1 in b) {
          var current = b[idx1];
          if (temp.name === current.name) {
            // if they have the same name
            notFound = false;
            if (!this.compareDictionary(current, temp)) {
              // compare dictionary
              items.push(temp);
            }
            break;
          }
        }
        if (notFound) {
          // if temp not found in currentAssignments delete
          items.push(temp);
        }
      }
      return items;
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
      let assignments = this.assignments;
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
            data: assignments,
          },
        ],
      };
    },
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.assignments = update;
    },
    getMembers(update) {
      this.members = update;
    },
  },
};
</script>

<style scoped></style>
