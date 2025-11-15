import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchObjects } from '../utils/orm'

export const useFinancesStore = defineStore('finances', () => {
    const finances = ref([])

    function getTransactions() {
        return finances.value
    }

    function getByID(documentId) {
        return finances.value.find(financalYear => financalYear.documentId == documentId)
    }

    function getByYear(year) {
        return finances.value.find(financalYear => financalYear.year == year)
    }

    async function fetchFinances (year) {
        finances.value = await fetchObjects('finances', 0, 100, null, { year: { $eq: year } })
    }

    async function reset () {
        finances.value = []
    }

    return { finances, getTransactions, getByID, getByYear, fetchFinances, reset }
},
{
    persist: true
})