<template>
  <div class="member-filter">
    <h2>Members Filter</h2>
    <div class="select is-primary">
      <select v-model="selected">
        <option value="All">All</option>
        <option value="DataScience">Data Science</option>
        <option value="Integrations">Integrations</option>
        <option value="WebMobile">Web Mobile</option>
      </select>
    </div>
    <p>{{ selected }}</p>
  </div>
  <div class="columns">
    <div class="box column is-10">
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
    <div class="column is-3">
      <ProjectsCard @toggle-form-modal="toggleFormModal" />
    </div>
  </div>
  <FormModal
    v-if="showFormModal"
    :project="projectForModal"
    @toggle-form-modal="toggleFormModal"
    @add-assignment="addAssignment"
  />
  <ProjectModal
    v-if="showProjectModal"
    :project="projectForModal"
    @toggle-project-modal="toggleProjectModal"
  />
</template>

<script>
//:disabled="!edited"
import ProjectsCard from "./ProjectsCard.vue";
import FormModal from "./AssignmentsFormModal.vue";
import ProjectModal from "../ProjectModal.vue";

import differenceWith from "lodash.differencewith";
import isEqual from "lodash.isequal";
export default {
  name: "AssignmentGantt",
  components: { ProjectsCard, FormModal, ProjectModal },
  data() {
    return {
      showFormModal: false,
      showProjectModal: false,
      projectForModal: null, // used for both form and project modal

      edited: false,

      members: [],
      membersFiltered: [],
      selected: "All",

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
    toggleFormModal(project) {
      if (project) {
        this.projectForModal = project;
      }
      this.showFormModal = !this.showFormModal;
    },
    toggleProjectModal(project) {
      if (project) {
        this.projectForModal = project;
      }
      this.showProjectModal = !this.showProjectModal;
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
            events: {
              click: function() {
                console.log(this);
              },
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
                click: (event) => {
                  try {
                    if (event.point.parent) {
                      // if clicked on project
                      let project = projects.find((project) => {
                        return project.id == event.point.name;
                      });

                      this.toggleProjectModal(project);
                    } else {
                      // if clicked on name
                      console.log("name");
                    }
                  } catch {
                    alert("Error during click");
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

      //   if (this.selected === "All") {
      //     return this.$store.getters["members/getMembers"];
      //   } else {
      //     return this.$store.getters["members/getMembers"].filter((member) => {
      //       return member.team === this.selected;
      //     });
      //   }
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
};
</script>

<style scoped>
.member-filter {
  margin: 1em;
  display: flex;
}
.member-filter h2 {
  margin-right: 0.5em;
}
</style>
