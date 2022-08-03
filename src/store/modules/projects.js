//import router from "../../router";
import axios from 'axios'
import * as qs from 'qs'

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {
    projects: [], //check whether loading the projects once when loading the app is enough or every page switch
    project: {},
  },

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["projects/getProjects"];
    */
    getProjects: (state) => {
      return state.projects.sort(function(a, b) {
          let textA = a.dealname.toUpperCase();
          let textB = b.dealname.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    },
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["projects/getProject", "{id}"];
    */
    getProject: (state) => (id) =>{
      return state.projects.find((project) => {
        if (project.id === id) {
          return project;
        }
      })
    }
  },

  mutations: {
    //sync, updates state
    getProjects(state, projects) {
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
    async getProjects({ commit, rootState }, id = "") {
      let projects = []

      const fetchProjects = async function (page, pageSize, populate) {

          const query = qs.stringify({
              pagination: {
                page: page,
                pageSize: pageSize,
              },
              populate: populate
            },{
              encodeValuesOnly: true,
            });
  
          let response = await axios.get(`${process.env.VUE_APP_API_URL}/projects/${id}?${query}`, {
            headers: {
              Authorization: `Bearer ${rootState.auth.jwt}`,
            }})
          
            projects = projects.concat(response.data.data)
          const pagination = response.data.meta.pagination

          if(pagination.page < pagination.pageCount) {
            return await fetchProjects(pagination.page + 1, pageSize)
          }
          else {
            return projects
          }
      }

      commit("getProjects", await fetchProjects(0, 100));
    },
    /*getProjects({ commit, rootState }, stages) {
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

              projects = [...projects, ...response.data.data];

              // checks if the last stage has been itterated
              if (index === stages.length - 1) {
                commit("getProjects", projects);
                resolve();
              } else index++;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    },*/

    /*
    Gets project by ID from HubSpot
    Call with this.$store.dispatch("projects/getProject", "{id}");
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
          commit("getProject", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
