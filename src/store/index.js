import { createStore } from "vuex";
import auth from "./modules/auth";
import assignments from "./modules/assignments";
import projects from "./modules/projects";
import members from "./modules/members";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, assignments, projects, members },
});
