<template>
  <div class="box">
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
      chartOptions: {
        chart: {
          type: "timeline",
          inverted: true,
        },
        xAxis: {
          type: "datetime",
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        title: {
          text: "Timeline of Space Exploration",
        },
        subtitle: {
          text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>',
        },
        series: [
          {
            dataLabels: {
              allowOverlap: false,
              format:
                '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
                "{point.label}</span><br/>{point.x:%d %b %Y}",
            },
            marker: {
              symbol: "circle",
            },
            data: [
              {
                x: Date.UTC(1951, 5, 22),
                name: "First dogs",
                label: "1951: First dogs in space",
                description:
                  "22 July 1951 First dogs in space (Dezik and Tsygan) ",
              },
              {
                x: Date.UTC(1957, 9, 4),
                name: "Sputnik 1",
                label: "1957: First artificial satellite",
                description:
                  "4 October 1957 First artificial satellite. First signals from space.",
              },
              {
                x: Date.UTC(1959, 0, 4),
                name: "First human spaceflight",
                label: "1961: First human spaceflight (Yuri Gagarin)",
                description:
                  "First human spaceflight (Yuri Gagarin), and the first human-crewed orbital flight",
              },
              {
                x: Date.UTC(1961, 3, 12),
                name: "First human on the Moon",
                label: "1969: First human on the Moon",
                description:
                  "First human on the Moon, and first space launch from a celestial body other than the Earth. First sample return from the Moon",
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.chartOptions.series[0].data = this.getAssignments;
  },
  methods: {},
  computed: {
    getAssignments() {
      let assignments = this.$store.getters["assignments/getAssignments"];
      assignments.forEach( (assign) => {
        this.$store.dispatch("get/getProject", assign.projectId); // how to handlet this
        this.$store.getters["get/getProject"] ;
      });
      console.log(assignments)
      return assignments;      
    }


    
  },
  watch: {
    getAssignments(update) {
        this.chartOptions.series[0].data = update;

    }
  },
};
</script>