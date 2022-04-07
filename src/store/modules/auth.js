import router from "../../router";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    jwt: localStorage.getItem("jwt"),
  },

  getters: {},

  mutations: {
    //sync, updates state
    login(state, data) {
      state.accessToken = data.accessToken
      state.jwt = data.jwt
      state.user = data.profile
      state.user.photo = data.photo
      this.dispatch("projects/getProjects")
      this.dispatch("capacity/getCapacity")
      this.dispatch("rses/getRses")
      this.dispatch("assignments/getAssignments")
      router.push({ name: "Dashboard" });
    },
    logout(state) {
      localStorage.removeItem("jwt");
      state.jwt = null;
      router.push({ name: "Login" });
    },
  },

  actions: {
    //async, commits mutations
    login({ commit }, accessToken) {
      const loginUrl = process.env.VUE_APP_API_URL + "/auth/microsoft/callback/?access_token=" + accessToken;
      const azureConfig = { headers: { Authorization: `Bearer ${accessToken}` }};

      let fetchJWT = axios.get(loginUrl)
      let fetchProfile = axios.get('https://graph.microsoft.com/v1.0/me', azureConfig)
      let fetchPhoto = axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {...azureConfig, responseType: 'arraybuffer'})

      Promise.all([fetchJWT, fetchProfile, fetchPhoto])
      .then((values) => {
          commit("login", {
            accessToken: accessToken,
            jwt: values[0].data.jwt,
            profile: values[1].data,
            photo: Buffer.from(values[2].data, 'binary').toString('base64')
          })
      })
      .catch((err) => {
        console.log(err);
      })
    },
    logout({ commit }) {
      commit("logout")
    }
  },
};
