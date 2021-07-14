import { createStore } from "vuex";
import auth from "./modules/auth";
import get from "./modules/get";
import assignments from "./modules/assignments";
import projects from "./modules/projects";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, get, assignments, projects },
});
