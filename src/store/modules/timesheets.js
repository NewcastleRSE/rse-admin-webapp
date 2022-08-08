import axios from "axios"

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
      summary: {},
      detailed: {}
    },

    getters: {
        getSummary: (state) => {
            return state.summary
        },
        getDetailed: (state) => {
          return state.detailed
      },
    },

    mutations: {
        //sync, updates state
        getSummary(state, summary) {
          state.summary = summary
        },
        getDetailed(state, detailed) {
          state.detailed = detailed
        },
    },

    actions: {
        //async, commits mutations

    /*
    Gets capacities or capacity from DB
    Call with this.$store.dispatch("capacity/getCapacity", "{id}");
    Can leave parameter empty and will call all capacity
    */
    getReport({ commit, rootState }, id = "") {
      axios
        .get(`${process.env.VUE_APP_API_URL}/timesheets/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          if(id) {
            commit("getDetailed", response.data)
          }
          else {
            commit("getSummary", response.data)
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }
}