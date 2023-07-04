import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'
import { camelCase } from '../utils/strings'

export const useTransactionsStore = defineStore('transactions', () => {
    const transactions = ref([])

    function getTransactions() {
        return transactions.value.reverse()
    }

    function getByID(id) {
        return transactions.value.find(transaction => transaction.id == id)
    }

    function getByYear(year) {
        return transactions.value.find(transaction => transaction.fiscalYear == year).reverse()
    }

    function getSummary(year) {
        let transactions = getByYear(year),
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

    async function fetchTransactions () {
        transactions.value = await fetchObjects('transactions', 0, 100)
    }

    return { transactions, getTransactions, getByID, getByYear, getSummary, fetchTransactions }
},
{
    persist: true
})