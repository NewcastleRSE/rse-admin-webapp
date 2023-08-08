<template>
    <div class="w-full mb-12">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 p-4 shadow-lg rounded bg-white">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        Finance
                    </h6>
                    <h2 class="text-blueGray-700 text-xl font-semibold">
                        Cost Recovery
                    </h2>
                </div>
            </div>
            <div class="relative py-4">
                <div class="my-4 overflow-hidden w-full rounded bg-gray-200">
                    <div class="h-10 rounded bg-cyan-600 text-white text-sm font-bold leading-6 text-right align-middle pr-3.5" :style="{'width': budgetUsed + '%'}"></div>
                    <div class="absolute border-r-4 border-black h-20 top-3" :style="{'left': yearCompleted + '%'}"></div>
                </div>
          </div>
        </div>
    </div>
</template>
<script setup>
import { DateTime } from 'luxon';
import { useCapacitiesStore, useInvoicesStore, useRSEsStore, useTimesheetsStore } from '@/stores'

const capacitiesStore = useCapacitiesStore(),
      invoicesStore = useInvoicesStore(),
      rsesStore = useRSEsStore(),
      timesheetsStore = useTimesheetsStore()

const rses = rsesStore.getRSEs()

const yearStart = DateTime.fromISO('2022-08-01').startOf('day'),
      yearEnd = DateTime.fromISO('2023-07-31').endOf('day')

const nonBillableProjects = ['RSE Team', 'Carpentries', 'Management', 'Non-Project Event', 'Volunteering']

let totalCapacity = 0,
    totalRecorded = 0,
    rseBreakdown = []

// Compute total team capacity in days this year
rses.forEach(rse => {
    const capacities = capacitiesStore.getCapacityInPeriod(yearStart.toISODate(), yearEnd.toISODate(), rse.id)

    let rseStats = {
        name: rse.firstname + ' ' + rse.lastname,
        capacity: 0,
        recorded: 0,
        billable: 0,
        nonBillable: 0,
        missing: 0,
        recoveryRate: 0,
        nonBillableProjects: {}
    }

    capacities.forEach(capacity => {

        let start = DateTime.fromISO(capacity.start),
            end = capacity.end ? DateTime.fromISO(capacity.end) : yearEnd

        // Capacity is the same all year
        if(yearStart >= start && yearEnd <= end) {
            rseStats.capacity += Math.round(Math.round(220 * (capacity.capacity/100)))
        }
        // Capacity started this year
        else if (yearStart <= start && yearEnd <= end) {
            const proRataRatio = Math.round(yearEnd.diff(start, 'days').toObject().days) / 365
            rseStats.capacity += Math.round(Math.round(220 * (capacity.capacity/100)) * proRataRatio)
        }
        // Capacity ended this year
        else if (yearStart >= start && yearEnd >= end) {
            const proRataRatio = Math.round(end.diff(yearStart, 'days').toObject().days) / 365
            rseStats.capacity += Math.round(Math.round(220 * (capacity.capacity/100)) * proRataRatio)
        }
        // Capacity starts and ends in the same year
        else {
            const proRataRatio = Math.round(end.diff(start, 'days').toObject().days) / 365
            rseStats.capacity += Math.round(Math.round(220 * (capacity.capacity/100)) * proRataRatio)
        }
    })

    if(rse.lastname !== 'Horsfall' && rse.lastname !== 'Lozada') {
        const timesheets = timesheetsStore.getByRSE(rse.firstname + ' ' + rse.lastname)

        timesheets?.months.forEach(month => {
            month.projects.forEach(project => {

                if(nonBillableProjects.indexOf(project.name) === -1) {
                    rseStats.billable += project.days
                }
                else {
                    if(!rseStats.nonBillableProjects[project.name]) {
                        rseStats.nonBillableProjects[project.name] = 0
                    }
                    rseStats.nonBillable += project.days
                    rseStats.nonBillableProjects[project.name] += project.days
                }

                rseStats.recorded += project.days
            })
        })

        rseStats.missing = rseStats.capacity - rseStats.recorded
        rseStats.recoveryRate = ((rseStats.billable/rseStats.capacity) * 100).toFixed(2) + '%'
        rseBreakdown.push(rseStats)
    }

    totalCapacity += rseStats.capacity
    totalRecorded += rseStats.billable
})

// console.log(JSON.stringify(rseBreakdown))

let invoicedDays = {
    sent: 0,
    processed: 0,
    paid: 0
}
const invoices = invoicesStore.getByFinancialYear(yearStart.year)

invoices.forEach(invoice => {
    if(invoice.paid) {
        invoicedDays.paid += invoice.units
    }
    else if(invoice.processed) {
        invoicedDays.processed += invoice.units
    }
    else if(invoice.sent) {
        invoicedDays.sent += invoice.units
    }
})

console.log(totalRecorded)
console.log(invoicedDays)
console.log(totalCapacity)

const budgetUsed = (totalRecorded / totalCapacity) * 100
const yearCompleted = 85
</script>