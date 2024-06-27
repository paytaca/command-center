<template>
  <q-page class="q-pa-md analytics-page"
  style="background: linear-gradient(#4871b8, #1e293b);">
    <div class="row q-col-gutter-md">
      <div class="col-md-3 col-md-3 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(#07ffb8, #037454);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-primary">BCH Value</q-toolbar-title>
            <q-separator />
            <div>
              <q-select v-model="selectedCurrency" :options="currencyOptions" label="Select currency" @input="fetchBCHValue"></q-select>
              <p>BCH Value: {{ bchValue }}</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-md-3 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(#a1bdff, #5e6e94);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-primary">Most Recent Transaction</q-toolbar-title>
            <q-separator />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-6 col-md-6 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(-45deg, #ea5e67, #4b72b8, #2f4775);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Weekly Report</q-toolbar-title>
            <q-separator color="white"/>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-md-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-md-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
    </div>
  </q-page>
</template>

<style>
/* Add this at the end of your <style> section */
@media (min-width: 768px) { /* Adjust this breakpoint as needed */
  .analytics-page {
    min-height: 100vh; /* Make the page fill the viewport height */
  }
}
</style>

<script setup>

import { ref, onMounted, defineAsyncComponent } from 'vue'
import axios from 'axios'

// const WalletStats = defineAsyncComponent(() => import('src/components/charts/WalletStats.vue'))
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))

const bchValue = ref(0)
const selectedCurrency = ref('usd')
const currencyOptions = ref([
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' },
  { label: 'GBP', value: 'gbp' }
  // Add more currencies as needed
])

const fetchBCHValue = async () => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=${selectedCurrency.value}`)
    bchValue.value = response.data['bitcoin-cash'][selectedCurrency.value]
  } catch (error) {
    console.error('Error fetching BCH value:', error)
    bchValue.value = 'Error'
  }
}

onMounted(fetchBCHValue)

// const userCount = ref(true)

// const toggleLeftDrawer = () => {
//   userCount.value = !userCount.value
// }

defineOptions({
  name: 'AnalyticsPage'
})
</script>
