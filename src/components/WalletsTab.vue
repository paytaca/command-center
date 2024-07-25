<template>
  <q-table
    bordered title="Wallets Information" row-key="name"
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
        :options="columns.filter(column => column.name !== 'wallet_id')"
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
const visibleColumns = ref(['wallet_id', 'created_at', 'language', 'currency', 'country'])

// Columns data structure
const columns = [
  {
    name: 'wallet_id',
    required: true,
    label: 'Wallet ID',
    align: 'left',
    field: row => row.wallet_id,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'created_at', align: 'left', label: 'Created at', field: 'created_at', sortable: true, format: val => new Date(val).toLocaleString() },
  { name: 'language', align: 'left', label: 'Language', field: 'language', sortable: true },
  { name: 'currency', align: 'left', label: 'Currency', field: 'currency', sortable: true },
  { name: 'country', align: 'left', label: 'Country', field: 'country', sortable: true }
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
