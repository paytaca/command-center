<template>
  <div>
    <q-card class="items-start">
      <div class="row justify-between items-end">
        <q-toolbar-title class="text-h7 q-pt-md q-mx-md q-mt-xs">Merchant Information</q-toolbar-title>

        <div class="row justify-end items-center q-mr-md">
          <q-fab padding="sm" flat icon="tune" class="q-mr-sm" direction="down">
            <template v-slot:icon="{ opened }">
              <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="tune" />
            </template>
            <template v-slot:active-icon="{ opened }">
              <q-icon :class="{ 'example-fab-animate': opened === true }" name="close" />
            </template>
            <template v-slot:default>
              <div style="width: 150px;">
                <!-- City Filter -->
                <q-select
                  filled dense v-model="selectedCity"
                  input-debounce="0" dark label="City"
                  :options="cityOptions" color="white"
                  class="col q-ma-xs bg-secondary rounded-borders"
                  behavior="menu" style="font-size: 12px;"
                />
              </div>
              <div style="width: 150px;">
                <!-- Category Filter -->
                <q-select
                  filled dense v-model="selectedCategory"
                  input-debounce="0" dark label="Category"
                  :options="categoryOptions" color="white"
                  class="col q-ma-xs bg-secondary rounded-borders"
                  behavior="menu" style="font-size: 12px;"
                />
              </div>
              <div style="width: 150px;">
                <!-- Date Filter -->
                <q-select
                  filled dense v-model="selectedDate"
                  input-debounce="0" dark label="Last Transaction"
                  :options="dateOptions" color="white"
                  class="col q-ma-xs bg-secondary rounded-borders"
                  behavior="menu" style="font-size: 12px;"
                />
              </div>
            </template>
          </q-fab>
          <!-- Search Filter -->
          <q-input dense debounce="300" v-model="filter" placeholder="Search" class="q-ml-md q-mr-none">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-for="merchant in merchants" :key="merchant.id">
            <q-card bordered flat>
              <q-card-section class="row justify-between items-center">
                <q-card-section class="q-pt-xs col">
                  <div class="text-overline">[Location]</div>
                  <div class="text-h6 q-mt-sm q-mb-xs text-bold">{{ merchant.name }}</div>
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
                    key="scale-down"
                    src="../assets/logo.png"
                    fit="scale-down"
                    class="rounded-borders"
                    style="max-width: 100px; max-height: 100px;"
                  />
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          input
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
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
