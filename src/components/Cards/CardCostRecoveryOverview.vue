<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
            Finance
          </h6>
          <h2 class="text-slate-700 text-xl font-semibold">
            Cost Recovery
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <div class="relative pt-1 mb-8">
          <a :href="`transactions/${summary.currentYear.year}`" class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            FY {{summary.currentYear.label}}
          </a>
          <div class="flex my-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block">
                Income
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full" :class="progressColour(summary.currentYear.progress)">
                {{summary.currentYear.progress}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-3 mb-6 text-xs flex rounded bg-gray-200">
            <div :style="{ width: (((summary.currentYear.facultyIncome) / (summary.currentYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            <div :style="{ width: (((summary.currentYear.directlyAllocated) / (summary.currentYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"></div>
            <div :style="{ width: (((summary.currentYear.facilityIncome) / (summary.currentYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
          <div class="flex my-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block">
                Expenditure
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-sky-200 text-sky-600">
                {{(((summary.currentYear.nonSalary * -1) / (summary.currentYear.facility.nonSalaryCosts)) * 100).toFixed(2)}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-200">
            <div :style="{ width: (((summary.currentYear.nonSalary * -1) / (summary.currentYear.facility.nonSalaryCosts)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500"></div>
          </div>
        </div>
        <div class="relative pt-1">
          <a :href="`transactions/${summary.lastYear.year}`" class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            FY {{summary.lastYear.label}}
          </a>
          <div class="flex my-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block">
                Income
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full" :class="progressColour(summary.lastYear.progress)">
                {{summary.lastYear.progress}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-3 mb-6 text-xs flex rounded bg-gray-200">
            <div :style="{ width: (((summary.lastYear.facultyIncome) / (summary.lastYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            <div :style="{ width: (((summary.lastYear.directlyAllocated) / (summary.lastYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"></div>
            <div :style="{ width: (((summary.lastYear.facilityIncome) / (summary.lastYear.target)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
          <div class="flex my-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block">
                Expenditure
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-sky-200 text-sky-600">
                {{(((summary.lastYear.nonSalary * -1) / (summary.lastYear.facility.nonSalaryCosts)) * 100).toFixed(2)}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-200">
            <div :style="{ width: (((summary.lastYear.nonSalary * -1) / (summary.lastYear.facility.nonSalaryCosts)) * 100).toFixed(2) + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import { DateTime } from 'luxon'

  export default {
    computed: {
      summary() {

        let FY = DateTime.local().month > 7 ? DateTime.local().year : DateTime.local().year - 1,
            FYStart = DateTime.fromObject({ year: FY, month: 8, day: 1})

        let currentFY = FYStart.year,
            currentFacility = this.$store.getters["facility/getFacility"](currentFY),
            currentTransactions = this.$store.getters["transactions/getSummary"](currentFY),
            currentInvestment = Object.prototype.hasOwnProperty.call(currentTransactions, 'indirectCostsAbsorbedRecovered') ? parseFloat(currentTransactions.indirectCostsAbsorbedRecovered.total) : 0,
            currentNonSalary = Object.prototype.hasOwnProperty.call(currentTransactions, 'nonSalaryExpenditure') ? parseFloat(currentTransactions.nonSalaryExpenditure.total) : 0,
            currentYearUtilisation = this.$store.getters["capacity/getUtilisation"](FYStart, FYStart.plus({years: 1}))

        let lastFY = FYStart.minus({years: 1}).year,
            lastFacility = this.$store.getters["facility/getFacility"](lastFY),
            lastTransactions = this.$store.getters["transactions/getSummary"](lastFY),
            lastInvestment = Object.prototype.hasOwnProperty.call(lastTransactions, 'indirectCostsAbsorbedRecovered') ? parseFloat(lastTransactions.indirectCostsAbsorbedRecovered.total) : 0,
            lastNonSalary = Object.prototype.hasOwnProperty.call(lastTransactions, 'nonSalaryExpenditure') ? parseFloat(lastTransactions.nonSalaryExpenditure.total) : 0,
            lastYearUtilisation = this.$store.getters["capacity/getUtilisation"](FYStart.minus({years: 1}), FYStart)

        let summary = {
          currentYear: {
            year: currentFY,
            label: `${currentFY}/${currentFY - 1999}`,
            facility: currentFacility,
            target: currentYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.capacityDays }, 0) * currentFacility.dayRate,
            facilityIncome: currentYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.facilityDays }, 0) * currentFacility.dayRate,
            directlyAllocated: currentYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.nonFacilityDays }, 0) * currentFacility.dayRate,
            facultyIncome: Math.abs(currentInvestment),
            nonSalary: currentNonSalary
          },
          lastYear: {
            year: lastFY,
            label: `${lastFY}/${lastFY - 1999}`,
            facility: lastFacility,
            target: lastYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.capacityDays }, 0) * lastFacility.dayRate,
            facilityIncome: lastYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.facilityDays }, 0) * lastFacility.dayRate,
            directlyAllocated: lastYearUtilisation.reduce(function (totalDays, month) { return totalDays + month.nonFacilityDays }, 0) * lastFacility.dayRate,
            facultyIncome: Math.abs(lastInvestment),
            nonSalary: lastNonSalary
          }
        }

        summary.currentYear.progress = (((summary.currentYear.facilityIncome + summary.currentYear.facultyIncome + summary.currentYear.directlyAllocated) / (summary.currentYear.target * 0.7)) * 100).toFixed(2),
        summary.lastYear.progress = (((summary.lastYear.facilityIncome + summary.lastYear.facultyIncome + summary.lastYear.directlyAllocated) / (summary.lastYear.target * 0.7)) * 100).toFixed(2)

        return summary
      }
    },
    methods: {
      progressColour(progress) {
        if(progress > 70) {
          if(progress > 100) {
            return 'bg-emerald-200 text-emerald-600'
          }
            return 'bg-orange-200 text-orange-600'
        }
        else {
          return 'bg-red-200 text-red-600'
        }
      }
    }
  }
</script>
