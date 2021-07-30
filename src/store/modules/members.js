//import router from "../../router";
import axios from "axios";

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
        /*
            Maps properties from strapi to variables used in highcharts
            */
        getMembers: (state) => {
            const members = state.members.map((members) => {
                const ganttItem = {};

                ganttItem.id = members.id.toString();

                ganttItem.name = members.firstname + " " + members.surname;

                ganttItem.start = Date.parse(members.startDate);

                ganttItem.email = members.email;

                ganttItem.team = members.Team;

                ganttItem.collapsed = true;

                return ganttItem;
            });
            return members;
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
                .get(`http://localhost:1337/members/${id}`, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.jwt}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    commit("getMembers", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};