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
    Maps the properties from strapi to variables used in highcharts
    */
    getAssignments: (state) => {
      const assignments = state.assignments.map((assignment) => {
        return {
          assignmentID: assignment.id,
          project: assignment.project.data,
          name: assignment.project.data.name,
          member: assignment.rse.data,
          parent: assignment.rse.data.id.toString(),
          start: Date.parse(assignment.start),
          end: Date.parse(assignment.end),
          FTE: Number(assignment.fte)
        };
      });

      // assignment with latest end is displayed first
      assignments.sort(function(a, b) {
        return b.end - a.end;
      });

      return assignments;
    },
    getSavedAssignments: (state) => {
      const assignments = state.savedAssignments.map((assignment) => {
        return {
          assignmentID: assignment.id,
          project: assignment.project.data,
          name: assignment.project.data ? assignment.project.data.name : '',
          member: assignment.rse.data,
          parent: assignment.rse.data.id.toString(),
          start: Date.parse(assignment.start),
          end: Date.parse(assignment.end),
          FTE: Number(assignment.fte)
        };
      });

      // assignment with latest end is displayed first
      assignments.sort(function(a, b) {
        return b.end - a.end;
      });

      return assignments;
    },
    /*
    Increment the max ID value by one when creating new assignments
    */
    getUID: (state) => {
      return (
        Math.max(...state.assignments.map((assignment) => assignment.id)) + 1
      );
    },
  },
  /*
  Call with this.$store.commit("assignments/{mutation}}", "{assignment}")
  */
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
    deleteAssignment(state, assignmentID) {
      state.savedAssignments = state.savedAssignments.filter(
        (item) => item.id !== assignmentID
      );
    },
    addAssignment: (state, assignment) => {
      state.assignments.push(assignment);
    },
    removeAssignment: (state, assignmentID) => {
      state.assignments = state.assignments.filter(
        (item) => item.id !== assignmentID
      );
    },
    updateAssignment: (state, assignment) => {
      let objIndex = state.savedAssignments.findIndex(
        (obj) => obj.id == assignment.id
      );

      if (objIndex > -1) {
        state.savedAssignments[objIndex] = assignment;
      }
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
        .get(`${process.env.VUE_APP_API_URL}/assignments/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getAssignments", response.data.data);
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
        .post(`${process.env.VUE_APP_API_URL}/assignments/`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("addAssignment", response.data.data);
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
        .post(`${process.env.VUE_APP_API_URL}/assignments/`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("saveAssignment", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteAssignment({ commit, rootState }, assignmentID) {
      return axios
        .delete(`${process.env.VUE_APP_API_URL}/assignments/${assignmentID}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("deleteAssignment", response.data.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateAssignment({ commit, rootState }, assignment) {
      return axios
        .put(`${process.env.VUE_APP_API_URL}/assignments/${assignment.id}`, assignment, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("updateAssignment", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
