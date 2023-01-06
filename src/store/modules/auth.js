import router from "../../router"
import axios from "axios"

const initialState = {
  accessToken: '',
  jwt: '',
  user: {}
}

export default {
  namespaced: true,
  state: {...initialState},

  getters: {
    accessToken: (state) => {
      return state.accessToken
    },
    jwt: (state) => {
      return state.jwt
    },
    user: (state) => {
      return state.user
    },
  },

  mutations: {
    //sync, updates state
    login(state, data) {
      state.accessToken = data.accessToken
      state.jwt = data.jwt
      state.user = data.profile
      state.user.photo = data.photo
      Promise.all([
        this.dispatch("projects/getProjects"),
        this.dispatch("rses/getRses"),
        this.dispatch("timesheets/getReport"),
        this.dispatch("capacity/getCapacity"),
        this.dispatch("facility/getFacility"),
        this.dispatch("transactions/getTransactions")
      ]).then(() => {
        router.push({ name: "Dashboard" })
      }).catch(error => {
        console.error(error)
      })
    },
    logout() {
      router.push({ name: 'Login', params: { logout: true } })
    },
    reset: (state) => {
      Object.assign(state, initialState)
    }
  },

  actions: {
    //async, commits mutations
    login({ commit }, accessToken) {
      const loginUrl = process.env.VUE_APP_API_URL + "/auth/microsoft/callback/?access_token=" + accessToken
      const azureConfig = { headers: { Authorization: `Bearer ${accessToken}` }}

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
        console.log(err)
      })
    },
    logout({ commit }) {
      commit("logout")
    }
  },
}
