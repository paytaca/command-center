<template>
  <q-page class="q-pa-md analytics-page" style="background: linear-gradient(#4871b8, #1e293b);">
    <div class="row q-col-gutter-md">
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
                  :options="currencyOptions" @input="fetchBCHValue"
                  behavior="menu" class="row justify-end q-mt-sm"
                  style="width: 120px;"
                />
                <p dense class="row text-caption q-mb-none q-ml-md">as of {{ currentFormattedDate }}, <br> {{ currentFormattedTime }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <q-card style="height: 200px;" class="gradientDark">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Most Recent Transaction</q-toolbar-title>
            <q-separator color="white"/>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-6 col-md-4 col-sm-12 col-xs-12">
        <q-card style="height: 200px; background: linear-gradient(-45deg, #ea5e67, #4b72b8, #2f4775);">
          <q-card-section>
            <q-toolbar-title class="text-h6 text-bold text-white">Weekly Report</q-toolbar-title>
            <q-separator color="white"/>
          </q-card-section>
        </q-card>
      </div>
<!--
      <div class="col-lg-12">
        <q-carousel
          swipeable
          animated
          v-model="slide"
          :autoplay="autoplay"
          ref="carousel"
          infinite
        >
          <q-carousel-slide :name="1" class="row"> -->
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <TransactionStats />
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <TransactionStats />
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <TransactionStats />
            </div>
          <!-- </q-carousel-slide>
          <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
          <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

          <template v-slot:control>
            <q-carousel-control
              position="top-right"
              :offset="[18, 18]"
              class="text-white rounded-borders"
              style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
            >
              <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
            </q-carousel-control>

            <q-carousel-control
              position="bottom-right"
              :offset="[18, 18]"
              class="q-gutter-xs"
            >
              <q-btn
                push round dense color="orange" text-color="black" icon="arrow_left"
                @click="$refs.carousel.previous()"
              />
              <q-btn
                push round dense color="orange" text-color="black" icon="arrow_right"
                @click="$refs.carousel.next()"
              />
            </q-carousel-control>
          </template>
        </q-carousel>

      </div> -->

      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card style="height: 235px;" class="gradientDark">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Upcoming Events</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <q-card style="height: 235px;" class="gradientDark">
          <q-card-section class="align-center">
            <q-toolbar-title class="text-h6 text-bold text-white">Recent Onboard Merchant</q-toolbar-title>
            <q-separator color="white"/>

          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
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

// Async components
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))
let lastRequestTime = 0
const requestThreshold = 5000
// const slide = ref(1)
// const autoplay = ref(false)

const currentFormattedDate2 = () => {
  const currentTime2 = ref(new Date())
  currentFormattedDate.value = currentTime2.value.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const currentFormattedTime2 = () => {
  const currentTime2 = ref(new Date())
  currentFormattedTime.value = currentTime2.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const currentFormattedDate = ref(null)
const currentFormattedTime = ref(null)
const currentTime = ref(null)

const bchValue = ref('Loading...')

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

// Fetch BCH value with caching and backoff strategy
const fetchBCHValue = async () => {
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
    if (error.response && error.response.status === 429) {
      // Implement exponential backoff if error 429 is encountered
      const backoffTime = calculateBackoffTime()
      console.log(`Rate limit exceeded. Retrying in ${backoffTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, backoffTime))
      return fetchBCHValue() // Retry fetching the BCH value
    }
    console.error('Error fetching BCH value:', error)
    bchValue.value = 'Error'
  }
}

// Example exponential backoff calculation function
let retryAttempt = 0
const calculateBackoffTime = () => {
  const backoffDelay = Math.pow(2, retryAttempt) * 1000 // Exponential backoff formula
  retryAttempt++
  return backoffDelay
}

onMounted(() => {
  fetchBCHValue()
  setInterval(fetchBCHValue, 60000)
})

watch(selectedCurrency, fetchBCHValue)
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

.gradientDark {
  background: linear-gradient(#3b5c8b, #334155);
}

/* @media (min-width: 768px) {
  .analytics-page {
    min-height: 100vh;
  }
} */
</style>
