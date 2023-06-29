//import router from "../../router";
import axios from 'axios'
import * as qs from 'qs'

const initialState =  {
  projects: [], //check whether loading the projects once when loading the app is enough or every page switch
  project: {},
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
    Maps properties sent from HubSpot
    Call with this.$store.getters["projects/getProjects"]();
    */
    getProjects: (state) => (ids) => {
      if(ids && ids.length > 0) {
        const projects = state.projects.filter(project => { return ids.includes(project.id) })
        return projects.sort(function(a, b) {
          let textA = a.dealname.toUpperCase();
          let textB = b.dealname.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      }
      else {
        return state.projects.sort(function(a, b) {
          let textA = a.dealname.toUpperCase();
          let textB = b.dealname.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      }
      
    },
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["projects/getProject", "{id}"];
    */
    getProject: (state) => (id) => {
      return state.projects.find(project => project.id === id )
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
    reset: (state) => {
      Object.assign(state, initialState)
    }
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
  
          let response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}?${query}`, {
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
      commit("getProjects", [])
      commit("getProjects", await fetchProjects(0, 100));
    },
    /*
    Gets project by ID from HubSpot
    Call with this.$store.dispatch("projects/getProject", "{id}");
    */
    getProject({ commit, rootState }, id = "") {
      //commit("resetProject");

      axios
        .get(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
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
