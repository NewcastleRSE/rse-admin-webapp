<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <finance-stat v-on:click="$router.push({path:`/finance`})"
        :icon="ChartPieIcon"
        title="Finances"
        value="22.3%"
        change="3.2%"
        changeType="increase"           
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <finance-stat v-on:click="$router.push({path:`/finance/invoices`})"
        :icon="CurrencyPoundIcon"
        title="Invoices"
        value="22.3%"
        change="3.2%"
        changeType="increase"           
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <finance-stat v-on:click="$router.push({path:`/finance/budget`})"
        :icon="PresentationChartLineIcon"
        title="Budget"
        value="22.3%"
        change="13.6%"
        changeType="decrease"           
      />
    </div>
    <div class="w-full lg:w-6/12 xl:w-3/12 px-4 cursor-pointer">
      <finance-stat v-on:click="$router.push({path:`/finance/transactions`})"
        :icon="DocumentTextIcon"
        title="Transactions"
        value="22.3%"
        change="3.2%"
        changeType="increase"           
      />
    </div>
  </div>
</template>

<script setup>

import FinanceStat from "@/components/Cards/FinanceStat.vue"
import { ChartPieIcon, CurrencyPoundIcon, PresentationChartLineIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

</script>
