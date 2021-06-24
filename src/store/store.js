import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import axios from "axios";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: null,
  },

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
    login(_, credentials) {
      console.log(cresentials.accessToken);
      const url =
        "http://localhost:1337/auth/microsoft/callback/?access_token=" +
        credentials.accessToken;

      axios
        .get(url)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  modules: {
    auth,
  },
});
