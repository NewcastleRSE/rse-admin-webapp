//import router from "../../router";
import axios from 'axios'
import { DateTime } from 'luxon'

const initialState =  {
  assignments: [],
  created: [],
  edited: [],
  deleted: [],
}

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */

  state: { ...initialState },

  getters: {
    /*
    Return the current assignments
    */
    getAssignments: (state) => {
      const assignments = state.assignments.map((assignment) => {
        return {
          assignmentID: assignment.id,
          project: assignment.project,
          name: assignment.project.name,
          rse: assignment.rse,
          start: Date.parse(assignment.start),
          end: Date.parse(assignment.end),
          FTE: Number(assignment.fte)
        };
      });

      // assignment with latest end is displayed first
      assignments.sort(function(a, b) {
        return b.end - a.end;
      });

      return assignments;
    },
    /*
    Return the assignments marked for creation
    */
    getCreated: (state) => {
      return state.created
    },
    /*
    Return the assignments marked for update
    */
    getEdited: (state) => (id) => {
      return state.edited.find(assignment => assignment.id === id )
    },
    /*
    Return the assignments marked for deletion
    */
    getDeleted: (state) => (id) => {
      return state.deleted.find(assignment => assignment.id === id )
    },
    /*
    Return the current assignments for a given RSE
    */
    getCurrentAssignments: (state) => (rse) => {
      let assignments = state.assignments.filter(assignment => 
        assignment.rse === rse
        && DateTime.fromISO(assignment.start) <= DateTime.utc()
        && DateTime.fromISO(assignment.end) >= DateTime.utc())

      return assignments.sort(function(a, b) {
        DateTime.fromISO(b.end) - DateTime.fromISO(a.end)
      })
    },
    /*
    Return the assignments in a period for an optional RSE
    */
    getAssignmentsInPeriod: (state) => (start, end, rse) => {
      
      let assignments
      
      if(rse) {
        assignments = state.assignments.filter(assignment =>
          (assignment.rse === rse
          // assignment crosses start date provided
          && DateTime.fromISO(assignment.start) <= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(start)) ||
          (assignment.rse === rse
          // assignment crosses end date provided
          && DateTime.fromISO(assignment.start) <= DateTime.fromISO(end)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(end)) ||
          (assignment.rse === rse
          // assignment within start and end date provided
          && DateTime.fromISO(assignment.start) >= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) <= DateTime.fromISO(end))
        )
      }
      else {
        assignments = state.assignments.filter(assignment =>
          (DateTime.fromISO(assignment.start) <= DateTime.fromISO(start)
          && DateTime.fromISO(assignment.end) >= DateTime.fromISO(start)) ||
          (DateTime.fromISO(assignment.start) <= DateTime.fromISO(end)
            && DateTime.fromISO(assignment.end) >= DateTime.fromISO(end))
        )
      }

      return assignments.sort(function(a, b) {
        return DateTime.fromISO(b.end) - DateTime.fromISO(a.end)
      })
    }
  },
  /*
  Call with this.$store.commit("assignments/{mutation}}", "{assignment}")
  */
  mutations: {
    getAssignments(state, assignments) {
      state.assignments = assignments
    },
    addAssignment(state, assignment) {
      state.assignments.push(assignment)
    },
    createAssignment(state, assignment) {
      state.created.push(assignment)
    },
    editAssignment(state, assignment) {
      state.edited.push(assignment)
    },
    deleteAssignment(state, assignment) {
      const assignmentID = assignment.assignmentID
      state.deleted.push(assignment)
      state.assignments = state.assignments.filter(assignment => assignment.id !== assignmentID)
    },
    resetModifications: (state) => {
      state.created = []
      state.edited = []
      state.deleted = []
    },
    reset: (state) => {
      Object.assign(state, initialState)
    }
  },

  actions: {
    /*
    Uses the created, edited and deleted state to update the DB
    Call with this.$store.dispatch("assignments/commitAssignments");
    */
    commitAssignments({ commit, state, rootState }) {

      const promises = [],
            token = rootState.auth.jwt

      state.created.forEach(assignment => {
        
        const payload = {
          rse: assignment.rse.id,
          project: assignment.project.id,
          fte: assignment.fte,
          start: assignment.startDate,
          end: assignment.endDate
        }

        promises.push(axios.post(`${process.env.VUE_APP_API_URL}/assignments/`, { data: payload }, { headers: { Authorization: `Bearer ${token}`} }).then((newAssignment) => {
          commit('addAssignment', {
            createdAt: newAssignment.data.createdAt,
            end: newAssignment.data.end,
            fte: newAssignment.data.fte,
            id: newAssignment.data.id,
            project: {
              id: assignment.project.id,
              createdAt: assignment.project.createdAt,
              updatedAt: assignment.project.updatedAt,
              clockifyID: assignment.project.clockifyID,
              name: assignment.project.dealname,
              hubspotID: assignment.project.hubspotID
            },
            rse: assignment.rse.id,
            start: newAssignment.data.start,
            updatedAt: newAssignment.data.updatedAt
          })
        }))
      })

      state.edited.forEach(assignment => {
        promises.push(axios.put(`${process.env.VUE_APP_API_URL}/assignments/${assignment.assignmentID}`, assignment, { headers: { Authorization: `Bearer ${token}`} }))
      })

      state.deleted.forEach(assignment => {
        promises.push(axios.delete(`${process.env.VUE_APP_API_URL}/assignments/${assignment.assignmentID}`, { headers: { Authorization: `Bearer ${token}`} }))
      })

      Promise.all(promises).then(() => {
        commit('resetModifications')
      })
      .catch(err => {
        commit('resetModifications')
        console.error(err)
      })
    }
  },
};
