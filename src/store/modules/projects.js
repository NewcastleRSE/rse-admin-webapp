//import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {
    projects: [], //check whether loading the projects once when laoding the app is enough or every page switch
    project: {},
  },

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["projects/getProjects"];
    */
    getProjects: (state) => {
      const stages = [
        ["Funded Awaiting Allocation", "closedwon"],
        ["Not Funded", "closedlost"],
        ["Allocated", "0fd81f66-7cda-4db7-b2e8-b0114be90ef9"],
        ["Completed", "09b510b5-6871-4771-ad09-1438ce8e6f11"],
      ];

      const projects = state.projects.map((project) => {
        const ganttItem = {};

        ganttItem.id = project.properties.hs_object_id;

        ganttItem.name = project.properties.dealname;

        ganttItem.start = Date.parse(project.properties.start_date)
          ? project.properties.start_date
          : Date.parse("2020-01-01");
        ganttItem.end = Date.parse(project.properties.end_date)
          ? project.properties.end_date
          : Date.parse("2022-12-31");

        // converts hubspot stage names to english
        stages.forEach((stage) => {
          if (project.properties.dealstage === stage[1])
            ganttItem.stage = stage[0];
        });

        ganttItem.amount = project.properties.amount;
        ganttItem.faculty = project.properties.faculty;
        ganttItem.financeContact = project.properties.finance_contact;
        ganttItem.fundingBody = project.properties.funding_body;
        ganttItem.projectLead = project.properties.project_lead;
        ganttItem.projectValue = project.properties.project_value;
        ganttItem.school = project.properties.school;

        return ganttItem;
      });

      //console.log(projects);
      return projects;
    },
  },

  mutations: {
    //sync, updates state
    getProjects(state, projects) {
      //state.projects.push(projects);
      //state.projects = [...state.projects, ...projects];
      state.projects = projects;
    },
    getProject(state, project) {
      state.project = project;
    },
  },

  actions: {
    //async, commits mutations

    /*
    Gets projects from HubSpot
    Call with this.$store.dispatch("get/getProjects", [stages]);
    Can leave parameter empty and will call all projects
    Returns promise so can be used as async function
    */
    getProjects({ commit, rootState }, stages) {
      //commit("resetProjects");

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
  },
};
