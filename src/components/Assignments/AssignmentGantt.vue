<template>
  <div class="columns">
    <div class="box column is-four-fifths">
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
    </div>
    <div class="column">
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
      savedAssignments: [],
      members: [],
      assignments: [],
      projects: [],
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
        this.edited = true;
      }

      this.$store.commit("assignments/addAssignment", assignment);
    },

    deleteAssignments() {
      if (!this.edited) {
        this.edited = true;
      }

      var points = this.$refs.chart.chart.getSelectedPoints();
      points.forEach((point) => {
        //point.remove();
        console.log(point.id);
        this.$store.commit("assignments/deleteAssignment", point.id);
      });
    },

    save() {
      let savedAssignments = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      let notSavedAssignments = this.$store.getters[
        "assignments/getAssignments"
      ];

      console.log(this.getNewItems(savedAssignments, notSavedAssignments));
      console.log(this.getDeletedItems(savedAssignments, notSavedAssignments));

      // save current assignments to savedAssignments
      this.$store.commit("assignments/saveAssignments"); // other logic needs to be added for axios
      this.edited = false;
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
    getAssignments() {
      // gets updated value from store
      let assignments = this.$store.getters["assignments/getAssignments"];
      let series = [
        { name: "", type: "gantt", allowPointSelect: true, data: [] },
      ];
      let overlapMembers = []; // keeps tracks of the last overlap for each member
      for (var idx in assignments) {
        let assignment = assignments[idx];
        for (var idx1 in assignments) {
          let assignment1 = assignments[idx1];

          if (idx != idx1) {
            if (
              assignment.name === assignment1.name &&
              assignment.projectId == assignment1.projectId
            ) {
              assignment1.multipleFlag = true;
            }
          }
        }

        // This section is focusing on overlaping members
        if (!overlapMembers[Number(assignment.name)]) {
          overlapMembers[Number(assignment.name)] = { series: 0, data: 0 };
        }
        let key = overlapMembers[Number(assignment.name)];
        let seriesKey = key.series;
        let dataKey = key.data;
        let dataLength = null;
        let temp = series[seriesKey].data[dataKey];
        if (temp) {
          if (
            temp.name === assignment.name &&
            assignment.start <= temp.end &&
            temp.start <= assignment.end
          ) {
            // overlap
            seriesKey++; // add too another assignment
          }
          if (!series[seriesKey]) {
            // if series is null
            series[seriesKey] = {
              name: "",
              type: "gantt",
              allowPointSelect: true,
              data: [],
            };
          }
        }
        dataLength = series[seriesKey].data.push(assignment);
        dataKey = dataLength - 1;
        overlapMembers[Number(assignment.name)] = {
          series: seriesKey,
          data: dataKey,
        };
      }

      return series;

      //return this.$store.getters["assignments/getAssignments"];
    },
    getMembers() {
      return this.$store.state.members.members;
    },

    chartOptions() {
      let assignments = this.assignments;
      let members = this.members;
      //let projects = this.projects;

      return {
        chart: {
          type: "gantt",
          //height: 375,
        },

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
          followPointer: true,
          formatter: (p) => {
            let point = p.chart.hoverPoint;

            let start = new Date(point.start);
            let end = new Date(point.end);

            // let projectName = projects.find((project) => {
            //   if (project.id === point.projectID) {
            //     console.log(project.id);
            //     console.log(point.projectID.toString);
            //     return project.name;
            //   }
            // });
            try {
              return (
                "<b>" +
                point.projectID +
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

        // series: [
        //   {
        //     name: "Assignment",
        //     allowPointSelect: true,
        //     data: assignments,
        //   },
        // ],

        series: assignments,
      };
    },

    getProjects() {
      // gets updated value from store
      return this.$store.getters["get/getProjects"]; // even when projects is identical to get, dont work
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
    getProjects(update) {
      // watches 'getProjects()' to update data in chart
      this.projects = update;
    },
  },
};
</script>
