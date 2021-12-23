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
          console.log(response.data);
          commit("getMembers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
}