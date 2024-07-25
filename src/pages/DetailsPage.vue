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
          <q-tab name="market" label="Marketplace" />
          <q-tab name="merchants" label="Merchants" />
          <q-tab name="vendingmachines" label="Vending Machines" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-secondary">

          <!-- All Transactions Tab Panel -->
          <q-tab-panel name="all">
            <AllTransactions />
          </q-tab-panel>

          <!-- Merketplace Transactions Tab Panel -->
          <q-tab-panel name="market">
            <MerchantTransactions />
          </q-tab-panel>

          <!-- Merchants Tab Panel -->
          <q-tab-panel name="merchants">
            <MerchantInfo />
          </q-tab-panel>

          <!-- Vending Machines Tab Panel -->
          <q-tab-panel name="vendingmachines">
            <div class="row justify-center items-center q-ma-xl text-h6 text-white">
              <q-icon name="construction_" />
              Under construction...
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import AllTransactions from 'src/components/AllTransactions.vue'
import MerchantTransactions from 'src/components/MarketplaceTransactions.vue'
import MerchantInfo from 'src/components/MerchantInfo.vue'

const tab = ref('all')
</script>
