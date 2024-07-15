<template>
  <q-table
    bordered title="All Transactions" row-key="name"
    :rows="rows" :columns="columns" class="custom-scrollbar"
    :visible-columns="visibleColumns"
    style="max-height: 913px;" no-data-label="No data available"
    separator="cell"
  >
    <template v-slot:top-right>
      <q-select
        v-model="visibleColumns" multiple outlined
        dense options-selected-class="bg-secondary text-white"
        options-dense :display-value="$q.lang.table.columns"
        emit-value option-value="name"
        :options="columns.filter(column => column.name !== 'txid')"
      />
    </template>

  </q-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const columns = [
  {
    name: 'txid',
    required: true,
    label: 'Transaction ID',
    align: 'left',
    field: row => row.txid,
    format: val => `${val}`,
    sortable: true,
    classes: 'col-3'
  },
  { name: 'recipient', align: 'left', label: 'Recipient', field: 'recipient' },
  { name: 'token', align: 'left', label: 'Token', field: 'token', sortable: true },
  { name: 'decimals', align: 'left', label: 'Decimals', field: 'decimals', sortable: true },
  { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true },
  { name: 'date', align: 'left', label: 'Recieved at', field: 'date', sortable: true }
  // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = ref([]) // Initialize rows as an empty array

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/transactions/?format=json') // Replace 'YOUR_JSON_URL_HERE' with your actual JSON URL
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    rows.value = data // Assign fetched data to rows
  } catch (error) {
    console.error('There was a problem fetching the rows data:', error)
  }
})

const visibleColumns = ref(['txid', 'recipient', 'token', 'decimals', 'value', 'date'])
</script>

<style scoped>
.custom-scrollbar ::-webkit-scrollbar {
  max-width: 5px; /* Width of the scrollbar */
}

.custom-scrollbar ::-webkit-scrollbar-track {
  background: #ffffff; /* Color of the tracking area */
}

.custom-scrollbar ::-webkit-scrollbar-thumb {
  background: #cecece; /* Color of the scrollbar itself */
  border-radius: 20px; /* Roundness of the scrollbar */
  width: 5px; /* Width of the scrollbar */
}

.custom-scrollbar ::-webkit-scrollbar-thumb:hover {
  background: #808080; /* Color when hovering over the scrollbar */
}
</style>
