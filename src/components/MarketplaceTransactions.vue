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
const visibleColumns = ref(['total_amount', 'revenue', 'order_time', 'delivery_time', 'delivery_fee', 'date', 'merchant', 'rider'])

// Columns data structure
const columns = [
  {
    name: 'order_id',
    required: true,
    label: 'Order ID',
    align: 'left',
    field: row => row.order_id,
    format: val => `${val}`,
    sortable: true,
    classes: 'col-3'
  },
  { name: 'total_amount', align: 'left', label: 'Total Amount', field: 'total_amount', sortable: true },
  { name: 'revenue', align: 'left', label: 'Revenue', field: 'revenue', sortable: true },
  { name: 'order_time', align: 'left', label: 'Ordered on', field: 'order_time', sortable: true },
  { name: 'delivery_time', align: 'left', label: 'Delivered on', field: 'delivered_time', sortable: true },
  { name: 'delivery_fee', align: 'left', label: 'Delivery Fee', field: 'delivery_fee', sortable: true },
  { name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true, format: val => new Date(val).toLocaleString() },
  { name: 'merchant', align: 'left', label: 'Merchant', field: row => row.merchant.name, sortable: true },
  { name: 'rider', align: 'left', label: 'Rider', field: row => row.rider.name, sortable: true }
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
    const response = await fetch('http://127.0.0.1:8000/api/marketplace/orders/?format=json')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    rows.value = data // Assign fetched data to rows
    console.log(data)
  } catch (error) {
    console.error('There was a problem fetching the rows data:', error)
  }
})
</script>
