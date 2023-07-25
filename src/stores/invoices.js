import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { fetchObjects } from '../utils/orm'
import { DateTime } from 'luxon'

const titleCase = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

export const useInvoicesStore = defineStore('invoices', () => {

    const store = useAuthStore()
    const invoices = ref([])

    function getFacilities() {
        return invoices.value
    }

    function getByID(id) {
        const results = invoices.value.find(invoice => invoice.id == id)
        return results ? results : null
    }

    function getByFinancialYear(year) {
        const yearStart = DateTime.utc(year, 8),
              yearEnd = yearStart.plus({years: 1}).minus({days: 1})

        const results = invoices.value.filter(invoice => {
            const period = DateTime.fromFormat(`${invoice.year} ${titleCase(invoice.month)}`, 'yyyy MMMM')
            return yearStart <= period && period <= yearEnd
        })
        return results ? results : []
    }

    function getByPeriod(year, month) {
        const results = invoices.value.filter(invoice => invoice.year == year && invoice.month == month.toLowerCase())
        return results ? results : []
    }

    function getByProject(id) {
        const results = invoices.value.filter(invoice => invoice.project.id == id)
        return results ? results : []
    }

    async function fetchInvoices () {
        invoices.value = await fetchObjects('invoices', 0, 100, ['project', 'transaction'])
    }

    async function createInvoice (clockifyID, year, month) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/invoices`, {
            headers: {
              Authorization: `Bearer ${store.jwt}`
            },
            data: {
                project: clockifyID,
                year: year,
                month: month.toLowerCase()
            }
          })
          console.log(response)
          const linkSource = `data:application/pdf;base64,${response.data}`;
          const downloadLink = document.createElement("a");
          const fileName = "file.pdf";

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
    }

    async function reset () {
        invoices.value = []
    }

    return { invoices, getFacilities, getByID, getByFinancialYear, getByPeriod, getByProject, fetchInvoices, createInvoice, reset }
},
{
    persist: true
})