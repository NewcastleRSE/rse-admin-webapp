import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { fetchObjects } from '../utils/orm'
import { DateTime, Interval } from 'luxon'

const titleCase = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

export const useInvoicesStore = defineStore('invoices', () => {

    const store = useUserStore()
    const invoices = ref([])

    function getFacilities() {
        return invoices.value
    }

    function getByID(documentId) {
        const results = invoices.value.find(invoice => invoice.documentId == documentId)
        return results ? results : null
    }

    function getByFinancialYear(year) {
        const yearStart = DateTime.utc(year, 8),
              yearEnd = yearStart.plus({years: 1}).minus({days: 1})

        const financialYear = Interval.fromDateTimes(yearStart, yearEnd)

        const results = invoices.value.filter(invoice => {
            const period = DateTime.fromFormat(`${invoice.year} ${titleCase(invoice.month)}`, 'yyyy MMMM')
            return financialYear.contains(period.endOf('day'))
        })
        return results ? results : []
    }

    function getByPeriod(year, month) {
        const results = invoices.value.filter(invoice => invoice.year == year && invoice.month == month.toLowerCase())
        return results ? results : []
    }

    function getByProject(documentId) {
        const results = invoices.value.filter(invoice => invoice.project.documentId == documentId)
        return results ? results : []
    }

    async function fetchInvoices (year) {
        invoices.value = await fetchObjects('invoices', 0, 100, ['project', 'transaction'], { year: { $eq: year }})
    }

    async function createInvoice (projectId, year, month) {
        return axios.post(`${import.meta.env.VITE_API_URL}/invoices`, {
            headers: {
              Authorization: `Bearer ${store.jwt}`
            },
            data: {
                project: projectId,
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
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].sent = invoice.sent
                break;
            case 'processed':
                invoice.processed = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].processed = invoice.processed
                break;
            default:
                break;
        }

        await axios.put(`${import.meta.env.VITE_API_URL}/invoices/${invoice.documentId}`, {
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