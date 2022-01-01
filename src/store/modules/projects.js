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

        ganttItem.id = project.hs_object_id;

        ganttItem.name = project.dealname;

        ganttItem.start = Date.parse(project.start_date)
          ? project.start_date
          : Date.parse("2020-01-01");
        ganttItem.end = Date.parse(project.end_date)
          ? project.end_date
          : Date.parse("2022-12-31");

        // converts hubspot stage names to english
        stages.forEach((stage) => {
          if (project.dealstage === stage[1])
            ganttItem.stage = stage[0];
        });

        ganttItem.amount = project.amount;
        ganttItem.faculty = project.faculty;
        ganttItem.financeContact = project.finance_contact;
        ganttItem.fundingBody = project.funding_body;
        ganttItem.projectLead = project.project_lead;
        ganttItem.projectValue = project.project_value;
        ganttItem.school = project.school;
        ganttItem.status = project.status;

        return ganttItem;
      });

      return projects.sort(function(a, b) {
          let textA = a.name.toUpperCase();
          let textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
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
    Call with this.$store.dispatch("projects/getProjects", [stages]);
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

      let rawData = [];
      let index = 0;

      return new Promise((resolve) => {
        stages.forEach((stage) => {

          let params = new URLSearchParams();
          params.append("stage", stage);

          axios
            .get(`${process.env.VUE_APP_API_URL}/projects/`, {
              headers: {
                Authorization: `Bearer ${rootState.auth.jwt}`,
              },
              params: params,
            })
            .then((response) => {

              rawData = [...rawData, ...response.data];

              // checks if the last stage has been itterated
              if (index === stages.length - 1) {

                let projects = []
                
                rawData.forEach((rawProject) => {
                  let project = rawProject.properties
                  project.archived = rawProject.archived
                  project.createdAt = rawProject.createdAt
                  project.updatedAt = rawProject.updatedAt
                  project.id = rawProject.id

                  projects.push(project)
                })

                commit("getProjects", projects);
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
    Call with this.$store.dispatch("projects/getProject", "{id}}");
    */
    getProject({ commit, rootState }, id = "") {
      //commit("resetProject");

      axios
        .get(`${process.env.VUE_APP_API_URL}/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.jwt}`,
          },
        })
        .then((response) => {
          commit("getProject", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
