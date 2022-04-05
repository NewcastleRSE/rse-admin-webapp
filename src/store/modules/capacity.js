//import router from "../../router";
import axios from "axios";

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
      console.log(id)
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