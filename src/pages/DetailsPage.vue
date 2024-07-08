<template>
  <q-page class="q-pa-md" style="background: linear-gradient(#1e293b,#44566e);">
    <div class="q-gutter-y-md" style="max-width: 100vw">
      <q-card class="bg-transparent">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey bg-secondary"
          active-color="white"
          indicator-color="white"
          align="justify"
        >
          <q-tab name="merchants" label="Merchants" />
          <q-tab name="vendingmachines" label="Vending Machines" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="merchants">
            <q-table
              flat bordered
              title="Treats"
              :rows="rows"
              :columns="columns"
              row-key="name"
              :visible-columns="visibleColumns"
            >
              <template v-slot:top>
                <q-icon name="store" />
                <q-toolbar-title>Merchant Transactions</q-toolbar-title>

                <q-space />

                <q-select
                  v-model="visibleColumns"
                  multiple
                  outlined
                  dense options-selected-class="bg-secondary text-white"
                  options-dense
                  :display-value="$q.lang.table.columns"
                  emit-value
                  :options="columns.filter(column => column.name !== 'name')"
                  option-value="name"
                />
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="vendingmachines">
            <q-table
              flat bordered
              title="Treats"
              :rows="rows"
              :columns="columns"
              row-key="name"
              :visible-columns="visibleColumns"
            >
              <template v-slot:top>
                <q-icon name="store" />
                <q-toolbar-title>Vending Machine Transactions</q-toolbar-title>

                <q-space />

                <q-select
                  v-model="visibleColumns"
                  multiple
                  outlined
                  dense options-selected-class="bg-secondary text-white"
                  options-dense
                  :display-value="$q.lang.table.columns"
                  emit-value
                  :options="columns.filter(column => column.name !== 'name')"
                  option-value="name"
                />
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Transaction ID',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'senderID', align: 'center', label: 'Sender ID', field: 'senderID', sortable: true },
  { name: 'receiverID', align: 'center', label: 'Receiver ID', field: 'receiverID', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = [
  {
    name: 's250asz9cc0dsasdadsadsadsadsadsa',
    senderID: 159,
    receiverID: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    senderID: 237,
    receiverID: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    senderID: 262,
    receiverID: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    senderID: 305,
    receiverID: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    senderID: 356,
    receiverID: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    senderID: 375,
    receiverID: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    senderID: 392,
    receiverID: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    senderID: 408,
    receiverID: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    senderID: 452,
    receiverID: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    senderID: 518,
    receiverID: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

const tab = ref('mails')
const visibleColumns = ref(['senderID', 'desc', 'receiverID', 'carbs', 'protein', 'sodium', 'calcium', 'iron'])
</script>
