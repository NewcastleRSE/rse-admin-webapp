//import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    members: [],
    projects: [],
    project: {},
    assignments: [],
  },

  getters: {},

  mutations: {
    //sync, updates state
    getMembers(state, members) {
      state.members = members;
    },
    resetProjects(state) {
      state.projects = [];
    },
    getProjects(state, projects) {
      //state.projects.push(projects);
      state.projects = [...state.projects, ...projects];
    },
    getProject(state, project) {
      state.project = project;
    },
    getAssignments(state, assignments) {
      state.assignments = assignments;
    },
  },

  actions: {
    //async, commits mutations

    /*
    Gets member or members from DB
    Call with this.$store.dispatch("getters/getMembers", "{id}");
    Can leave parameter empty and will call all members
    */
    getMembers({ commit, rootState }, id = "") {
      axios
        .get(`http://localhost:1337/members/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getMembers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
    Gets projects from HubSpot
    Call with this.$store.dispatch("getters/getProjects", [stages]);
    Can leave parameter empty and will call all projects
    */
    getProjects({ commit, rootState }, stages) {
      commit("resetProjects"); // clears projects because response adds to state

      if (!stages) {
        stages = [
          "allocated",
          "completed",
          "awaitingAllocation",
          "submittedToFunder",
        ];
      }
      stages.forEach((stage) => {
        axios
          .get(`http://localhost:1337/projects/`, {
            headers: {
              Authorization: `Bearer ${rootState.auth.jwt}`,
            },
            params: {
              stage: stage,
            },
          })
          .then((response) => {
            commit("getProjects", response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    /*
    Gets project by ID from HubSpot
    Call with this.$store.dispatch("getters/getProject", "{id}}");
    */
    getProject({ commit, rootState }, id = "") {
      axios
        .get(`http://localhost:1337/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("getProject", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
    Gets assignment or assignments from DB
    Call with this.$store.dispatch("getters/getAssignments", "{id}");
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
