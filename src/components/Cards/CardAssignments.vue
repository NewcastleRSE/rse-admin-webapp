<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"
          >
            Project Assignments
          </h3>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <highcharts
        v-if="members.length > 0 && chart.length > 0 && projects.length > 0"
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
  </div>
</template>
<script>
//:disabled="!edited"
// import ProjectsCard from "@/componenets/Assignments/ProjectsCard.vue";
// import Modal from "@/componenets/Assignments/AssignmentsFormModal.vue";
import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
export default {
  name: "AssignmentGantt",
  // components: { ProjectsCard, Modal },
  data() {
    return {
      showModal: false,
      projectForModal: null,
      edited: false,

      members: [],
      projects: [],
      chart: [],
    };
  },
  /*
    loads data into chart if the data was retrieved
    while on a different page
  */
  created() {
    this.members = this.getMembers;
    this.projects = this.getProjects;
    this.chart = this.getAssignments;
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

      const newAssignment = {
        name: assignment.projectID,
        parent: assignment.member.id.toString(),
        assignmentID: assignment.id,
        start: Date.parse(assignment.startDate),
        end: Date.parse(assignment.endDate),
      };

      this.chart.push(newAssignment);
    },
    deleteAssignments() {
      if (!this.edited) {
        this.edited = true;
      }

      this.$refs.chart.chart.getSelectedPoints().forEach((point) => {
        try {
          this.chart = this.chart.filter(
            (item) => item.assignmentID !== point.assignmentID
          );
        } catch {
          console.log("Failed To Delete");
        }
      });
    },
    save() {
      let savedAssignments = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      let notSavedAssignments = this.chart;

      let newItems = this.getNewItems(savedAssignments, notSavedAssignments);
      let deletedItems = this.getNewItems(
        notSavedAssignments,
        savedAssignments
      );

      console.log("new: ", newItems);
      console.log("deleted: ", deletedItems);

      let promises = [];

      newItems.forEach((item) => {
        const assignment = {
          //id: this.$store.getters["assignments/getUID"],
          member: { id: item.parent },
          startDate: item.start,
          endDate: item.end,
          projectID: item.name,
        };
        promises.push(
          this.$store.dispatch("assignments/saveAssignment", assignment)
        );
      });
      deletedItems.forEach((item) => {
        promises.push(
          this.$store.dispatch(
            "assignments/deleteAssignment",
            item.assignmentID
          )
        );
      });

      Promise.allSettled(promises).then(() => {
        this.chart = this.$store.getters["assignments/getSavedAssignments"];
      });
    },
    cancel() {
      this.chart = this.$store.getters["assignments/getSavedAssignments"];
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
    // chart settings
    chartOptions() {
      let members = this.members;
      let projects = this.projects;
      let chart = this.chart;

      let day = 24 * 3600 * 1000;
      let scrollHeight = (chart.length + members.length) * 60; // increase '60' if chart cut off at bottom
      return {
        chart: {
          type: "gantt",
          height: "60%", // % for aspect ratio
          scrollablePlotArea: {
            minHeight: scrollHeight,
            opacity: 1,
          },
          events: {
            load: () => {
              console.log("loaded: ", chart);
            },
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
          labels: {
            formatter: (label) => {
              const projectObj = projects.find((project) => {
                if (project.id === label.value) {
                  return project;
                }
              });

              try {
                return projectObj.name;
              } catch {
                return label.value;
              }
            },
          },
        },
        tooltip: {
          followPointer: true,
          formatter: (p) => {
            let point = p.chart.hoverPoint;
            let start = new Date(point.start);
            let end = new Date(point.end);
            let projectName = projects.find((project) => {
              if (project.id === point.name) {
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
              return point.name;
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
            dataLabels: {
              enabled: true,
              format: "{point.name}",
              style: {
                cursor: "default",
                pointerEvents: "none",
              },
            },
            allowPointSelect: true,
            point: {
              events: {
                drop: (data) => {
                  try {
                    // updates the chart array
                    let assignmentIndex = chart.findIndex((assignment) => {
                      return (
                        assignment.assignmentID === data.target.assignmentID
                      );
                    });
                    chart[assignmentIndex].start = data.target.start;
                    chart[assignmentIndex].end = data.target.end;
                  } catch {
                    alert("Failed to drop item");
                  }
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
            max: 30,
          },
        },
        scrollbar: {
          enabled: true,
          trackBackgroundColor: "rgba(230, 230, 230, 0.2)",
        },
        series: [{ data: [...members, ...chart] }],
      };
    },

    getAssignments() {
      // gets updated value from store
      return this.$store.getters["assignments/getAssignments"];
    },
    getMembers() {
      return this.$store.getters["members/getMembers"];
    },
    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"]; // even when projects is identical to get, doesnt work
    },
  },

  /*
    loads data once they are retrieved if page is opened on current page
  */
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update chart
      this.chart = update;
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
  props: {
    color: {
      default: "light",
      validator: function (value) {
        // The value must match one of these strings
        return ["light", "dark"].indexOf(value) !== -1;
      },
    },
  },
};
</script>
