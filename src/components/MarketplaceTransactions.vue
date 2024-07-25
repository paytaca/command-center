<template>
  <q-table
    bordered title="Marketplace Transactions" row-key="name"
    :rows="filteredRows" :columns="columns" class="custom-scrollbar"
    :visible-columns="visibleColumns"
    :rows-per-page-options="[10, 20, 30]"
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
      <!-- Search Filter -->
      <q-input dense debounce="300" v-model="filter" placeholder="Search" class="q-ml-md">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

  </q-table>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Visible columns variable
const visibleColumns = ref(['txid', 'recipient', 'token', 'decimals', 'value', 'received_at'])

// Columns data structure
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
  { name: 'recipient', align: 'left', label: 'Recipient', field: 'recipient', sortable: true },
  { name: 'token', align: 'left', label: 'Token', field: 'token', format: val => val.includes('ct') ? 'BCH (CT)' : 'BCH', sortable: true },
  // { name: 'decimals', align: 'left', label: 'Decimals', field: 'decimals', sortable: true },
  { name: 'value', align: 'left', label: 'Revenue', field: row => row.value * Math.pow(10, -row.decimals), sortable: true },
  { name: 'received_at', align: 'left', label: 'Date', field: 'received_at', sortable: true, format: val => new Date(val).toLocaleString() }
]

// Rows data array
const rows = ref([])

// Filter variable and function
const filter = ref('')
const filteredRows = computed(() => {
  if (!filter.value) {
    return rows.value // Return all rows if there's no filter
  }
  return rows.value.filter(row => row.txid.toLowerCase().includes(filter.value.toLowerCase()))
})

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/transactions/?format=json') // Replace 'YOUR_JSON_URL_HERE' with your actual JSON URL
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    rows.value = data // Assign fetched data to rowsc
    console.log(rows.value)
  } catch (error) {
    console.error('There was a problem fetching the rows data:', error)
  }
})
</script>
