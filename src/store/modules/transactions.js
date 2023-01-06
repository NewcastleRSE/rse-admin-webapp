//import router from "../../router";
import axios from 'axios'
import * as qs from 'qs'

var camelCase = function camalize(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const initialState =  {
  transactions: []
}

export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {...initialState},

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["transactions/getTransactions"];
    */
    getTransactions: (state) => (year) => {
      if (year) {
        return state.transactions.filter(transaction => transaction.fiscalYear == year).reverse()
      }
      else {
        return state.transactions.reverse()
      }
    },
    getSummary: (state, getters) => (year) => {

      let transactions = getters.getTransactions(year),
          summary = {}

      const ieCategories = [...new Set(transactions.map(transaction => transaction.ieCategory))]

      ieCategories.forEach(ieCategory => {

        let bwCategories = [...new Set(transactions.filter(transaction => transaction.ieCategory === ieCategory).map(transaction => transaction.bwCategory))]
        
        if(!Object.prototype.hasOwnProperty.call(summary, (camelCase(ieCategory)))) {
          summary[camelCase(ieCategory)] = {}
        }

        bwCategories.forEach(bwCategory => {

          if(!Object.prototype.hasOwnProperty.call(summary[camelCase(ieCategory)], (camelCase(bwCategory)))) {
            summary[camelCase(ieCategory)][camelCase(bwCategory)] = {}
          }

          summary[camelCase(ieCategory)][camelCase(bwCategory)] = transactions
            .filter(transaction => transaction.ieCategory === ieCategory && transaction.bwCategory === bwCategory)
            .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
        })

        summary[camelCase(ieCategory)].total = transactions
        .filter(transaction => transaction.ieCategory === ieCategory)
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
      })

      return summary
    }
  },

  mutations: {
    //sync, updates state
    getTransactions(state, transactions) {
      state.transactions = transactions
    },
    reset: (state) => {
      Object.assign(state, initialState)
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
