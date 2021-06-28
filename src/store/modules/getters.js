//import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    members: [],
  },

  getters: {},

  mutations: {
    //sync, updates state
    getMembers(state, members) {
      state.members = members;
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
  },
};
