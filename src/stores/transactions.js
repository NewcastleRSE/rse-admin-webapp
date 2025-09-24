import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DateTime } from 'luxon'
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
        return transactions.value.filter(transaction => transaction.fiscalYear == year).reverse()
    }

    function getSummary(year) {
        let transactions = getByYear(year),
            summary = {
                income: {
                    total: 0
                },
                nonSalaryExpenditure: {
                    total: 0
                },
                lastUpdated: DateTime.now().startOf('month').minus({ days: 1 })
            }

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
            .filter(transaction => transaction.ieCategory === ieCategory && transaction.documentHeader !== 'Catalyst internal tenant')
            .reduce((value,transaction) => value + transaction.value, 0).toFixed(2)
        })

        const postedDates = [...new Set(transactions.reduce(function (dates, transaction) { return [...dates, DateTime.fromISO(transaction.postedDate)] }, []))]

        if(postedDates.length) {
            summary.lastUpdated = DateTime.max(...postedDates)
        }

        return summary
    }

    async function fetchTransactions (year) {
        transactions.value = await fetchObjects('transactions', 0, 100, null, { fiscalYear: { $eq: year } })
    }

    async function reset () {
        transactions.value = []
    }

    return { transactions, getTransactions, getByID, getByYear, getSummary, fetchTransactions, reset }
},
{
    persist: true
})