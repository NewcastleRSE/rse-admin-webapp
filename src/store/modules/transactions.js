//import router from "../../router";
import axios from 'axios'
import * as qs from 'qs'
import { DateTime } from 'luxon'

var camelCase = function camalize(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}


export default {
  namespaced: true,

  /*
  Global Variables
  Call state with $store.state.{module}.{stateName}
  */
  state: {
    allTimeTransactions: [],
    allTimeSummary: {},
    currentYearTransactions: [],
    currentYearSummary: {}
  },

  getters: {
    /*
    Maps properties sent from HubSpot
    Call with this.$store.getters["transactions/getTransactions"];
    */
    getAllTimeTransactions: (state) => {
      return state.allTimeTransactions.reverse()
    },
    getAllTimeSummary: (state) => {
      return state.allTimeSummary
    },
    getCurrentYearTransactions: (state) => {
      const FY = DateTime.local().month < 8 ? DateTime.local().year : DateTime.local().year - 1
      return state.transactions.filter(transaction => transaction.fiscalYear === FY).reverse()
    },
    getCurrentYearSummary: (state) => {
      const FY = DateTime.local().month < 8 ? DateTime.local().year : DateTime.local().year - 1
      return state.transactions.filter(transaction => transaction.fiscalYear === FY).reverse()
    }
  },

  mutations: {
    //sync, updates state
    getTransactions(state, transactions) {
      // Array of all transactions
      state.allTimeTransactions = transactions

      let allTimeSummary = {};

      const ieCategories = [...new Set(transactions.map(transaction => transaction.ieCategory))]

      ieCategories.forEach(ieCategory => {

        let bwCategories = [...new Set(transactions.filter(transaction => transaction.ieCategory === ieCategory).map(transaction => transaction.bwCategory))]
        
        try {
        if(!Object.prototype.hasOwnProperty.call(allTimeSummary, (camelCase(ieCategory)))) {
          allTimeSummary[camelCase(ieCategory)] = {}
        }
      }
      catch(err) {
        console.log(ieCategories)
        console.log(ieCategory)
        console.log(allTimeSummary)
      }

        bwCategories.forEach(bwCategory => {

          if(!Object.prototype.hasOwnProperty.call(allTimeSummary[camelCase(ieCategory)], (camelCase(bwCategory)))) {
            allTimeSummary[camelCase(ieCategory)][camelCase(bwCategory)] = {}
          }

          allTimeSummary[camelCase(ieCategory)][camelCase(bwCategory)] = transactions
            .filter(transaction => transaction.ieCategory === ieCategory && transaction.bwCategory === bwCategory)
            .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
        })

        allTimeSummary[camelCase(ieCategory)].total = transactions
        .filter(transaction => transaction.ieCategory === ieCategory)
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
      })

      state.allTimeSummary = allTimeSummary
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
