//import router from "../../router";
import axios from 'axios'

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {
    facility: []
  },

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["facility/getFacility"];
    */
    getFacility: (state) => (year = null) => {
      try {
        if(year) {
          return state.facility.find(facility => facility.year === year)
        }
        else {
          return state.facility
        }
      }
      catch (err) {
        return null
      }  
    },
  },

  mutations: {
    //sync, updates state
    getFacility(state, facility) {
      state.facility = facility;
    },
  },

  actions: {
    //async, commits mutations

    /*
    Gets facility by ID from HubSpot
    Call with this.$store.dispatch("facility/getFacility", "{id}");
    */
    getFacility({ commit, rootState }, id = "") {
      axios
        .get(`${process.env.VUE_APP_API_URL}/facilities/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getFacility", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
