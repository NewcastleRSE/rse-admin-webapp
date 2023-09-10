<template>
  <div class="w-full mb-12 px-4">
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <v-grid
          class="transaction-grid h-screen"
          theme="compact"
          filter={true}
          :source="transactions"
          :columns="columns"
          :columnTypes="columnTypes"
          :readonly="true"
          :resize="true"
          :stretch="true"
          :canFocus="false"
      ></v-grid>
    </div>
  </div>
</template>
<script setup>
import VGrid from '@revolist/vue3-datagrid'
import NumberColumnType from '@revolist/revogrid-column-numeral'
import { useTransactionsStore } from '@/stores'
import { currentFY } from '../../utils/dates'

const dates = currentFY()
const transactionsStore = useTransactionsStore()
const numeral = NumberColumnType.getNumeralInstance()

numeral.register('locale', 'gb', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    currency: {
        symbol: '£'
    }
})
numeral.locale('gb')

const columnWidth = (window.innerWidth - convertRemToPixels(7)) / 10

const columns = [
    { name: 'Posted Date', prop: "postedDate", sortable: true, order: 'asc', size: columnWidth, columnProperties: () => { return { class: { 'postedDate': true } } } },
    { name: 'Description', prop: "costElementDescription", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'costElementDescription': true } } } },
    { name: 'Document Header', prop: "documentHeader", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'documentHeader': true } } } },
    { name: 'Name', prop: "name", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'name': true } } } },
    { name: 'Category', prop: "ieCategory", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'ieCategory': true } } } },
    { name: 'Value', prop: "value", sortable: true, size: columnWidth, columnType: 'currency', columnProperties: () => { return { class: { 'value': true } } } }
]

const columnTypes = { 
  currency: new NumberColumnType('($0,0.00)')
}

const transactions = transactionsStore.getByYear(dates.startDate.year)

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
</script>
<style lang="scss">
revo-grid {
  .rgHeaderCell .rv-filter {
    margin-left: 10px;
  }

  button.revo-button {
    border-radius: 0.375rem !important;
    --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    --tw-text-opacity: 1;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.25rem !important;
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;

    &.red {
      color: rgb(255 255 255 / var(--tw-text-opacity));
      background-color: rgb(6 182 212 / var(--tw-bg-opacity));
      border: none;
    }

    &.light {
      color: rgb(17 24 39 / var(--tw-text-opacity));
      background-color: none;
      border: none;
      --tw-ring-opacity: 1;
      --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity));
      --tw-ring-inset: inset;
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    }
  }
}
</style>