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
              <q-select
                v-model="selectedCurrency" dense
                input-debounce="0" label="Select currency"
                :options="currencyOptions" @input="fetchBCHValue"
                behavior="menu"
              />
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
import { ref, onMounted, defineAsyncComponent, watch } from 'vue'
import axios from 'axios'

// Async components
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))

// Reactive states
const bchValue = ref('')
const selectedCurrency = ref('php')
const currencyOptions = ref([
  { label: 'PHP', value: 'php' },
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' },
  { label: 'GBP', value: 'gbp' }
])

// Fetch BCH value
const fetchBCHValue = async () => {
  const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=${selectedCurrency.value}`
  try {
    const response = await axios.get(`${apiURL}`)
    bchValue.value = response.data['bitcoin-cash'][selectedCurrency.value]
    console.log('BCH value:', apiURL.value)
  } catch (error) {
    console.error('Error fetching BCH value:', error)
    bchValue.value = 'Error'
  }
}

// Mounted hook
onMounted(fetchBCHValue)

// Watcher for selectedCurrency
watch(selectedCurrency, fetchBCHValue)
</script>
