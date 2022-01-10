<template>
<!--     v-if="members.length > 0 && assignments.length > 0 && projects.length > 0" -->
  <highcharts
    :constructorType="'ganttChart'"
    class="hc"
    :options="chartOptions"
    ref="gantt"
  ></highcharts>
</template>

<script>
export default {
  name: "AssignmentGantt",
  data() {
    return {
      edited: false,
      members: this.$store.getters["members/getMembers"],
      projects: this.$store.getters["projects/getProjects"],
      assignments: this.$store.getters["assignments/getAssignments"]
    };
  },
  methods: {
    redraw: function() {
      this.$refs.gantt.chart.redraw()
    },
    getSelectedAssignment: function() {
      return this.$refs.gantt.chart.getSelectedPoints()
    }
  },
  computed: {
    chartOptions() {
      let day = 24 * 3600 * 1000;
      let scrollHeight = (this.assignments.length + this.members.length) * 65; // increase '65' if chart cut off at bottom
      return {
        chart: {
          type: "gantt",
          styledMode: true,
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
              // formats project ids to their names
              const projectObj = this.projects.find((project) => {
                if (project.id === label.value) {
                  return project;
                }
              });

              try {
                return projectObj.dealname;
              } catch {
                return label.value;
              }
            },
          },
        },
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          selected: 2,
          buttonPosition: {
            x: 0,
            y: 0
          },
          height: 50,
          buttons: [{
              type: 'month',
              count: 1,
              text: '1m',
              title: 'View 1 month'
          }, {
              type: 'month',
              count: 3,
              text: '3m',
              title: 'View 3 months'
          }, {
              type: 'month',
              count: 6,
              text: '6m',
              title: 'View 6 months'
          }, {
              type: 'year',
              count: 1,
              text: '1y',
              title: 'View 1 year'
          }],

        },
        tooltip: {
          followPointer: true,
          formatter: (p) => {
            let point = p.chart.hoverPoint;

            if(Object.prototype.hasOwnProperty.call(point, 'parent')) {
              return (
                "<b>" +
                point.project.dealname +
                "</b>" +
                "<br/>" +
                "<br/>Start: " +
                new Date(point.start).toDateString() +
                "<br/>End: " +
                new Date(point.end).toDateString()
              );
            }
            else {
              return (
                "<b>" +
                point.name +
                "</b>" +
                "<br/>"
              );
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
              dragPrecisionX: day, // increments when dragging
            },
            dataLabels: {
              // displays project ids for development
              enabled: true,
              format: "{point.project.dealname}",
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
                    let assignmentIndex = this.assignments.findIndex((assignment) => {
                      return (
                        assignment.assignmentID === data.target.assignmentID
                      );
                    });
                    this.assignments[assignmentIndex].start = data.target.start;
                    this.assignments[assignmentIndex].end = data.target.end;

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
                      let project = this.projects.find((project) => {
                        return project.id == event.point.projectID;
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
          handles: {
            enabled: false
          },
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
          },
        },
        scrollbar: {
          enabled: true,
          trackBackgroundColor: "rgba(230, 230, 230, 0.2)",
        },
        series: [
          { 
            data: [...this.members, ...this.assignments],
            pointWidth: 32
          }
        ],
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
      return this.$store.getters["projects/getProjects"];
    },
  },
  watch: {
    getAssignments(update) {
      // watches 'getAssignments()' to update chart
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