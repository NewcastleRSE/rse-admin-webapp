//import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    members: [],
    projects: [],
    assignments: [],
  },

  getters: {},

  mutations: {
    //sync, updates state
    getMembers(state, members) {
      state.members = members;
    },
    getProjects(state, projects) {
      state.projects = projects;
    },
    getAssignments(state, assignments) {
      state.assignments = assignments;
    },
  },

  actions: {
    //async, commits mutations
    getMembers({ commit, rootState }) {
      axios
        .get("http://localhost:1337/members", {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("getMembers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjects({ commit, rootState }) {
      axios
        .get("http://localhost:1337/projects", {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("getProjects", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAssignments({ commit, rootState }) {
      axios
        .get("http://localhost:1337/assignments", {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("getAssignments", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
