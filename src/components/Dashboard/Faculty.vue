<template>

    <highcharts
      
      class="hc"
      :options="chartOptions"
      ref="chart"

    ></highcharts>

</template>

<script>
export default {
  name: "faculty",
  data() {
    return {
        chartOptions: {
        chart: {
            width: 450,
            
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Delivered amount',
            data: [
                ['Bananas', 8],
                ['Kiwi', 3],
                ['Mixed nuts', 1],
                ['Oranges', 6],
                ['Apples', 8],
                ['Pears', 4],
                ['Clementines', 4],
                ['Reddish (bag)', 1],
                ['Grapes (bunch)', 1]
            ]
        }]
        }
    };
  },
  async created() {
    let value = this.getValueByFaculty;
    this.chartOptions.series[0].data = value;
  },
  methods: {},
  computed: {
    getValueByFaculty() {
        let projects = this.$store.getters["get/getProjects"];
        let valueByFaculty = {};
        projects.forEach( (project) => {
            let add = (project.amount) ? Number(project.amount) : 0;
            let key = project.faculty;
            if (key in valueByFaculty) {
                let amount = valueByFaculty[key][1];
                valueByFaculty[key] = [key, amount + add ];
                }
            else {
                
                valueByFaculty[key] = [key, add ];
            }
            
        })
        return Object.values(valueByFaculty);
    },
    
  },
  watch: {
    getValueByFaculty(update) {
        this.chartOptions.series[0].data = update;

    },
   
  },
};
</script>