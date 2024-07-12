<template>
  <q-table
    bordered title="Merchant Transactions"
    :rows="rows" :columns="columns" class="q-mb-md"
    row-key="name" :visible-columns="visibleColumns"
  >
    <template v-slot:top>
      <q-icon name="store" />
      <q-toolbar-title>Merchant Transactions</q-toolbar-title>

      <q-space />

      <q-select
        v-model="visibleColumns" multiple outlined
        dense options-selected-class="bg-secondary text-white"
        options-dense :display-value="$q.lang.table.columns"
        emit-value option-value="name"
        :options="columns.filter(column => column.name !== 'name')"
      />
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'txid',
    required: true,
    label: 'Transaction ID',
    align: 'left',
    field: row => row.txid,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'recipient', align: 'left', label: 'Recipient', field: 'recipient' },
  { name: 'token', align: 'left', label: 'Token', field: 'token', sortable: true },
  { name: 'decimals', align: 'left', label: 'Decimals', field: 'decimals', sortable: true },
  { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true },
  { name: 'date', align: 'left', label: 'Recieved at', field: 'date', sortable: true }
  // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = [
  {
    txid: 's250asz9cc0dsasdadsadsadsadsadsa',
    recipient: 159,
    token: 6.0,
    decimals: 24,
    value: 4.0,
    date: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    txid: 'Ice cream sandwich',
    recipient: 237,
    token: 9.0,
    decimals: 37,
    value: 4.3,
    date: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    txid: 'Eclair',
    recipient: 262,
    token: 16.0,
    decimals: 23,
    value: 6.0,
    date: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    txid: 'Cupcake',
    recipient: 305,
    token: 3.7,
    decimals: 67,
    value: 4.3,
    date: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    txid: 'Gingerbread',
    recipient: 356,
    token: 16.0,
    decimals: 49,
    value: 3.9,
    date: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    txid: 'Jelly bean',
    recipient: 375,
    token: 0.0,
    decimals: 94,
    value: 0.0,
    date: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    txid: 'Lollipop',
    recipient: 392,
    token: 0.2,
    decimals: 98,
    value: 0,
    date: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    txid: 'Honeycomb',
    recipient: 408,
    token: 3.2,
    decimals: 87,
    value: 6.5,
    date: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    txid: 'Donut',
    recipient: 452,
    token: 25.0,
    decimals: 51,
    value: 4.9,
    date: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    txid: 'KitKat',
    recipient: 518,
    token: 26.0,
    decimals: 65,
    value: 7,
    date: 54,
    calcium: '12%',
    iron: '6%'
  }
]

const visibleColumns = ref(['recipient', 'token', 'decimals', 'value', 'date', 'date', 'calcium', 'iron'])
</script>
