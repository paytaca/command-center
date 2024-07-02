<template>
  <q-page class="q-pa-md analytics-page" style="background: linear-gradient(#4871b8, #1e293b);">
    <div class="row q-col-gutter-md">
      <div class="col-md-3 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(#07ffb8, #037454);">
            <q-img  src="~assets/bch_logo.png" class="bch" />
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-primary">BCH Value</q-toolbar-title>
            <q-separator />
            <div class="column">
              <h3 class="col q-ma-none q-mt-md">
                <a v-show="bchValue != 'Loading...'">{{ currencySymbols[selectedCurrency.value] }}</a> {{ bchValue.toLocaleString() }}
              </h3>
              <div class="row">
                <q-select
                  v-model="selectedCurrency" dense
                  input-debounce="0" label="Select currency"
                  :options="currencyOptions" @input="fetchBCHValue"
                  behavior="menu" class="row justify-end q-mt-sm"
                  style="width: 120px;"
                />
                <p>+++</p>
                <p>---</p>
              </div>

            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-3 col-md-3 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(#5e6e94, #334155);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Most Recent Transaction</q-toolbar-title>
            <q-separator color="white"/>
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

      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>

      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card style="height: 235px; background: linear-gradient(#5e6e94, #334155);">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Recent Onboard Merchant</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-5 col-md-4 col-sm-12 col-xs-12">
        <q-card style="height: 235px; background: linear-gradient(#5e6e94, #334155);">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Social Media Statistics</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12">
        <q-card style="height: 235px; background: linear-gradient(#5e6e94, #334155);">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Vending Machine Status</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import axios from 'axios'

// Async components
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))
let lastRequestTime = 0
const requestThreshold = 5000
const currentTime = ref(null)

// Reactive states
const bchValue = ref('')
const selectedCurrency = ref({ label: '₱ PHP', value: 'php' })
const currencyOptions = ref([
  { label: '₱ PHP', value: 'php' },
  { label: '$ USD', value: 'usd' },
  { label: '€ EUR', value: 'eur' }
])
const currencySymbols = ref({
  php: '₱',
  usd: '$',
  eur: '€'
})

// Fetch BCH value
const fetchBCHValue = async () => {
  currentTime.value = Date.now()
  if (currentTime.value - lastRequestTime < requestThreshold) {
    const waitTime = requestThreshold - (currentTime.value - lastRequestTime)
    console.log(`Waiting ${waitTime}ms to avoid rate limit...`)
    bchValue.value = 'Loading...'
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  const apiURL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=' + selectedCurrency.value.value
  try {
    const response = await axios.get(apiURL)
    bchValue.value = response.data['bitcoin-cash'][selectedCurrency.value.value]
    lastRequestTime = Date.now() // Update the timestamp of the last request
    console.log(Date.now())
  } catch (error) {
    console.error('Error fetching BCH value:', error)
    bchValue.value = 'Error'
  }
}

onMounted(() => {
  fetchBCHValue()
})
</script>

<style>
.bch {
  width: 130px;
  height: 130px;
  margin: 10px;
  position: absolute;
  overflow: auto;
  bottom: 0;
  right: 0;
  max-width: 100%;
  opacity: 0.5;
}

/* @media (min-width: 768px) {
  .analytics-page {
    min-height: 100vh;
  }
} */
</style>
