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
      table: null,
    };
  },
  async created() { 
       let assignments = this.getAssignmentsEndDate
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
                '<a href="#" data-id="' +
                row.user_id +
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
        rows: assignments,
        totalRecordCount: assignments.length,
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
      getAssignmentsEndDate() {
        let assignments = this.$store.getters["assignments/getAssignments"];
        let members = this.$store.getters["members/getMembers"];
        let projects = this.$store.getters["get/getProjects"];
        console.log( projects)
        let data = []
        assignments.forEach( (assign) => { //finding the minimum
             if (Date.now() >= assign.start) {
                let member = members.filter(memb => memb.id == assign.parent);
                let project = projects.filter(prj => prj.id == assign.name);
                console.log(project)
                member = member[0];
                project = project[0];
                let start = new Date(project.start + 10);
                console.log(start)
                let end = new Date(project.end);
                data.push({
                    id: assign.name,
                    name: member.name,
                    email: member.email,
                    project: project.name,
                    start: start.toDateString(),
                    end: end.toDateString(),
                })
             }
        })
        return data
      }
  },
  watched: {
      getAssignmentsEndDate(update) {
          this.data = update;
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