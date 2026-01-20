import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { fetchObjects } from '../utils/orm'
import { DateTime, Interval } from 'luxon'

// const titleCase = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
const titleCase = str => str && str.length
    ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
    : '';
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
            yearEnd = yearStart.plus({ years: 1 }).minus({ days: 1 })

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

    async function fetchInvoices(year) {
        invoices.value = await fetchObjects('invoices', 0, 100, ['project', 'transaction'], { year: { $eq: year } })

    }

    async function createInvoice(projectId, year, month) {
        console.log(month)
        try {
            const { data: response } = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/invoices`,
                headers: {
                    Authorization: `Bearer ${store.jwt}`
                },
                data: {
                    data: {
                        project: projectId,
                        year: year,
                        month: month.toLowerCase()
                    }
                }
            })
            const pdf = response.data.pdf
            delete response.data.pdf

            invoices.value.push(response.data)

            const name = response.data.project.name

            const downloadLink = document.createElement('a')
            downloadLink.href = `data:application/pdf;base64,${pdf}`
            downloadLink.download = `${name}-${month}-${year}.pdf`
            downloadLink.click()
        } catch (error) {
            console.error('Error creating invoice:', error)
        }
    }

    async function updateInvoiceState(invoice, state) {
        switch (state) {
            case 'sent_for_signature':
                invoice.sent_for_signature = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].sent_for_signature = invoice.sent_for_signature
                break;
            case 'sent_to_finance':
                invoice.sent_to_finance = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].sent_to_finance = invoice.sent_to_finance
                break;
            case 'processed':
                invoice.processed = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].processed = invoice.processed
                break;
            case 'paid':
                invoice.paid = DateTime.utc().toISODate()
                invoices.value[invoices.value.findIndex(inv => inv.documentId === invoice.documentId)].paid= invoice.paid
                break;
            default:
                break;
        }
        console.log(invoice)

        try {
            await axios({
                method: 'put',
                url: `${import.meta.env.VITE_API_URL}/invoices/${invoice.documentId}`,
                headers: {
                    Authorization: `Bearer ${store.jwt}`
                },
                data: {
                    data: {
                        sent_for_signature: invoice.sent_for_signature,
                        sent_to_finance: invoice.sent_to_finance,
                        processed: invoice.processed,
                        paid: invoice.paid
                    }

                }
            })

        } catch (error) {
            console.error('Error updating invoice status:', error)
            //  todo if there is an error here, return invoices in memory to previous state to align with database
        }
        // await axios.put(`${import.meta.env.VITE_API_URL}/invoices/${invoice.documentId}`, {
        //     headers: {
        //       Authorization: `Bearer ${store.jwt}`
        //     },
        //     data: invoice
        // })
    }

    async function reset() {
        invoices.value = []
    }

    return { invoices, getFacilities, getByID, getByFinancialYear, getByPeriod, getByProject, fetchInvoices, createInvoice, updateInvoiceState, reset }
},
    {
        persist: true
    })