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
    projects: [],
    project: {},
    assignments: [],
  },

  getters: {
    getProjects: (state) => {
      const projects = state.projects.map((project) => {
        const ganttItem = {};

        ganttItem.id = project.properties.hs_object_id;

        ganttItem.name = project.properties.dealname;

        ganttItem.start = Date.parse(project.properties.start_date)
          ? project.properties.start_date
          : Date.parse("2021-01-01T15:02:42.704Z");
        ganttItem.end = Date.parse(project.properties.end_date)
          ? project.properties.end_date
          : Date.parse("2021-12-31T15:02:42.704Z");

        ganttItem.amount = project.properties.amount;
        ganttItem.stage = project.properties.dealstage;
        ganttItem.faculty = project.properties.faculty;
        ganttItem.financeContact = project.properties.finance_contact;
        ganttItem.fundingBody = project.properties.funding_body;
        ganttItem.projectLead = project.properties.project_lead;
        ganttItem.projectValue = project.properties.project_value;
        ganttItem.school = project.properties.school; // use a loop and use their keys as new key

        return ganttItem;
      });

      //console.log(projects);
      return projects;
    },
  },

  mutations: {
    //sync, updates state
    getMembers(state, members) {
      state.members = members;
    },
    resetProjects(state) {
      state.projects = [];
    },
    resetProject(state) {
      state.project = [];
    },
    getProjects(state, projects) {
      //state.projects.push(projects);
      //state.projects = [...state.projects, ...projects];
      state.projects = projects;
    },
    getProject(state, project) {
      state.project = project;
    },
    getAssignments(state, assignments) {
      state.assignments = assignments;
    },
  },

  actions: {
    //async, commits mutations

    /*
    Gets member or members from DB
    Call with this.$store.dispatch("get/getMembers", "{id}");
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
          commit("getMembers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
    Gets projects from HubSpot
    Call with this.$store.dispatch("get/getProjects", [stages]);
    Can leave parameter empty and will call all projects
    Returns promise so can be used as async function
    */
    getProjects({ commit, rootState }, stages) {
      commit("resetProjects");

      if (!stages) {
        stages = [
          "allocated",
          "completed",
          "awaitingAllocation",
          "submittedToFunder",
        ];
      }
      let projects = [];
      let index = 0;

      return new Promise((resolve) => {
        stages.forEach((stage) => {
          axios
            .get(`http://localhost:1337/projects/`, {
              headers: {
                Authorization: `Bearer ${rootState.auth.jwt}`,
              },
              params: {
                stage: stage,
              },
            })
            .then((response) => {
              projects = [...projects, ...response.data]; // adds response to projects variable
              if (index === stages.length - 1) {
                // checks if the last stage has been itterated
                commit("getProjects", projects);
                console.log(projects);
                resolve();
              } else index++;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    },

    /*
    Gets project by ID from HubSpot
    Call with this.$store.dispatch("get/getProject", "{id}}");
    */
    getProject({ commit, rootState }, id = "") {
      commit("resetProject");

      axios
        .get(`http://localhost:1337/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          commit("getProject", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
    Gets assignment or assignments from DB
    Call with this.$store.dispatch("get/getAssignments", "{id}");
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
