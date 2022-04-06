import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import assignments from "./modules/assignments";
import capacity from "./modules/capacity";
import projects from "./modules/projects";
import rses from "./modules/rses";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, assignments, capacity, projects, rses },

  plugins: [createPersistedState()],
});
