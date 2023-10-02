<template>
  <div class="flex flex-wrap">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      <Spend :id="'expenses-spend'" :title="'Expenses'" :yTitle="'Spend'" :xTitle="'Month'" :data="expenseData" />
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <Spend :id="'cloud-spend'" :title="'Cloud'" :yTitle="'Spend'" :xTitle="'Month'" :data="cloudData" />
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      <Spend :id="'travel-spend'" :title="'Travel'" :yTitle="'Spend'" :xTitle="'Month'" :data="travelData" />
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <Spend :id="'other-spend'" :title="'Other'" :yTitle="'Spend'" :xTitle="'Month'" :data="otherData" />
    </div>
  </div>
</template>
<script setup>
import Spend from '@/components/Finance/Spend.vue'
import { useTransactionsStore } from '@/stores/transactions'

import { currentFY } from '../../utils/dates'

const dates = currentFY()

const transactionsStore = useTransactionsStore()
const transactions = transactionsStore.getByYear(dates.startDate.year)

const expenseTransactions = transactions.filter(transaction => transaction.internalCategory === 'Expenses'),
      cloudTransactions = transactions.filter(transaction => transaction.internalCategory === 'Cloud'),
      travelTransactions = transactions.filter(transaction => transaction.internalCategory === 'Travel' || transaction.internalCategory === 'Conference'),
      otherTransactions = transactions.filter(transaction => transaction.internalCategory === 'Other')

let labels = [],
    expenses = new Array(12).fill(0),
    azure = new Array(12).fill(0),
    aws = new Array(12).fill(0),
    google = new Array(12).fill(0),
    travel = new Array(12).fill(0),
    conference = new Array(12).fill(0),
    other = new Array(12).fill(0)

let month = dates.startDate

for(let i=0; i < 12; i++) {
    month = dates.startDate.plus({months: i})
    labels.push(month.toFormat('LLL'))
}

expenseTransactions.forEach(transaction => {
  expenses[transaction.fiscalPeriod - 1] += (transaction.value * -1)
})

cloudTransactions.forEach(transaction => {
    if(transaction.name.toLowerCase().includes('azure')) {
        azure[transaction.fiscalPeriod - 1] += (transaction.value * -1)
    }
    else if(transaction.name.toLowerCase().includes('google')) {
        google[transaction.fiscalPeriod - 1] += (transaction.value * -1)
    }
    else {
        console.log(transaction)
    }
})

travelTransactions.forEach(transaction => {
    if(transaction.internalCategory === 'Travel') {
        travel[transaction.fiscalPeriod - 1] += (transaction.value * -1)
    }
    else if(transaction.internalCategory === 'Conference') {
        conference[transaction.fiscalPeriod - 1] += (transaction.value * -1)
    }
    else {
        console.log(transaction)
    }
})

otherTransactions.forEach(transaction => {
  other[transaction.fiscalPeriod - 1] += (transaction.value * -1)
})

const expenseData = {
  labels: labels,
  datasets: [
      {
        label: 'Expenses',
        backgroundColor: "#0991B1",
        borderColor: "#0991B1",
        data: expenses,
      }
  ],
}


const cloudData = {
  labels: labels,
  datasets: [
      {
        label: 'Azure',
        backgroundColor: "#0175BC",
        borderColor: "#0175BC",
        data: azure,
      },
      {
        label: 'AWS',
        backgroundColor: "#EB912E",
        borderColor: "#EB912E",
        data: aws,
      },
      {
        label: 'Google',
        backgroundColor: "#DB4437",
        borderColor: "#DB4437",
        data: google,
      }
  ],
}

const travelData = {
  labels: labels,
  datasets: [
      {
        label: 'Travel',
        backgroundColor: "#0991B1",
        borderColor: "#0991B1",
        data: travel,
      },
      {
        label: 'Conferences',
        backgroundColor: "#16A349",
        borderColor: "#16A349",
        data: conference,
      }
  ],
}

const otherData = {
  labels: labels,
  datasets: [
      {
        label: 'Other Costs',
        backgroundColor: "#0991B1",
        borderColor: "#0991B1",
        data: other,
      }
  ],
}

</script>