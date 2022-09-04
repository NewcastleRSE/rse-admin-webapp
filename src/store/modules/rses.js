//import router from "../../router";
import axios from 'axios'
import * as qs from 'qs'
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
          return state.rses.sort(function(a, b) {
            return a.lastname.localeCompare(b.lastname);
          });
        },
        getRse: (state) => (name) => {
          return state.rses.find(rse => `${rse.firstname.replace(/\s+/g, '-').toLowerCase()}-${rse.lastname.replace(/\s+/g, '-').toLowerCase()}` == name);
        },
        getRseByID: (state) => (id) => {
          return state.rses.find(rse => rse.id == id);
        },
        nextRSE: (state) => {
          let fullTeam = state.rses.filter(rse => rse.nextAvailableDate && rse.active)
          fullTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let index = 0

          if(`${fullTeam[0].firstname} ${fullTeam[0].lastname}` === 'Mark Turner') {
            index = 1
          }
          
          let nextRSE = fullTeam[index]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
          return nextRSE
        },
        nextWebMobile: (state) => {
          let webMobileTeam = state.rses.filter(rse => rse.team === 'WebMobile' && rse.nextAvailableDate && rse.active)
          webMobileTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let index = 0

          if(`${webMobileTeam[0].firstname} ${webMobileTeam[0].lastname}` === 'Mark Turner') {
            index = 1
          }
          
          let nextRSE = webMobileTeam[index]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
          return nextRSE
        },
        nextMiddleware: (state) => {
          let middlewareTeam = state.rses.filter(rse => rse.team === 'Middleware' && rse.nextAvailableDate && rse.active)
          middlewareTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = middlewareTeam[0]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
          return nextRSE
        },
        nextDataScience: (state) => {
          let dataScienceTeam = state.rses.filter(rse => rse.team === 'DataScience' && rse.nextAvailableDate && rse.active)
          dataScienceTeam.sort((a, b) => { return DateTime.fromISO(a.nextAvailableDate) - DateTime.fromISO(b.nextAvailableDate) } )
          
          let nextRSE = dataScienceTeam[0]
          nextRSE.wait = DateTime.fromISO(nextRSE.nextAvailableDate).diff(DateTime.now(), ['months', 'days']).toObject()
          
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
    async getRses({ commit, rootState }, id = "") {
      let rses = []

      const fetchRses = async function (page, pageSize, populate) {

          const query = qs.stringify({
              pagination: {
                page: page,
                pageSize: pageSize,
              },
              populate: populate
            },{
              encodeValuesOnly: true,
            });
  
          let response = await axios.get(`${process.env.VUE_APP_API_URL}/rses/${id}?${query}`, {
            headers: {
              Authorization: `Bearer ${rootState.auth.jwt}`,
            }})
          
          rses = rses.concat(response.data.data)
          const pagination = response.data.meta.pagination

          if(pagination.page < pagination.pageCount) {
            return await fetchRses(pagination.page + 1, pageSize, populate)
          }
          else {
            return rses
          }
      }

      let RSEs = await fetchRses(0, 100, ['assignments', 'assignments.project']),
          assignments = []

      RSEs.forEach(RSE => {

        RSE.assignments.data.forEach(assignment => {
          let project = assignment.project.data
          delete assignment.project
          assignment.project = project
          assignment.rse = RSE.id
        })

        assignments = assignments.concat(RSE.assignments.data)
      })

      commit('assignments/getAssignments', assignments, { root: true })
      commit("getRses", RSEs)
    }
  }
}