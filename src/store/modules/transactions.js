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
    transactions: []
  },

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["transactions/getTransactions"];
    */
    getTransactions: (state) => {
      return state.transactions.reverse()
    }
  },

  mutations: {
    //sync, updates state
    getTransactions(state, transactions) {
      state.transactions = transactions;
    }
  },

  actions: {
    //async, commits mutations

    /*
    Gets transactions from Strapi
    Call with this.$store.dispatch("transactions/getTransactions");
    Can leave parameter empty and will call all transactions
    Returns promise so can be used as async function
    */
    async getTransactions({ commit, rootState }) {
      let transactions = []

      const fetchTransactions = async function (page, pageSize, populate) {

          const query = qs.stringify({
              pagination: {
                page: page,
                pageSize: pageSize,
              },
              populate: populate
            },{
              encodeValuesOnly: true,
            });
  
          let response = await axios.get(`${process.env.VUE_APP_API_URL}/transactions?${query}`, {
            headers: {
              Authorization: `Bearer ${rootState.auth.jwt}`,
            }})
          
            transactions = transactions.concat(response.data.data)
          const pagination = response.data.meta.pagination

          if(pagination.page < pagination.pageCount) {
            return await fetchTransactions(pagination.page + 1, pageSize)
          }
          else {
            return transactions
          }
      }

      commit("getTransactions", await fetchTransactions(0, 100));
    },
  },
};
