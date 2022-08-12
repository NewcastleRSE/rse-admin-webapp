<template>
    <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <v-grid
            theme="compact"
            filter={true}
            autoSizeColumn="true"
            :source="transactions"
            :columns="columns"
        ></v-grid>
      </div>
    </div>
  </div>
</template>
<script>
import VGrid from "@revolist/vue3-datagrid";

export default {
  name: "AssignmentGantt",
  components: { VGrid },
  data() {
    return {
        columns: [
            { name: 'Posted Date', prop: "postedDate", sortable: true, order: 'asc', autoSize: true },
            { name: 'Description', prop: "costElementDescription", sortable: true, order: 'asc', autoSize: true},
            { name: 'Document Header', prop: "documentHeader", sortable: true, order: 'asc', autoSize: true },
            { name: 'Name', prop: "name", sortable: true, order: 'asc', autoSize: true },
            { name: 'Category', prop: "ieCategory", sortable: true, order: 'asc', autoSize: true },
            { name: 'Value', prop: "value", sortable: true, order: 'asc', autoSize: true }
        ]
    }
  },
  computed: {
    transactions() {
      return this.$store.getters["transactions/getTransactions"]
    }
  }
}
</script>