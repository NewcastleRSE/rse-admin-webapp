<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
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
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <div class="relative pt-1 mb-8">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                FY {{summary.currentYear.label}}
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-emerald-600">
                {{summary.currentYear.progress}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
            <div :style="{ width: summary.currentYear.progress + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
        </div>
        <div class="relative pt-1 mb-8">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                FY {{summary.lastYear.label}}
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-red-600">
                {{summary.lastYear.progress}}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
            <div :style="{ width: summary.lastYear.progress + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
          </div>
          <div class="absolute cost-recovery-threshold" style="left:70%"></div>
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

        let currentFY = DateTime.local().month > 7 ? DateTime.local().year : DateTime.local().year,
            currentFacility = this.$store.getters["facility/getFacility"](currentFY),
            currentTransactions = this.$store.getters["transactions/getSummary"](currentFY),
            currentTarget = currentFacility.annualUseage * currentFacility.dayRate,
            currentIncome = Object.prototype.hasOwnProperty.call(currentTransactions, 'income') ? currentTransactions.income.total : 0,
            currentProgress = ((currentIncome / currentTarget) * 100).toFixed(2)

        let lastFY = currentFY - 1,
            lastFacility = this.$store.getters["facility/getFacility"](lastFY),
            lastTransactions = this.$store.getters["transactions/getSummary"](lastFY),
            lastTarget = lastFacility.annualUseage * lastFacility.dayRate,
            lastIncome = Object.prototype.hasOwnProperty.call(lastTransactions, 'income') ? lastTransactions.income.total : 0,
            lastProgress = ((lastIncome / lastTarget) * 100).toFixed(2)

        const summary = {
          currentYear: {
            year: currentFY,
            label: `${currentFY}/${currentFY - 1999}`,
            facility: currentFacility,
            target: currentTarget,
            income: currentIncome,
            progress: Math.abs(currentProgress)
          },
          lastYear: {
            year: lastFY,
            label: `${lastFY}/${lastFY - 1999}`,
            facility: lastFacility,
            target: lastTarget,
            income: lastIncome,
            progress: Math.abs(lastProgress)
          }
        }

        console.log(summary)

        return summary
      }
    }
  }
</script>
