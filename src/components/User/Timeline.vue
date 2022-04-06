<template>
  <div class="box">
    <h1> {{rse}}</h1>
    <highcharts
      
      class="hc"
      :options="chartOptions"
      ref="chart"

    ></highcharts>
  </div>
</template>

<script>
export default {
  name: "timeline",
  data() {
    return {
      rse: " ",
      chartOptions: {
        chart: {
          type: "timeline",
          //inverted: true,
        },
        xAxis: {
          type: "datetime",
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        title: {
          text: "Timeline of project",
        },
        series: [
          {
            dataLabels: {
              allowOverlap: false,
            },
            marker: {
              symbol: "circle",
            },
            data: null,
          },
        ],
      },
    };
  },
  async created() {
    this.chartOptions.series[0].data = this.getAssignments;
    console.log(this.chartOptions.series[0].data)
    this.rse = this.getRse;
    console.log(this.rse)
  },
  methods: {},
  computed: {
    getAssignments() {
      let id = this.$route.params.id
      let assignments = this.$store.getters["assignments/getAssignments"].filter(
        assignment => id == assignment.parent);
      assignments.forEach( (assign) => {
        let project = this.$store.getters["projects/getProjects"].filter(prj => prj.id == assign.name
        );
        console.log(project);
        if (project.length  > 0) {assign.parent = project[0].name;
                                  assign.description = "Faculty: " + project[0].faculty;}
        assign.x = assign.start;
        assign.name = assign.parent;
        
  
        assign.label = (new Date(assign.start)).toDateString() + " to " + (new Date(assign.end)).toDateString();
        
      });
      assignments = assignments.sort(
        function(a,b)
          {return (new Date(a.start)).getTime() - (new Date(b.start)).getTime()});

      return assignments;      
    },

    getRse() {
      let rse = this.$store.getters["rses/getRses"].filter(memb => memb.id === this.$route.params.id);
      if (rse[0]) {
        return rse[0].name;
      } 
      return "";
    }
    
  },
  watch: {
    getAssignments(update) {
        this.chartOptions.series[0].data = update;

    },

    getRse(update) {
      this.rse = update;
    }
   
  },
};
</script>