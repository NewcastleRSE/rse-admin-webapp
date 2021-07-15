//import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {
    assignments: [],
  },

  getters: {
    /*
    Maps properties from strapi to variables used in highcharts
    */
    getAssignments: (state) => {
      const assignments = state.assignments.map((assignment) => {
        const ganttItem = {};

        ganttItem.id = assignment.id;

        ganttItem.name =
          assignment.member.firstname + assignment.member.surname;

        ganttItem.start = Date.parse(assignment.startDate);

        ganttItem.end = Date.parse(assignment.endDate);

        ganttItem.projectId = assignment.project.id;

        return ganttItem;
      });

      //console.log(projects);
      return assignments;
    },
  },

  mutations: {
    getAssignments(state, assignments) {
      state.assignments = assignments;
    },
  },

  actions: {
    /*
    Gets assignment or assignments from DB
    Call with this.$store.dispatch("assignments/getAssignments", "{id}");
    Can leave parameter empty and will call all assignments
    */
    getAssignments({ commit, rootState }, id = "") {
      axios
        .get(`http://localhost:1337/assignments/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getAssignments", response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /*
    Creates an assignment and adds it to the DB
    Call with this.$store.dispatch("assignments/createAssignment", assignment);
    Can leave parameter empty and will call all assignments
    */
    createAssignment({ rootState }, assignment) {
      axios
        .post(`http://localhost:1337/assignments/`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          // add assignment to store or call all assignment again
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
