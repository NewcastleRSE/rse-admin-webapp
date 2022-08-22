import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import assignments from "./modules/assignments";
import capacity from "./modules/capacity";
import facility from "./modules/facility";
import projects from "./modules/projects";
import rses from "./modules/rses";
import timesheets from "./modules/timesheets";
import transactions from "./modules/transactions";

export default createStore({
  state: {},

  getters: {},

  mutations: {
    //sync, updates state
  },

  actions: {
    //async, commits mutations
  },

  modules: { auth, assignments, capacity, facility, projects, rses, timesheets, transactions },

  plugins: [createPersistedState()],
});
