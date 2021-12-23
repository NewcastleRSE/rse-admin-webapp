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
    login(state, jwt) {
      localStorage.setItem("jwt", jwt);
      state.jwt = jwt;
      this.dispatch("projects/getProjects", ['allocated'])
      this.dispatch("members/getMembers")
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
      const url =
      process.env.VUE_APP_API_URL + "/auth/microsoft/callback/?access_token=" + accessToken;
      axios
        .get(url)
        .then((res) => {
          commit("login", res.data.jwt);
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
