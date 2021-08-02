<template>
  <table-lite 
    :columns="table.columns"
    :rows="table.rows"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    :messages="table.messages"
  ></table-lite>
</template>

<script>
import { defineComponent, reactive } from "vue";
import TableLite from "vue3-table-lite";


export default defineComponent({
  name: "endDate",
  components: {
    TableLite,
  },
  setup() {
    return {
      endAssignments: null,
      assignments: null,
      members: {},
      projects: null,
      table: {columns: {},
              rows: {}, 
              totalRecordCount: {},
              sortable: {order: null, sort: null},
              messages: {}},
    };
  },

  methods: {
    endDateData(members, assignments, projects) {
      let data = []
      if (assignments) {
        assignments.forEach( (assign) => { //finding the minimum
              if (Date.now() >= assign.start) {
                let member = members.filter(memb => memb.id == assign.parent);
                let project = projects.filter(prj => prj.id == assign.name);
                //console.log(project)
                member = member[0];
                project = project[0];
                //console.log(project);
                //console.log(member)
                let start = new Date();
                let end = new Date();
                if (project)
                  {
                  start = new Date(project.start + 10);
                  end = new Date(project.end);
                  data.push({
                      id: assign.parent,
                      name: member.name,
                      email: member.email,
                      project: project.name,
                      start: start.toDateString(),
                      end: end.toDateString(),
                  })
                  }
              }
        })
      }
      return data
    }
  },

  
  async created() { 
       this.assignments = this.getAssignments;
       this.members = this.getMembers;
       console.log(this.members)
       this.projects = this.getProjects;
       this.endAssignments = this.getAssignmentsEndDate;
       console.log(this.endAssignments);
       this.table = reactive({
        columns: [
            {
            label: "ID",
            field: "id",
            width: "3%",
            sortable: true,
            isKey: true,
            },
            {
            label: "Name",
            field: "name",
            width: "10%",
            sortable: true,
            display: function (row) {
                return (
                '<a href="/user/' + row.id + '" data-id="' +
                row.id +
                '" class="name-btn">' +
                row.name +
                "</a>"
                );
            },
            },
            {
            label: "Email",
            field: "email",
            width: "15%",
            sortable: true,
            },
            {
            label: "Project",
            field: "project",
            width: "15%",
            sortable: true,
            },
            {
            label: "Start",
            field: "start",
            width: "5%",
            sortable: true,
            },
            {
            label: "End",
            field: "end",
            width: "5%",
            sortable: true,
            },            
        ],
        rows: this.endAssignments,
        totalRecordCount: this.endAssignments.length,
        sortable: {
            order: "id",
            sort: "asc",
        },
        messages: {
            pagingInfo: "Showing {0}-{1} of {2}",
            pageSizeChangeLabel: "Row count:",
            gotoPageLabel: "Go to page:",
            noDataAvailable: "No data",
          },
        });
    },


  computed: {
    getProjects() {
      return this.$store.getters["get/getProjects"];
    },

    getAssignments() {
      return this.$store.getters["assignments/getAssignments"];
    },

    getMembers() {
      return this.$store.getters["members/getMembers"];
    },

    getAssignmentsEndDate() {
     
      return this.endDateData(this.getMembers, this.getAssignments, this.getProjects)
    },
    
  },
  watch: {
    getProjects(update) {
      this.projects = update;
    },

    getAssignments(update) {
      this.members = update;
    },

    getMembers(update) {
      this.members = update;
    },

    getAssignmentsEndDate(update) {
      this.endAssignments = update;
    }
  }
}
 
);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>