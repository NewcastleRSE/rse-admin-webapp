//import router from "../../router";
import axios from "axios";

function availability(member, assignments) {

  // Temp hack until property added to API
  let contractFTE = 100

  if(member.firstname === 'Tiago') {
    contractFTE = 50
  }

  let availability = {
    allocated: [],
    from: new Date(),
    to: null,
    FTE: contractFTE
  }

  if(assignments.length > 0) {

    assignments.sort(function(a,b) { return new Date(a.start) - new Date(b.start) });

    let startDate = new Date()
    let endDate = new Date(Math.max(...Array.from(assignments, assignment => new Date(assignment.end))))
  
    let years = endDate.getFullYear() - startDate.getFullYear(),
        months = (years * 12) + (endDate.getMonth() + 1),
        allocated = new Array(months).fill(0)
  
    assignments.forEach(assignment => {
  
      let start = new Date(assignment.start) > new Date() ? new Date(assignment.start) : new Date(),
          length = monthDiff(start,new Date(assignment.end)) + 1,
          offset = monthDiff(new Date(),new Date(assignment.start))
      
      // if offset is negative set to zero
      offset = offset < 0 ? 0 : offset
  
      // console.log("Name: " + assignment.name )
      // console.log("Length: " + length + ", (" + start.getMonth() + " to " + new Date(assignment.end).getMonth()+ ")")
      // console.log("Offset: " + offset )
  
      for (let i = offset; i < (length + offset); i++) {
        if(allocated[i] + assignment.FTE > contractFTE) {
          console.error(`Invalid monthly load (${allocated[i] + assignment.FTE}%). Availability cannot be over 100%`)
        }
        allocated[i] = allocated[i] + assignment.FTE
      }
  
    })

    let nextAvailableMonth = allocated.findIndex((fte) => fte < contractFTE),
        nextAvailableYear = nextAvailableMonth > -1 ? new Date().getFullYear() + Math.floor(nextAvailableMonth/12) : null,
        nextAvailableFTE = nextAvailableUntil > -1 ? allocated.find((fte) => fte < contractFTE) : 0,
        nextAvailableUntil = nextAvailableUntil > -1 ? allocated.indexOf(contractFTE, nextAvailableMonth) : null

    availability.from = nextAvailableMonth > -1 ? new Date([nextAvailableYear, nextAvailableMonth + 1, 1]) : null,
    availability.to = nextAvailableUntil > -1 ? new Date([nextAvailableYear, nextAvailableUntil + 1, 1]) : null
    availability.FTE = nextAvailableFTE
    availability.allocated = allocated

    // Set available from today if possible start date is in the past
    if(availability.from && availability.from < new Date()) {
      availability.from = new Date()
    }
  }

  return availability;
}

function monthDiff(dateFrom, dateTo) {
  return dateTo.getMonth() - dateFrom.getMonth() + 
    (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
 }

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
        members: [],
    },

    getters: {
        getMembers: (state) => {
            state.members.sort(function(a, b) {
                return a.surname.localeCompare(b.surname);
            });

            const members = state.members.map((member) => {
                const ganttItem = {};

                ganttItem.id = member.id.toString();
                ganttItem.name = member.firstname + " " + member.surname;
                ganttItem.team = member.Team;
                ganttItem.email = member.email;
                ganttItem.collapsed = true;

                return ganttItem;
            });

            return members;
        },
        getFullMembers: (state, getters, rootState, rootGetters) => {

          state.members.sort(function(a, b) {
              return a.surname.localeCompare(b.surname);
          });

          return state.members.map((member) => {
              member.availability = availability(member, rootGetters['assignments/getAssignments'].filter(assignment => assignment.member.id === member.id && new Date(assignment.end) > new Date()))
              return member
          }); 
        },
    },

    mutations: {
        //sync, updates state
        getMembers(state, members) {
          state.members = members;
        },
    },

    actions: {
        //async, commits mutations

    /*
    Gets member or members from DB
    Call with this.$store.dispatch("members/getMembers", "{id}");
    Can leave parameter empty and will call all members
    */
    getMembers({ commit, rootState }, id = "") {
      axios
        .get(`${process.env.VUE_APP_API_URL}/members/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getMembers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}