<template>
  <div class="columns">
    <div class="box column is-9">
      <highcharts
        v-if="assignments.length > 0"
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
      <button @click="cancel" class="button is-secondary">
        Cancel
      </button>
    </div>
    <div class="column is-3">
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
//:disabled="!edited"
import ProjectsCard from "./ProjectsCard.vue";
import Modal from "./AssignmentsFormModal.vue";
import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
export default {
  name: "AssignmentGantt",
  components: { ProjectsCard, Modal },
  data() {
    return {
      showModal: false,
      projectForModal: null,
      edited: false,
      //savedAssignments: [],
      members: [],
      assignments: [],
      projects: [],
    };
  },
  created() {
    this.assignments = this.getAssignments;
    //this.savedAssignments = this.getAssignments;
    this.members = this.getMembers;
    this.projects = this.getProjects;
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
        this.edited = true;
      }

      this.$store.commit("assignments/addAssignment", assignment);
    },
    deleteAssignments() {
      if (!this.edited) {
        this.edited = true;
      }
      let points = this.$refs.chart.chart.getSelectedPoints();
      points.forEach((point) => {
        this.$store.commit("assignments/removeAssignment", point);
      });
    },
    save() {
      let savedAssignments = this.$store.state.assignments.savedAssignments;
      let notSavedAssignments = this.$store.state.assignments.assignments;
      let newItems = this.getNewItems(savedAssignments, notSavedAssignments);
      let deletedItems = this.getDeletedItems(
        savedAssignments,
        notSavedAssignments
      );

      this.$store.commit("assignments/resetAssignments");
      newItems.forEach((item) => {
        this.$store.dispatch("assignments/saveAssignment", item);
      });
      deletedItems.forEach((item) => {
        this.$store.dispatch("assignments/deleteAssignment", item.id);
      });
      this.edited = false;
    },
    cancel() {
      this.$store.commit("assignments/resetAssignments");
    },
    /**
     * getNewItems():
     * All assignments dictionaries which are in currentAssignments
     * however not in tempAssignements
     * @returns dictionary
     */
    getNewItems(savedAssignments, notSavedAssignments) {
      return differenceWith(notSavedAssignments, savedAssignments, isEqual);
    },
    /**
     * getDeletedItems():
     * All assignments dictionaries which are in tempAssignments
     * however not in currentAssignements
     * @returns dictionary
     */
    getDeletedItems(savedAssignments, notSavedAssignments) {
      return differenceWith(savedAssignments, notSavedAssignments, isEqual);
    },
  },
  computed: {
    chartOptions() {
      let assignments = this.assignments;
      let members = this.members;
      let projects = this.projects;
      let day = 24 * 3600 * 1000;
      return {
        chart: {
          type: "gantt",
          height: "60%", // % for aspect ratio
          scrollablePlotArea: {
            minHeight: 3000, // have to make this dynamic
            opacity: 1,
          },
        },
        title: {
          text: "Assignments",
          floating: true,
          align: "left",
        },
        xAxis: [
          {
            currentDateIndicator: {
              label: {
                format: "%d-%m-%y",
              },
            },
          },
          {},
        ],
        yAxis: {
          uniqueNames: true,
          //max: 7,
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
        tooltip: {
          //followPointer: true,
          formatter: (p) => {
            let point = p.chart.hoverPoint;
            let start = new Date(point.start);
            let end = new Date(point.end);
            let projectName = projects.find((project) => {
              if (project.id === point.projectID) {
                return project;
              }
            });

            try {
              return (
                "<b>" +
                projectName.name +
                "</b>" +
                "<br/>" +
                "<br/>Start: " +
                start.toDateString() +
                "<br/>End: " +
                end.toDateString()
              );
            } catch {
              return "<b>Loading</b>";
            }
          },
        },
        plotOptions: {
          series: {
            pointWidth: 18,
            animation: true,
            dragDrop: {
              draggableX: true,
              draggableY: false,
              dragPrecisionX: day,
            },
            //maybe put in gantt
            dataLabels: {
              enabled: true,
              //format: "{point.projectID}",
              style: {
                cursor: "default",
                pointerEvents: "none",
              },
            },
            allowPointSelect: true,
            point: {
              events: {
                drop: (data) => {
                  let start = new Date(data.target.start).toISOString();
                  let end = new Date(data.target.end).toISOString();

                  //create new object
                  const assignment = {
                    id: data.target.id,
                    member: { id: parseInt(data.target.name) },
                    startDate: start,
                    endDate: end,
                    projectID: data.target.projectID,
                  };
                  this.$store.commit(
                    "assignments/removeAssignment",
                    data.target
                  );
                  this.$store.commit("assignments/addAssignment", assignment);
                  //this.$store.commit("assignments/updateAssignment", data);
                },
              },
            },
          },
        },
        navigator: {
          enabled: true,
          //liveRedraw: true,
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
        series: assignments,
      };
    },

    getAssignments() {
      // gets updated value from store
      let assignments = this.$store.getters["assignments/getAssignments"];

      let series = [{ data: [] }];
      assignments.forEach((assignment) => {
        // loop thorugh each assignment
        for (let i = 0; i < series.length; i++) {
          // loop through each series
          let overlapped = false;
          series[i].data.forEach((point) => {
            // loop through each assignment in a series
            if (
              assignment.start < point.end &&
              assignment.end > point.start &&
              assignment.name === point.name
            ) {
              // if assignments overlap
              overlapped = true;
            }
          });
          if (!overlapped) {
            series[i].data.push(assignment); // add assignment to data if doesnt overlap
            break;
          } else if (!series[i + 1]) {
            series.push({ data: [] }); // adds new seriese if next doesnt exist
          }
        }
      });

      series[0].data.push({ name: "" }); // fixes last members name not getting displayed

      return series;

      //return [{ data: assignments }];
    },
    getMembers() {
      return this.$store.state.members.members;
    },
    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"]; // even when projects is identical to get, doesnt work
    },
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.assignments = update;
    },
    getMembers(update) {
      // watches 'getMembers()' to update members
      this.members = update;
    },
    getProjects(update) {
      // watches 'getProjects()' to update projects
      this.projects = update;
    },
  },
};
</script>
