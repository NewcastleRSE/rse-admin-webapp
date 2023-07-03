import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useTransactionsStore = defineStore('transactions', () => {
    const transactions = ref([])

    function getTransactions() {
        return transactions.value
    }

    function getByID(id) {
        return transactions.value.find(transaction => transaction.id == id)
    }

    async function fetchTransactions () {
        transactions.value = await fetchObjects('transactions', 0, 100)
    }

    return { transactions, getTransactions, getByID, fetchTransactions }
},
{
    persist: true
})