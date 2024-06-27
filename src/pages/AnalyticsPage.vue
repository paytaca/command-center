<template>
  <q-page class="q-pa-md analytics-page"
  style="background: linear-gradient(#4871b8, #1e293b);">
    <div class="row q-col-gutter-md">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <WalletStats />
      </div>
      <div class="col-md-6 col-md-6 col-sm-12 col-xs-12">
        <WalletStats />
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
import { defineAsyncComponent } from 'vue'

const WalletStats = defineAsyncComponent(() => import('src/components/charts/WalletStats.vue'))
const TransactionStats = defineAsyncComponent(() => import('src/components/charts/TransactionStats.vue'))

// const userCount = ref(true)

// const toggleLeftDrawer = () => {
//   userCount.value = !userCount.value
// }

defineOptions({
  name: 'AnalyticsPage'
})
</script>
