import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
//import axios from "axios";
import router from "../router/index";

Vue.use(Vuex).use(router);

export const store = new Vuex.Store({
  state: {
    auth: false,
    jwt: null,
  },

  getters: {},

  mutations: {
    //sync, updates state
    setAuth(state, status) {
      state.auth = status;
    },
  },

  actions: {
    //async, commits mutations
  },

  modules: {
    auth,
  },
});
