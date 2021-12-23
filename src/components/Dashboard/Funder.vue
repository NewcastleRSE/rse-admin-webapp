<template>

    <highcharts
      
      class="hc"
      :options="chartOptions"
      ref="chart"

    ></highcharts>
  
</template>

<script>
export default {
  name: "funder",
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

        title: {
            text: "",
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
    let value = this.getValueByFunders;
    this.chartOptions.series[0].data = value;
  },
  methods: {},
  computed: {
    getValueByFunders() {
        let projects = this.$store.getters["projects/getProjects"];
        let valueByFunders = {};
        projects.forEach( (project) => {
            let add = (project.amount) ? Number(project.amount) : 0;
            let key = project.fundingBody;
            if (key in valueByFunders) {
                let amount = valueByFunders[key][1];
                valueByFunders[key] = [key, amount + add ];
                }
            else {
                
                valueByFunders[key] = [key, add ];
            }
        })
        return Object.values(valueByFunders);
    },
    
  },
  watch: {
    getValueByFunders(update) {
        this.chartOptions.series[0].data = update;

    },
   
  },
};
</script>