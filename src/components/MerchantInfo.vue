<template>
  <div>
    <q-card class="items-start">
      <q-toolbar-title class="text-h7 q-pt-md q-mx-md">Merchant Information</q-toolbar-title>

      <q-separator class="q-mt-sm q-mx-md"/>

      <q-card-section>

        <div class="row q-col-gutter-md">
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-for="merchant in merchants" :key="merchant.name">
            <q-card bordered flat>
              <q-card-section class="row justify-between items-center">
                <q-card-section class="q-pt-xs col">
                  <div class="text-overline">[Location]</div>
                  <div class="text-h5 q-mt-sm q-mb-xs text-bold">{{ merchant.name }}</div>
                  <div class="text-caption text-grey">
                    <div>Category: Shop</div>
                    <div>Last Transaction: {{ merchant.last_transaction_date }} </div>
                  </div>

                  <q-separator class="q-my-sm"/>

                  <q-btn flat round icon="map">
                    <q-tooltip class="bg-accent">View on Paytaca Map</q-tooltip>
                  </q-btn>

                  <q-btn flat round icon="location_on" href="${merchant.gmap_business_link}">
                    <q-tooltip class="bg-green">{{merchant.gmap_business_link}}</q-tooltip>
                  </q-btn>

                </q-card-section>

                <q-card-section class="col-3">
                  <q-img
                    key='scale-down'
                    src="../assets/logo.png"
                    fit='scale-down'
                    class="rounded-borders"
                    style="max-width: 100px; max-height: 100px;"
                  />
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>

      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { fetchMerchants, merchants } from 'src/components/methods/fetchMerchants'

onMounted(fetchMerchants)

// const methods = {
//   openMapLink () {
//     // Replace 'YOUR_MAP_LINK_HERE' with your actual map link
//     const mapLink = merchants.gmap_business_link
//     window.open(mapLink, '_blank')
//   }
// }

</script>

<style>

</style>
