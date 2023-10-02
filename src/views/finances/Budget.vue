<template>
  <div class="flex flex-wrap">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      Expenses
    </div>
    <div class="w-full xl:w-1/2 px-4">
      <Cloud :data="cloud" />
    </div>
  </div>
  <div class="flex flex-wrap mt-4">
    <div class="w-full xl:w-1/2 mb-12 xl:mb-0 px-4">
      Travel
    </div>
    <div class="w-full xl:w-1/2 px-4">
      Other
    </div>
  </div>
</template>
<script setup>
import Cloud from '@/components/Finance/Cloud.vue'
import { useTransactionsStore } from '@/stores/transactions'

import { currentFY } from '../../utils/dates'

const dates = currentFY()

const transactionsStore = useTransactionsStore()
const transactions = transactionsStore.getByYear(dates.startDate.year)

const expenses = transactions.filter(transaction => transaction.internalCategory === 'Expenses'),
      cloud = transactions.filter(transaction => transaction.internalCategory === 'Cloud'),
      travel = transactions.filter(transaction => transaction.internalCategory === 'Travel'),
      other = transactions.filter(transaction => transaction.internalCategory === 'Other')

</script>