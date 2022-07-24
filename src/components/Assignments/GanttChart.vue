<template>
<!--     v-if="rses.length > 0 && assignments.length > 0 && projects.length > 0" -->
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
      rses: this.$store.getters["rses/getRses"],
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
    ,
    zoom: function(level) {

      let today = new Date().getTime(),
          day = 1000 * 60 * 60 * 24,
          month = day * 30,
          extremes = []

      switch(level) {
        case 0:
          extremes = [today - (month * 1.5), today + (month * 1.5)]
          break
        case 1:
          extremes = [today - (month * 3), today + (month * 3)]
          break
        case 2:
          extremes = [today - (month * 6), today + (month * 6)]
          break
        default:
          break
      }

      try {
        this.$refs.gantt.chart.xAxis[0].setExtremes(extremes[0],extremes[1])
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    chartOptions() {
      // let day = 24 * 3600 * 1000;
      // let scrollHeight = (this.assignments.length + this.rses.length) * 65; // increase '65' if chart cut off at bottom
      
      let colors = ['#f0f9ff','#e0f2fe','#bae6fd','#7dd3fc','#38bdf8','#0ea5e9','#0284c7','#0369a1','#075985','#0c4a6e']

      let rses = this.rses.map(rse=> ({ ...rse, color: colors[9] })),
          assignments = this.assignments.map((assignment)=> {
            return { ...assignment, color: colors[Math.round(assignment.FTE/10)-1] }
          })
      
      return {
        chart: {
          type: "gantt",
          styledMode: false,
          height: "60%", // % for aspect ratio
          // scrollablePlotArea: {
          //   minHeight: scrollHeight,
          //   opacity: 1,
          // },
          pan: {
            enabled: true,
            type: 'x'
          },
          panKey: 'alt',
          events: {
            load() {
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
            // dragDrop: {
            //   draggableX: true,
            //   draggableY: false,
            //   dragPrecisionX: day, // increments when dragging
            // },
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
                // drop: (data) => {
                //   try {
                //     // updates the chart array
                //     let assignmentIndex = this.assignments.findIndex((assignment) => {
                //       return (
                //         assignment.assignmentID === data.target.assignmentID
                //       );
                //     });
                //     this.assignments[assignmentIndex].start = data.target.start;
                //     this.assignments[assignmentIndex].end = data.target.end;

                //     if (!this.edited) {
                //       this.edited = true;
                //     }
                //   } catch {
                //     alert("Failed to drop item");
                //   }
                // },
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
        // navigator: {
        //   enabled: true,
        //   //liveRedraw: true,
        //   adaptToUpdatedData: false,
        //   yAxis: {
        //     min: 0,
        //     max: 30,
        //   },
        //   handles: {
        //     enabled: false
        //   },
        //   series: {
        //     type: 'gantt',
        //     pointPlacement: 0.5,
        //     pointPadding: 0.25,
        //     data: [...this.rses]
        //   },
        // },
        // scrollbar: {
        //   enabled: true,
        //   trackBackgroundColor: "rgba(230, 230, 230, 0.2)",
        // },
        series: [
          { 
            data: [...rses, ...assignments],
            pointWidth: 32
          }
        ],
      };
    },
    getAssignments() {
      // gets updated value from store
      return this.$store.getters["assignments/getAssignments"];

    },
    getRses() {
      // gets updated value from store
      return this.$store.getters["rses/getRses"];
   
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
    getRses(update) {
      // watches 'getRses()' to update rses
      this.rses = update;
    },
    getProjects(update) {
      // watches 'getProjects()' to update projects
      this.projects = update;
    },
  },
};
</script>