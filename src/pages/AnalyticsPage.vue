<template>
  <q-page class="q-pa-md analytics-page" style="background: linear-gradient(#4871b8, #1e293b);">
    <div class="row q-col-gutter-md">

      <!-- BCH Value Card -->
      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(#07ffb8, #037454);">
            <q-img  src="~assets/bch_logo.png" class="bch" />
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-primary">BCH Value</q-toolbar-title>
            <q-separator />
            <div class="column">
              <h3 class="col q-ma-none q-mt-md">
                <a v-show="bchValue != 'Loading...'">{{ currencySymbols[selectedCurrency.value] }}</a> {{ bchValue.toLocaleString() }}
              </h3>
              <div class="row items-end">
                <q-select
                  v-model="selectedCurrency" dense
                  input-debounce="0" label="Select currency"
                  :options="currencyOptions" @input="recentTransactionsBCHValue"
                  behavior="menu" class="row justify-end q-mt-sm"
                  style="width: 120px;"
                />
                <p dense class="row text-caption q-mb-none q-ml-md" v-show="bchValue != 'Loading...'">as of {{ currentFormattedDate }}, <br> {{ currentFormattedTime }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Trasaction Card -->
      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" v-if="true">
        <q-card style="height: 200px;" class="gradientDark">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Most Recent Transaction</q-toolbar-title>
            <q-separator color="white"/>
            <p>ID: {{ recentTransactions.latestTransaction.id }}</p>
            <p>Transaction ID: {{ recentTransactions.latestTransaction.txid }}</p>
            <p>Recipient: {{ recentTransactions.latestTransaction.recipient }}</p>
            <p>Token: {{ recentTransactions.latestTransaction.token }}</p>
            <p>Decimals: {{ recentTransactions.latestTransaction.decimals }}</p>
            <p>Value: {{ recentTransactions.latestTransaction.value }}</p>
            <p>Received At: {{ formatTimestamp(recentTransactions.latestTransaction.received_at) }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Weekly Report Card -->
      <div class="col-lg-6 col-md-4 col-sm-12 col-xs-12" v-if="totalTransaction">
        <q-card style="height: 200px; background: linear-gradient(-45deg, #ea5e67, #4b72b8, #2f4775);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Weekly Report</q-toolbar-title>
            <q-separator color="white"/>
            <p>Total Transactions Today: {{ totalTransaction.count }}</p>
            <p>Date: {{ totalTransaction.date }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Statistics Charts -->
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <TransactionStats />
      </div>

      <!-- Upcoming Events Card -->
      <div class="col-lg-5 col-md-4 col-sm-12 col-xs-12">
        <q-card style="height: 235px;" class="gradientDark">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Upcoming Events</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>

      <!-- New Merchant Card -->
      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <q-card style="height: 235px;" class="gradientDark">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Recent Onboard Merchant</q-toolbar-title>
            <q-separator color="white"/>
          </q-card-section>
        </q-card>
      </div>

      <!-- Vending Machine Status Card -->
      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <q-card style="height: 235px;" class="gradientDark">
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
import { ref, onMounted, defineAsyncComponent, watch } from 'vue'
import axios from 'axios'
import * as recentTransactions from 'src/components/methods/recentTransactionsTransactions.js'

// Components
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))

// Request throttling variables
let lastRequestTime = 0
const requestThreshold = 5000

// BCH value variables
const bchValue = ref('Loading...')

// Date and time variables
const currentFormattedDate = ref(null)
const currentFormattedTime = ref(null)
const currentTime = ref(null)

// Date and time formatting functions
const currentFormattedDate2 = () => {
  const currentTime2 = ref(new Date())
  currentFormattedDate.value = currentTime2.value.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const currentFormattedTime2 = () => {
  const currentTime2 = ref(new Date())
  currentFormattedTime.value = currentTime2.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Currency selection variables
const selectedCurrency = ref({ label: '₱ PHP', value: 'php' })
const currencyOptions = ref([
  { label: 'PHP', value: 'php' },
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' }
])
const currencySymbols = ref({
  php: '₱',
  usd: '$',
  eur: '€'
})

// recentTransactions BCH value with caching and backoff strategy (uses CoinGecko API)
const recentTransactionsBCHValue = async () => {
  currentTime.value = Date.now()
  if (currentTime.value - lastRequestTime < requestThreshold) {
    const waitTime = requestThreshold - (currentTime.value - lastRequestTime)
    bchValue.value = 'Loading...'
    console.log(`Waiting ${waitTime}ms to avoid rate limit...`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=${selectedCurrency.value.value}`
  try {
    const response = await axios.get(apiURL)
    bchValue.value = response.data['bitcoin-cash'][selectedCurrency.value.value]
    lastRequestTime = Date.now() // Update the timestamp of the last request
    currentFormattedDate2()
    currentFormattedTime2()
  } catch (error) {
    const backoffTime = calculateBackoffTime()
    console.log(`Rate limit exceeded. Retrying in ${backoffTime}ms...`)
    await new Promise(resolve => setTimeout(resolve, backoffTime))
    return recentTransactionsBCHValue() // Retry recentTransactionsing the BCH value
  }
}

// Exponential backoff strategy for rate limiting
let retryAttempt = 0
const calculateBackoffTime = () => {
  const backoffDelay = Math.pow(2, retryAttempt) * 1000 // Exponential backoff formula
  retryAttempt++
  return backoffDelay
}

// recentTransactions BCH value on page load and every minute
onMounted(() => {
  recentTransactionsBCHValue()
  setInterval(recentTransactionsBCHValue, 60000)
})

// Watch for changes in the selected currency
watch(selectedCurrency, recentTransactionsBCHValue)

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString() // Adjust format as needed
}

// recentTransactions total transactions
const transactions2 = ref([])
const totalTransaction = ref(null)
const loading2 = ref(true)
const error2 = ref(null)

const recentTransactionsTransactions2 = async () => {
  loading2.value = true
  try {
    const response = await axios.get('http://127.0.0.1:8000/tx_counters/?format=json')
    transactions2.value = response.data
  } catch (err) {
    error2.value = err.message || 'Error recentTransactionsing data'
    console.error(err)
  } finally {
    loading2.value = false
  }
}

// Watch for changes in 'transactions2' to update 'totalTransaction'
watch(transactions2, (newTransactions2) => {
  if (newTransactions2.length > 0) {
    totalTransaction.value = newTransactions2[newTransactions2.length - 1] // Get the transactions today
  } else {
    totalTransaction.value = null
    error2.value = 'No transactions found.'
  }
})

onMounted(recentTransactionsTransactions2) // recentTransactions data on component mount

// Periodically rerecentTransactions data for updates
setInterval(recentTransactionsTransactions2, 30000) // recentTransactions every 30 seconds

</script>

<style>
.carousel {
  height: 525px;
  background-color: rgba(0, 0, 0, 0);
}
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
.gradientDark {
  background: linear-gradient(#3b5c8b, #334155);
}
</style>
