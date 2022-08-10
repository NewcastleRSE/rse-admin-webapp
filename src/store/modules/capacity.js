//import router from "../../router";
import axios from "axios"
import { DateTime } from "luxon"

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
        getUtilisation: (state, getters, rootState, rootGetters) => {
          let utilisation = [],
              startDate = DateTime.utc().startOf('month').minus({months: 12}),
              endDate = DateTime.utc().startOf('month').plus({month: 13})

          while(startDate.toISODate() !== endDate.toISODate()) {
            
            let capacities = state.capacity.filter(capacity => {
              let capacityStart = DateTime.fromISO(capacity.start),
                  capacityEnd = capacity.end ? DateTime.fromISO(capacity.end) : endDate

              return startDate >= capacityStart.startOf('month') && startDate <= capacityEnd.startOf('month')
            })

            let assignments = rootGetters['assignments/getAssignments'].filter(assignment => {
              let assignmentStart = DateTime.fromMillis(assignment.start),
                  assignmentEnd = assignment.end ? DateTime.fromMillis(assignment.end) : endDate

              return startDate >= assignmentStart && startDate <= assignmentEnd
            })
            
            let monthlyUtilisation = {
              date: startDate.toISODate(),
              capacityFTE: Math.round(capacities.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0)),
              targetFTE: Math.round(capacities.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0) * 0.7),
              actualFTE: Math.round(assignments.reduce(function (totalFTE, assignment) { return totalFTE + assignment.FTE }, 0)),
              capacityDays: Math.round(capacities.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0)),
              targetDays: Math.round(capacities.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0) * 0.7),
              actualDays: Math.round(assignments.reduce(function (totalDays, assignment) { return totalDays + ((220/12) * (assignment.FTE/100)) }, 0)),
            }

            utilisation.push(monthlyUtilisation)

            startDate = startDate.plus({months: 1})
          }

          return utilisation
        }
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
          commit("getCapacity", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}