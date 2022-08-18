<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <v-grid
            class="transaction-grid"
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
  </div>
</template>
<script>

import VGrid from '@revolist/vue3-datagrid'
import NumberColumnType from '@revolist/revogrid-column-numeral'

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

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export default {
  name: "AssignmentGantt",
  components: { VGrid },
  data() {
    const columnWidth = (window.innerWidth - convertRemToPixels(7)) / 10
    return {
        columns: [
            { name: 'Posted Date', prop: "postedDate", sortable: true, order: 'asc', size: columnWidth, columnProperties: () => { return { class: { 'postedDate': true } } } },
            { name: 'Description', prop: "costElementDescription", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'costElementDescription': true } } } },
            { name: 'Document Header', prop: "documentHeader", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'documentHeader': true } } } },
            { name: 'Name', prop: "name", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'name': true } } } },
            { name: 'Category', prop: "ieCategory", sortable: true, size: columnWidth*2, columnProperties: () => { return { class: { 'ieCategory': true } } } },
            { name: 'Value', prop: "value", sortable: true, size: columnWidth, columnType: 'currency', columnProperties: () => { return { class: { 'value': true } } } }
        ],
        columnTypes: {
            currency: new NumberColumnType('($0,0.00)')
        }
    }
  },
  computed: {
    transactions() {
      return this.$store.getters["transactions/getTransactions"](this.$route.params.year)
    }
  }
}
</script>