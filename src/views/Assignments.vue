<template>
  <h1>Assignments</h1>
  
   <div>
    <button @click="remove()" class="length">Remove</button>
   <highcharts
      :constructorType="'ganttChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
    </div>
    <div id="this" v-html="unallocationPrjs">
    </div>
    <div>
      <form v-on:submit.prevent="onSubmit" id = "dialogue" class = "openDialogue">
        <p ref="prjName" id="prjName">{{prjName}}</p>
        <label for="start">Start date</label><br>
        <input type="date" id="start" name="start" v-model="start"><br>

        <label for="end">End date</label><br>
        <input type="date" id="end" name="end" v-model="end"><br>

        <br>
        <select id="select" v-model="user">
          <option disabled value="">Please select one</option>
          <option v-for="member in members" v-bind:key="member">{{member}}</option>
        </select>
       
        <br>

        <input type="submit" value="Add" @click="addPrj()">
        <input type="button" value="Cancel" @click="cancel()">

    </form> 
    </div>
</template>


<script>


export default {
  name: "dashboard",

  methods: {
    /*
    * unassignedPrjBtns: This will be used to render a list of buttons to allow
    *                    allocations of unassigned projects.
    */
    unassignedPrjBtns() {
      var btns = "<h2> Unassigned Projects <h2>";
      this.$store.dispatch("get/getProjects", ["awaitingAllocation"]).then(() => {
      var projects = this.$store.getters["get/getProjects"];
      console.log(projects);
      projects.forEach( (project) => {
        btns  += `<button id='${project.name}' class='btn'> ${project.name} </button>`;
      })
      this.unallocationPrjs =  `<div> ${btns} </div>`;
      return this.unallocationPrjs;
    })
    
    },

    /*
    * addPrj(): This will be used to add project onto grantt chart
    * TODO: 
    * Do not allow the same form to submit twices
    * Update assigned project to database
    * 
    */
    addPrj() {
      var start = this.start.split("-");
      var end = this.end.split("-");
      var chart = this.chartOptions.series[0].data;
      chart.push(
        {name: this.user,
        start: Date.UTC(start[0], start[1], start[2]),
        end: Date.UTC(end[0], end[1], end[2]),
        project: document.getElementById('prjName').innerHTML
        })
      document.getElementById("dialogue").style.visibility = "hidden";
      alert("Added!");
      this.start = "";
      this.end = "";
      this.user = "";
    },

    /*
    * cancel(): This will be used to cancel the model
    */
    cancel() {
      var dialogue  = document.getElementById("dialogue");
      dialogue.style.visibility = "hidden";
    },

    /**
     * remove(): This will be used to remove a project from grantt chart
     */
    remove() {
      var points = this.$refs.chart.chart.getSelectedPoints();
      points.forEach((point) => {
        point.remove();
      })
      alert("Removed!")
    },

    save() {
      if (this.isArrayEqual(this.tempSeries, this.chartOptions.series[0].data)) {
        alert("No changes were made");
      } else {
        this.updateHubspot();
        this.updateStrapi();
      }
    },

    /**
     * updateHubspot(): This will update the 
     */
    updateHubspot() {
      console.log("TODO")
    },

    isArrayEqual(a, b) {
      if (a === b) return true; // checks type
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;

      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },
  },

  data() {

    
  
    return {
      
      unallocationPrjs: this.unassignedPrjBtns(),

      prjName: "",

      start: null,

      end: null,

      members: [],

      tempSeries: [],

      user: null,

      chartOptions: {
        title: {
          text: "Gantt Chart with Progress Indicators",
        },

        xAxis: {
          currentDateIndicator: true
        },

        plotOptions: {
        series: {
            animation: false, // Do not animate dependency connectors
            dragDrop: {
                draggableX: true,
                draggableY: true,
            
            },
            dataLabels: {
                enabled: true,
                format: '{point.project}',
                style: {
                    cursor: 'default',
                    pointerEvents: 'none'
                }
            },
            allowPointSelect: true,
           
            }
        },

        navigator: {
          enabled: true,
          liveRedraw: true,
          series: {
            type: "gantt",
            pointPlacement: 0.5,
            pointPadding: 0.25,
          },
          yAxis: {
            reversed: true,
            categories: [],
          },
        },
        scrollbar: {
          enabled: true,
        },
        rangeSelector: {
          enabled: true,
          selected: 0,
        },

        series: [
          {
            name: "Project 1",
            data: null
          },
        ],
      },
    };
  },
  
  created() {
    this.$store.dispatch("get/getAssignments");
    var assignments = this.$store.state.get.assignments;
    var members = [];
    var dictAssignments = [];
    console.log(assignments);
    assignments.forEach( (assign) => {
      var startDate = new Date(assign.startDate);
      var endDate = new Date(assign.endDate);
      dictAssignments.push({
          start: Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()),
          end: Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()),
          name: assign.member.firstname + " " + assign.member.surname,
          project: assign.project.name,
        
      });
      members.push(assign.member.firstname + " " + assign.member.surname);
      })
      this.chartOptions.series[0].data = dictAssignments;
      this.tempSeries = dictAssignments;
      this.members = members;    
  },

  updated() {
    var dialogue  = document.getElementById("dialogue");
    var btns = document.getElementsByClassName('btn');
    btns.forEach( (btn) => {
      btn.addEventListener("click", function() {
        dialogue.style.visibility = "visible";
        this.prjName = btn.id;
        document.getElementById('prjName').innerHTML = btn.id;
      })
    })
 
  },

};
</script>

<style>
.openDialogue {
  background-color: gray;
  visibility: hidden;
  width: 50%;
}
</style>