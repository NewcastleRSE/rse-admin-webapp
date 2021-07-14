import { createStore } from "vuex";
import auth from "./modules/auth";
import get from "./modules/get";
import assignments from "./modules/assignments";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, get, assignments },
});
