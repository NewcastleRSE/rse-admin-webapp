import { createStore } from "vuex";
import auth from "./modules/auth";
import get from "./modules/get";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, get },
});
