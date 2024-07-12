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
          <q-tab name="merchants" label="Merchants" />
          <q-tab name="vendingmachines" label="Vending Machines" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-secondary">

          <!-- Merchants Tab Panel -->
          <q-tab-panel name="merchants">
            <MerchantTransactions />
            <MerchantInfo />
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
import MerchantTransactions from 'src/components/MerchantTransactions.vue'
import MerchantInfo from 'src/components/MerchantInfo.vue'

const tab = ref('merchants')
</script>
