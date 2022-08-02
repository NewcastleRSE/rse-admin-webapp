//import router from "../../router";
import axios from "axios";
import { DateTime } from "luxon";

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
        rses: [],
    },

    getters: {
        getRses: (state) => {
            state.rses.sort(function(a, b) {
                return a.lastname.localeCompare(b.lastname);
            });

            const rses = state.rses.map((rse) => {
                const ganttItem = {};

                ganttItem.id = rse.id.toString();
                ganttItem.name = rse.firstname + " " + rse.lastname;
                ganttItem.team = rse.Team;
                ganttItem.email = rse.email;
                ganttItem.collapsed = true;

                return ganttItem;
            });

            return rses;
        },
        getFullRses: (state) => {
          state.rses.sort(function(a, b) {
              return a.lastname.localeCompare(b.lastname);
          });
        },
        nextRSE: (state) => {
          let fullTeam = state.rses.filter(rse => rse.nextAvailableDate)
          fullTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = fullTeam[0],
              wait = DateTime.now().diff(DateTime.fromISO(nextRSE.nextAvailableDate), ['months', 'days']).toObject()

          nextRSE.wait = `${wait.months} Months ${Math.floor(wait.days)} Days`
          
          return nextRSE
        },
        nextWebMobile: (state) => {
          let webMobileTeam = state.rses.filter(rse => rse.team === 'WebMobile' && rse.nextAvailableDate)
          webMobileTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = webMobileTeam[0],
          wait = DateTime.now().diff(DateTime.fromISO(nextRSE.nextAvailableDate), ['months', 'days']).toObject()

          nextRSE.wait = `${wait.months} Months ${Math.floor(wait.days)} Days`
          
          return nextRSE
        },
        nextMiddleware: (state) => {
          let middlewareTeam = state.rses.filter(rse => rse.team === 'Middleware' && rse.nextAvailableDate)
          middlewareTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = middlewareTeam[0],
          wait = DateTime.now().diff(DateTime.fromISO(nextRSE.nextAvailableDate), ['months', 'days']).toObject()

          nextRSE.wait = `${wait.months} Months ${Math.floor(wait.days)} Days`
          
          return nextRSE
        },
        nextDataScience: (state) => {
          let dataScienceTeam = state.rses.filter(rse => rse.team === 'DataScience' && rse.nextAvailableDate)
          dataScienceTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = dataScienceTeam[0],
          wait = DateTime.now().diff(DateTime.fromISO(nextRSE.nextAvailableDate), ['months', 'days']).toObject()

          nextRSE.wait = `${wait.months} Months ${Math.floor(wait.days)} Days`
          
          return nextRSE
        }
    },

    mutations: {
        //sync, updates state
        getRses(state, rses) {
          state.rses = rses;
        },
    },

    actions: {
        //async, commits mutations

    /*
    Gets rse or rses from DB
    Call with this.$store.dispatch("rses/getRses", "{id}");
    Can leave parameter empty and will call all rses
    */
    getRses({ commit, rootState }, id = "") {
      axios
        .get(`${process.env.VUE_APP_API_URL}/rses/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getRses", response.data.data );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}