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
      router.push({ name: "Dashboard" });
      //this.$router.replace({ name: "Dashboard" });
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
  },
};
