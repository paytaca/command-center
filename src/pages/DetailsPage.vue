<template>
  <q-page class="q-pa-lg" style="background: linear-gradient(#1e293b,#44566e);">
    <div class="q-gutter-y-md" style="max-width: 100vw">
      <q-card class="bg-transparent">

        <!-- Tabs -->
        <q-tabs
          v-model="tab" dense
          class="text-grey"
          active-color="white" indicator-color="white"
          style="background: linear-gradient(#1e293b,#44566e);"
          align="justify" :default-tab="merchants"
        >
          <q-tab name="all" label="All Transactions" />
          <q-tab name="merchants" label="Merchants" />
          <q-tab name="vendingmachines" label="Vending Machines" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-secondary">

          <!-- All Transactions Tab Panel -->
          <q-tab-panel name="all">
            <AllTransactions />
          </q-tab-panel>

          <!-- Merchants Tab Panel -->
          <q-tab-panel name="merchants">
            <MerchantTransactions v-if="merchSwitch"/>
            <MerchantInfo v-if="!merchSwitch"/>

            <q-page-sticky position="bottom" :offset="[18, 18]">
              <q-toggle v-model="merchSwitch" color="accent"
                        checked-icon="receipt_long" unchecked-icon="store"
                        size="xl" dense  class="toggleVM" keep-color
              >
                <q-tooltip class="bg-white text-primary">View Toggle</q-tooltip>
              </q-toggle>
            </q-page-sticky>
          </q-tab-panel>

          <!-- Vending Machines Tab Panel -->
          <q-tab-panel name="vendingmachines">

          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import AllTransactions from 'src/components/AllTransactions.vue'
import MerchantTransactions from 'src/components/MerchantTransactions.vue'
import MerchantInfo from 'src/components/MerchantInfo.vue'

const merchSwitch = ref(false)
const tab = ref('all')
</script>
