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
    savedAssignments: [],
  },

  getters: {
    /*
        Maps properties from strapi to variables used in highcharts
        */
    getAssignments: (state) => {
      const assignments = state.assignments.map((assignment) => {
        const ganttItem = {};

        ganttItem.id = assignment.id;

        ganttItem.name = assignment.member.id.toString();

        ganttItem.start = Date.parse(assignment.startDate);

        ganttItem.end = Date.parse(assignment.endDate);
        ganttItem.projectID = assignment.projectID;

        return ganttItem;
      });

      assignments.sort(function(a, b) {
        return a.id - b.id;
      });

      return assignments;
    },
    getUID: (state) => {
      return (
        Math.max(...state.assignments.map((assignment) => assignment.id)) + 1
      );
    },
  },
  mutations: {
    getAssignments(state, assignments) {
      state.assignments = assignments;
      state.savedAssignments = assignments; // should only be called once when loading app
    },
    resetAssignments(state) {
      state.assignments = state.savedAssignments;
    },

    saveAssignment(state, assignment) {
      state.savedAssignments = [...state.savedAssignments, assignment];
    },
    deleteAssignment(state, assignment) {
      state.savedAssignments = state.savedAssignments.filter(
        (item) => item.id !== assignment.id
      );
    },
    addAssignment: (state, assignment) => {
      state.assignments = [...state.assignments, assignment];
    },
    removeAssignment: (state, assignment) => {
      state.assignments = state.assignments.filter(
        (item) => item.id !== assignment.id
      );
    },
    updateAssignment: (state, assignment) => {
      let objIndex = state.assignments.findIndex(
        (obj) => obj.id == assignment.target.id
      ); // added error handling
      let objIndex2 = state.savedAssignments.findIndex(
        (obj) => obj.id == assignment.target.id
      ); // added error handling

      let start = new Date(assignment.target.start).toISOString();
      let end = new Date(assignment.target.end).toISOString();

      console.log("before: ", state.savedAssignments[objIndex2]);

      state.assignments[objIndex].startDate = start;
      state.assignments[objIndex].endDate = end;

      console.log("after: ", state.assignments[objIndex]);
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
        Creates an assignment and adds it to state.assignments
        Call with this.$store.dispatch("assignments/addAssignment", assignment);
        */
    addAssignment({ commit, rootState }, assignment) {
      return axios
        .post(`http://localhost:1337/assignments/`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("addAssignment", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /*
    Creates an assignment and adds it to the DB
    Call with this.$store.dispatch("assignments/saveAssignment", assignment);
    */
    saveAssignment({ commit, rootState }, assignment) {
      return axios
        .post(`http://localhost:1337/assignments/`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("addAssignment", response.data);
          commit("saveAssignment", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteAssignment({ commit, rootState }, assignmentID) {
      return axios
        .delete(`http://localhost:1337/assignments/${assignmentID}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("removeAssignment", response.data);
          commit("deleteAssignment", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
