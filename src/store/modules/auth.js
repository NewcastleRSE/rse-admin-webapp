import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    jwt: localStorage.getItem("jwt"),
  },

  getters: {},

  mutations: {
    //sync, updates state
    login(state, data) {
      localStorage.setItem("jwt", data.jwt);
      state.jwt = data.jwt;
      state.user = data.user;
      state.accessToken = data.accessToken;
      this.dispatch("projects/getProjects")
      this.dispatch("capacity/getCapacity")
      this.dispatch("rses/getRses")
      this.dispatch("assignments/getAssignments")
      router.push({ name: "Dashboard" });
    },
    logout(state) {
      localStorage.removeItem("jwt");
      state.jwt = null;
      router.push({ name: "Login" });
    },
  },

  actions: {
    //async, commits mutations
    login({ commit }, accessToken) {
      const url = process.env.VUE_APP_API_URL + "/auth/microsoft/callback/?access_token=" + accessToken;
      axios
        .get(url)
        .then((res) => {
          res.data.accessToken = accessToken
          commit("login", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    logout({ commit }) {
      commit("logout")
    }
  },
};
