<template>
  <!-- <div class="member-filter">
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
    <p>Double click on assignment to open modal</p>
    <label class="checkbox">
      <input type="checkbox" v-model="showOldAssignments" />
      Show assignments that ended over a year ago
    </label>
    <p>{{ showOldAssignments }}</p>
  </div> -->
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
      <div class="btns">
        <div class="delete">
          <button @click="deleteAssignments" class="button is-primary">
            Delete Selected
          </button>
        </div>
        <div class="save">
          <a id= "download" class="button is-secondary mr-5" @click="exportCSVFile()"> <font-awesome-icon icon="file-download"/></a>
          <button :disabled="!edited" @click="save" class="button is-primary">
            Save
          </button>
          <button
            :disabled="!edited"
            @click="cancel"
            class="button is-secondary"
          >
            Cancel
          </button>
        </div>
        

      </div>
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
      selected: "All",

      projects: [],
      showOldAssignments: false,

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

     /**
     * toCSV(): Converts the charts series dictionary
     *          into a csv
     */
    toCSV() {
      const header = "id,start,end,name,dealname" + "\r\n";
      var body = "";
      var chart = this.$store.getters[
        "assignments/getSavedAssignments"
      ];
      chart.forEach((el) => {
        var line = "";
        for (var key in el) {
          if (line != "") {line += ","} // add commas for csv
          if (key === "start" || key === "end") {
            console.log(key)
            var date = new Date(el[key]);
            line += date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          }
          else if (el[key]) {
            line += el[key]; // to remove undefined values
          } 
          else {
            line += " "; 
          }
        }
        body += line + "\r\n";
      })
      var csv = header + body;
      console.log(csv);
      return csv;
    },

    /**
     * exportCSVFile(): Allow you to download the exported csv file
     */
    exportCSVFile() {
      var link = document.getElementById("download");
      var csv = this.toCSV();
      var blob = new Blob([csv], { type: "text/csv"});
      link.download = "data.csv";
      link.href = URL.createObjectURL(blob);
    },
    /*
    Pushes assignment from AssignmentsFormModal
    */
    addAssignment(assignment) {
      if (!this.edited) {
        this.edited = true;
      }

      this.chart.push(assignment);
    },
    /*
    Gets selected points and removes them
    */
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
    /*
    Compares saved and unsaved items to find which
    items need to be added to the db and which
    items need to be deleted from the db
    */
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
          startDate: new Date(item.start).toISOString(),
          endDate: new Date(item.end).toISOString(),
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
        // updates chart to match what is stored in the db
        this.chart = this.$store.getters["assignments/getSavedAssignments"];
        this.edited = false;
      });
    },
    cancel() {
      // reverst chart back to save assignments
      this.chart = this.$store.getters["assignments/getSavedAssignments"];
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
            load() {
              //console.log("loaded: ", chart);
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
              // formatts project ids to their names
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
            // displays project details at hover
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
              dragPrecisionX: day, // incraments when dragging
            },
            dataLabels: {
              // displays project ids for development
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

                    if (!this.edited) {
                      this.edited = true;
                    }
                  } catch {
                    alert("Failed to drop item");
                  }
                },
                dblclick: (event) => {
                  try {
                    if (event.point.parent) {
                      // if clicked on assignment
                      let project = projects.find((project) => {
                        return project.id == event.point.name;
                      });

                      this.toggleProjectModal(project);
                    } else {
                      // if clicked on name
                      this.$router.push({
                        name: "User",
                        params: { id: event.point.id },
                      });
                    }
                  } catch {
                    alert("Error during dblclick");
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
      // gets updated value from store
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
.btns {
  display: flex;
  justify-content: space-between;
  margin: 0 1em;
}
</style>
