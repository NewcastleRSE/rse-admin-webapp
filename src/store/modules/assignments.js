//import router from "../../router";
import axios from "axios";

export default {
    namespaced: true,

    /*
    Global Variables
    Call state with $store.state.{module}.{stateName}
    */
    state: {
        assignments: [],
        savedAssignments: [],
    },

    getters: {
        /*
            Maps properties from strapi to variables used in highcharts
            */
        getAssignments: (state) => {
            const assignments = state.assignments.map((assignment) => {
                const ganttItem = {};

                ganttItem.assignmentID = assignment.id;
                ganttItem.name = assignment.projectID;
                ganttItem.parent = assignment.member.id.toString();
                ganttItem.start = Date.parse(assignment.startDate);
                ganttItem.end = Date.parse(assignment.endDate);

                return ganttItem;
            });

            assignments.sort(function(a, b) {
                return b.end - a.end; // assignment with latest end is displayed first
            });

            return assignments;
        },
        getSavedAssignments: (state) => {
            const assignments = state.savedAssignments.map((assignment) => {
                const ganttItem = {};

                ganttItem.assignmentID = assignment.id;

                ganttItem.name = assignment.projectID;

                ganttItem.parent = assignment.member.id.toString();

                ganttItem.start = Date.parse(assignment.startDate);

                ganttItem.end = Date.parse(assignment.endDate);
                //ganttItem.projectID = assignment.projectID;

                return ganttItem;
            });

            assignments.sort(function(a, b) {
                return b.end - a.end; // assignment with latest end is displayed first
            }); // might not need sorting here

            return assignments;
        },
        getUID: (state) => {
            return (
                Math.max(...state.assignments.map((assignment) => assignment.id)) + 1
            );
        },
    },
    mutations: {
        getAssignments(state, assignments) {
            state.assignments = assignments;
            state.savedAssignments = assignments; // should only be called once when loading app
        },
        resetAssignments(state) {
            state.assignments = state.savedAssignments;
        },

        saveAssignment(state, assignment) {
            state.savedAssignments = [...state.savedAssignments, assignment];
        },
        deleteAssignment(state, assignmentID) {
            state.savedAssignments = state.savedAssignments.filter(
                (item) => item.id !== assignmentID
            );
        },
        addAssignment: (state, assignment) => {
            state.assignments.push(assignment);
        },
        removeAssignment: (state, assignmentID) => {
            state.assignments = state.assignments.filter(
                (item) => item.id !== assignmentID
            );
        },
        updateAssignment: (state, assignment) => {
            let objIndex = state.savedAssignments.findIndex(
                (obj) => obj.id == assignment.id
            );

            if (objIndex > -1) {
                state.savedAssignments[objIndex] = assignment;
            }
        },
    },

    actions: {
        /*
            Gets assignment or assignments from DB
            Call with this.$store.dispatch("assignments/getAssignments", "{id}");
            Can leave parameter empty and will call all assignments
            */
        getAssignments({ commit, rootState }, id = "") {
            axios
                .get(`http://localhost:1337/assignments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    commit("getAssignments", response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        /*
            Creates an assignment and adds it to state.assignments
            Call with this.$store.dispatch("assignments/addAssignment", assignment);
            */
        addAssignment({ commit, rootState }, assignment) {
            return axios
                .post(`http://localhost:1337/assignments/`, assignment, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    commit("addAssignment", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        /*
        Creates an assignment and adds it to the DB
        Call with this.$store.dispatch("assignments/saveAssignment", assignment);
        */
        saveAssignment({ commit, rootState }, assignment) {
            return axios
                .post(`http://localhost:1337/assignments/`, assignment, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    //commit("addAssignment", response.data);
                    commit("saveAssignment", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deleteAssignment({ commit, rootState }, assignmentID) {
            return axios
                .delete(`http://localhost:1337/assignments/${assignmentID}`, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    //commit("removeAssignment", response.data.id);
                    commit("deleteAssignment", response.data.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        updateAssignment({ commit, rootState }, assignment) {
            return axios
                .put(`http://localhost:1337/assignments/${assignment.id}`, assignment, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    commit("updateAssignment", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};