import { createStore } from "vuex";
import auth from "./modules/auth";
import getters from "./modules/getters";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, getters },
});
