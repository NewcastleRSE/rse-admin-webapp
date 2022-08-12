<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <v-grid
            ref="table"
            theme="compact"
            filter={true}
            resize={true}
            :source="transactions"
            :columns="columns"
            :columnTypes="columnTypes"
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

export default {
  name: "AssignmentGantt",
  components: { VGrid },
  data() {
    return {
        columns: [
            { name: 'Posted Date', prop: "postedDate", sortable: true, order: 'asc' },
            { name: 'Description', prop: "costElementDescription", sortable: true, order: 'asc', size: 200 },
            { name: 'Document Header', prop: "documentHeader", sortable: true, order: 'asc', size: 200 },
            { name: 'Name', prop: "name", sortable: true, order: 'asc', size: 200 },
            { name: 'Category', prop: "ieCategory", sortable: true, order: 'asc', size: 200 },
            { name: 'Value', prop: "value", sortable: true, order: 'asc', columnType: 'currency' }
        ],
        columnTypes: {
            currency: new NumberColumnType('($0,0.00)')
        }
    }
  },
  computed: {
    transactions() {
      return this.$store.getters["transactions/getTransactions"]
    }
  }
}
</script>