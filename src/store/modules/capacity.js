//import router from "../../router";
import axios from "axios"
import { DateTime } from "luxon";

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
        capacity: [],
    },

    getters: {
        getCapacity: (state) => {
            return state.capacity;
        },
        getCapacityInPeriod: (state) => (rse, start, end) => {
          return state.capacity.filter(capacity =>
            (
              capacity.rse.data.id === rse &&
              DateTime.fromISO(capacity.start) <= DateTime.fromISO(start) && 
              (
                DateTime.fromISO(capacity.end) >= DateTime.fromISO(start) || !capacity.end
              )
            ) ||
            (
              capacity.rse.data.id === rse &&
              DateTime.fromISO(capacity.start) <= DateTime.fromISO(end) &&
              (
                DateTime.fromISO(capacity.end) >= DateTime.fromISO(end) || !capacity.end
              )
            )
          )
        },
    },

    mutations: {
        //sync, updates state
        getCapacity(state, capacity) {
          state.capacity = capacity;
        },
    },

    actions: {
        //async, commits mutations

    /*
    Gets capacities or capacity from DB
    Call with this.$store.dispatch("capacity/getCapacity", "{id}");
    Can leave parameter empty and will call all capacity
    */
    getCapacity({ commit, rootState }, id = "") {
      axios
        .get(`${process.env.VUE_APP_API_URL}/capacities/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getCapacity", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}