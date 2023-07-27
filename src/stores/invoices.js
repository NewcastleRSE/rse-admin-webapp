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
        return axios.post(`${import.meta.env.VITE_API_URL}/invoices`, {
            headers: {
              Authorization: `Bearer ${store.jwt}`
            },
            data: {
                project: clockifyID,
                year: year,
                month: month.toLowerCase()
            }
          }).then(response => {
            const pdf = response.data.pdf
            delete response.data.pdf

            invoices.value.push(response.data)

            const downloadLink = document.createElement('a')
            downloadLink.href = `data:application/pdf;base64,${pdf}`
            downloadLink.download = 'file.pdf'
            downloadLink.click()
          })
    }

    async function updateInvoiceState(invoice, state) {
        switch(state){
            case 'sent':
                invoice.sent = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.id === invoice.id)].sent = invoice.sent
                break;
            case 'processed':
                invoice.processed = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.id === invoice.id)].processed = invoice.processed
                break;
            default:
                break;
        }

        await axios.put(`${import.meta.env.VITE_API_URL}/invoices/${invoice.id}`, {
            headers: {
              Authorization: `Bearer ${store.jwt}`
            },
            data: invoice
        })
    }

    async function reset () {
        invoices.value = []
    }

    return { invoices, getFacilities, getByID, getByFinancialYear, getByPeriod, getByProject, fetchInvoices, createInvoice, updateInvoiceState, reset }
},
{
    persist: true
})