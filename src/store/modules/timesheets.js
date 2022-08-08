import axios from "axios"
import { DateTime } from 'luxon'

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
      summary: {},
      detailed: {},
      overview: [],
      bankHolidays: []
    },

    getters: {
        getSummary: (state) => {
            return state.summary
        },
        getDetailed: (state) => {
          return state.detailed
        },
        getOverview: (state, getters, rootState, rootGetters) => {
          const rses = rootGetters["rses/getRses"].filter(rse => rse.clockifyID && rse.active),
                timesheetSummary = state.summary,
                bankHolidays = state.bankHolidays
        
          let now = DateTime.utc(),
              startDate = now.minus({days: 30}),
              workdays = 0,
              timeDistribution = []

          // Add up all the non-weekend days
          while(startDate.toISODate() !== now.toISODate()) {

            let bankHoliday = bankHolidays.find(holiday => holiday.date === startDate.toISODate())
            workdays = startDate.weekday < 6 && !bankHoliday ? workdays + 1 : workdays
            startDate = startDate.plus({days: 1})
          }

          rses.forEach(rse => {
            let summary = timesheetSummary.team.find(summary => summary._id === rse.clockifyID),
                assignments = rootGetters["assignments/getCurrentAssignments"](rse.id)
            
            // console.log(summary)

            let rseDistribution = {
              rse: rse,
              warning: false,
              distribution: []
            }

            // Captures times against assigned projects
            assignments.forEach(assignment => {

              let timeEntries = summary && summary.children ? summary.children.find(timesheet => timesheet._id === assignment.project.clockifyID) : null

              let actuals = {
                name: assignment.project.name,
                targetTime: ((workdays * 7.5) * 3600) * (assignment.fte / 100),
                targetFTE: assignment.fte
              }

              if(timeEntries) {
                actuals.actualTime = timeEntries.duration
                actuals.actualFTE = timeEntries.duration/(((workdays * 7.5) * 3600) * (assignment.fte / 100)) * 100
              }
              else {
                actuals.actualTime = 0
                actuals.actualFTE = 0
              }

              rseDistribution.distribution.push(actuals)
            })

            // Captures times against unassigned projects
            if(summary && summary.children) {
              summary.children.forEach(timeEntry => {
                if(!rseDistribution.distribution.find(entry => entry.name === timeEntry.name))
                rseDistribution.distribution.push({
                  name: timeEntry.name,
                  targetTime: 0,
                  targetFTE: 0,
                  actualTime: timeEntry.duration,
                  actualFTE: null
                })
              })
            }

            console.log(rseDistribution)
            timeDistribution.push(rseDistribution)
          })

          return timeDistribution.sort(function(a, b) {
            return a.rse.lastname.localeCompare(b.rse.lastname);
          });

        },
        getBankHolidays: (state) => {
          return state.bankHolidays
        },
    },

    mutations: {
        //sync, updates state
        setSummary(state, summary) {
          state.summary = summary
        },
        setDetailed(state, detailed) {
          state.detailed = detailed
        },
        setOverview(state, overview) {
          state.overview = overview
        },
        setBankHolidays(state, bankHolidays) {
          state.bankHolidays = bankHolidays
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
            fetch('https://www.gov.uk/bank-holidays.json')
            .then((response) => response.json())
            .then(data => {
              commit("setDetailed", data['england-and-wales'].events)
              if(id) {
                commit("setDetailed", response.data)
              }
              else {
                commit("setSummary", response.data)
              }
            })
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }
}