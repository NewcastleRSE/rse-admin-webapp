//import router from "../../router";
import axios from "axios"
import { DateTime } from "luxon"

const initialState =  {
  capacity: []
}

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: { ...initialState },

    getters: {
        getCapacity: (state) => {
            return state.capacity;
        },
        getCapacityInPeriod: (state) => (start, end, rse) => {
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
        getUtilisation: (state, getters, rootState, rootGetters) => (startDate, endDate) => {
          let utilisation = []

          while(startDate < endDate) {
            
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

            // Expand assignments to include full HubSpot project details
            assignments.forEach(assignment => {
              assignment.project = rootGetters['projects/getProject'](assignment.project.id)
            })

            let monthlyUtilisation = {
              date: startDate.toISODate(),
              capacityFTE: Math.round(capacities.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0)),
              targetFTE: Math.round(capacities.reduce(function (totalFTE, rse) { return totalFTE + rse.capacity }, 0) * 0.7),
              actualFTE: Math.round(assignments.reduce(function (totalFTE, assignment) { return totalFTE + assignment.FTE }, 0)),
              facilityFTE: Math.round(assignments.reduce(function (facilityFTE, assignment) { return assignment.project.costModel === 'Facility' ? (facilityFTE + assignment.FTE) : facilityFTE + 0}, 0)),
              nonFacilityFTE: Math.round(assignments.reduce(function (nonFacilityFTE, assignment) { return assignment.project.costModel !== 'Facility' ? (nonFacilityFTE + assignment.FTE) : nonFacilityFTE + 0 }, 0)),
              capacityDays: Math.round(capacities.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0)),
              targetDays: Math.round(capacities.reduce(function (totalDays, rse) { return totalDays + ((220/12) * (rse.capacity/100)) }, 0) * 0.7),
              actualDays: Math.round(assignments.reduce(function (totalDays, assignment) { return totalDays + ((220/12) * (assignment.FTE/100)) }, 0)),
              facilityDays: Math.round(assignments.reduce(function (facilityDays, assignment) { return assignment.project.costModel === 'Facility' ? (facilityDays + ((220/12) * (assignment.FTE/100))) : facilityDays + 0}, 0)),
              nonFacilityDays: Math.round(assignments.reduce(function (nonFacilityDays, assignment) { return assignment.project.costModel !== 'Facility' ? (nonFacilityDays + ((220/12) * (assignment.FTE/100))) : nonFacilityDays + 0 }, 0))
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
        reset: (state) => {
          Object.assign(state, initialState)
        }
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