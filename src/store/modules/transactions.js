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
    transactions: [],
    summary: {
      salaryExpenditure: {
        total: 0,
        other: 0,
        specialist: 0,
        academic: 0
      },
      nonSalaryExpenditure: {
        total: 0
      },
      indirectCostsAbsorbedRecovered: {
        total: 0
      },
      income: {
        total: 0
      },
    }
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
      // Array of all transactions
      state.transactions = transactions

      // Sum of salary expenditure
      state.summary.salaryExpenditure.total = transactions
        .filter(transaction => transaction.ieCategory === 'Salary Expenditure')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      state.summary.salaryExpenditure.specialist = transactions
        .filter(transaction => transaction.bwCategory === 'Specialist')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      state.summary.salaryExpenditure.academic = transactions
        .filter(transaction => transaction.bwCategory === 'Acad Research Assoc-Non Clinical')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      state.summary.salaryExpenditure.other = transactions
        .filter(transaction => transaction.bwCategory === 'Other Staff')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      // Sum of non-salary expenditure
      state.summary.nonSalaryExpenditure.total = transactions
        .filter(transaction => transaction.ieCategory === 'Non-Salary Expenditure')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      // Sum of indirect costs
      state.summary.indirectCostsAbsorbedRecovered.total = transactions
        .filter(transaction => transaction.ieCategory === 'Indirect Costs Absorbed/Recovered')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)

      // Sum of income
      state.summary.income.total = transactions
        .filter(transaction => transaction.ieCategory === 'Income')
        .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
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
