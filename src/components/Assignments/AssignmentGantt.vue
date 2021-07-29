<template>
  <div class="columns">
    <div class="box column is-9">
      <highcharts
        v-if="members.length > 0 && assignments.length > 0"
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
      chart: [],

      itemsToSave: [], // stores assignment object
      itemsToDelete: [], // stores assignment id
      itemsToUpdate: [], // stores assignment id and new properties
    };
  },
  created() {
    this.assignments = this.getAssignments;
    //this.savedAssignments = this.getAssignments;
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
      // any way an item is deleted, it slow the chart (tried splice)
      if (!this.edited) {
        this.edited = true;
      }

      this.$refs.chart.chart.getSelectedPoints().forEach((point) => {
        try {
          this.itemsToDelete.push(point.assignmentID);

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

      newItems.forEach((item) => {
        const assignment = {
          //id: this.$store.getters["assignments/getUID"],
          member: { id: item.parent },
          startDate: item.start,
          endDate: item.end,
          projectID: item.name,
        };
        this.$store.dispatch("assignments/saveAssignment", assignment);
      });
      deletedItems.forEach((item) => {
        this.$store.dispatch("assignments/deleteAssignment", item.assignmentID);
      });

      //     // must be done after all items are saved and deleted
      //   this.chart = this.$store.getters["assignments/getSavedAssignments"];
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
    chartOptions() {
      //let assignments = this.assignments;
      let members = this.members;
      let projects = this.projects;
      let chart = this.chart;
      //let itemsToUpdate = this.itemsToUpdate;
      let day = 24 * 3600 * 1000;
      return {
        chart: {
          type: "gantt",
          height: "60%", // % for aspect ratio
          scrollablePlotArea: {
            minHeight: 3000, // have to make this dynamic
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
                  // updates the chart array
                  let assignmentIndex = chart.findIndex((assignment) => {
                    return assignment.assignmentID === data.target.assignmentID;
                  });
                  chart[assignmentIndex].start = data.target.start;
                  chart[assignmentIndex].end = data.target.end;

                  //   // updates itemsToUpdate array
                  //   let start = new Date(data.target.start).toISOString();
                  //   let end = new Date(data.target.end).toISOString();
                  //   let assignment = {
                  //     id: data.target.assignmentID,
                  //     startDate: start,
                  //     endDate: end,
                  //   };

                  //   let itemIndex = itemsToUpdate.findIndex((item) => {
                  //     return item.id === data.target.assignmentID;
                  //   });

                  //   if (itemIndex > -1) {
                  //     itemsToUpdate[itemIndex] = assignment;
                  //   } else {
                  //     itemsToUpdate.push(assignment);
                  //   }
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
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update data in chart
      this.chart = update;
      this.assignments = update; //might not be needed
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
