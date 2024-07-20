<template>
  <div style="position: relative;">

    <!-- Floating Navigation Header -->
    <div class="header q-ma-md justify-center">
      <div class="q-gutter-y-md" style="width: 270px; max-width: 100%">
        <q-toolbar class="bg-primary text-white rounded-borders justify-center q-px-none q-mr-none">

          <!-- Filter Button -->
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
                  filled dense v-model=selectedCity
                  input-debounce="0" dark label="City"
                  :options=cityOptions color="white"
                  class="col q-ma-xs bg-secondary rounded-borders"
                  behavior="menu" style="font-size: 12px;"
                />
              </div>
              <div style="width: 150px;">

                <!-- Category Filter -->
                <q-select
                filled dense v-model=selectedCategory
                input-debounce="0" dark label="Category"
                :options=categoryOptions color="white"
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
          <q-input dark dense standout v-model="filterText" input-class="text-left" class="">
            <template v-slot:append>
              <q-icon v-if="filterText === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="filterText = ''" />
            </template>
          </q-input>

        </q-toolbar>
      </div>
    </div>

    <!-- Map Pin Toggle (If Merchants or Vending Machines) -->
     <div class="toggleVM">
        <q-toggle v-model="vendingMachine" color="accent"
                  checked-icon="coffee_maker" unchecked-icon="store"
                  size="xl" dense keep-color
        />
     </div>

    <!-- List of Merchants/Vending Machines Button -->
    <q-page-sticky position="bottom-left" :offset="[18, 18]" style="z-index: 1000;">
      <q-btn dense color="secondary" icon="list" label="List" class="q-pr-sm" :to="{ name: 'Details' }"/>
    </q-page-sticky>

    <!-- Map Container -->
    <div id="map"></div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import youIcon from '../assets/you_pin.png'
import merchIcon from '../assets/merchant_pin.png'

import { fetchMerchants, merchants } from 'src/components/methods/fetchMerchants'
onMounted(fetchMerchants)

// Filter text for search
const filterText = ref('')

// If true, show vending machines. If false, show merchants.
const vendingMachine = ref(false)

// City Filter options
const selectedCity = ref({ label: 'Default', value: 'all' })
const cityOptions = ref([
  { label: 'Default', value: 'all' },
  { label: 'Leyte', value: 'leyte' },
  { label: 'Cebu', value: 'cebu' }
])

// Category Filter options
const selectedCategory = ref({ label: 'Default', value: 'all' })
const categoryOptions = ref([
  { label: 'Default', value: 'all' },
  { label: 'Category1', value: 'category1' },
  { label: 'Category2', value: 'category2' }
])

// Date Filter options
const selectedDate = ref({ label: 'Default', value: 'all' })
const dateOptions = ref([
  { label: 'Default', value: 'all' },
  { label: 'Last 24 hours', value: '1d' },
  { label: 'Last week', value: '1w' },
  { label: 'Last month', value: '1m' },
  { label: 'Last 3 months', value: '3m' },
  { label: '3+ months ago', value: '1w' }
])

// Custom icon for the map marker
const yourLocIcon = L.icon({
  iconUrl: youIcon,
  iconSize: [35, 48]
})

const merchLocIcon = L.icon({
  iconUrl: merchIcon,
  iconSize: [35, 48],
  iconAnchor: [17, 48]
})

// Leaflet map
const initialMap = ref(null)

onMounted(async () => {
  initialMap.value = L.map('map', { zoomControl: true, zoom: 1, zoomAnimation: false, fadeAnimation: true, markerZoomAnimation: true }).setView([10.8, 124.387370], 9)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(initialMap.value)

  // Fetch merchants and update merchants.location
  await fetchMerchants()

  const locations = merchants.value.map(merchant => merchant.location)
  const markers = L.markerClusterGroup()

  // Add markers to the map
  locations.forEach((location, index) => {
    // eslint-disable-next-line new-cap
    const marker = new L.marker([location.latitude, location.longitude], { icon: merchLocIcon })
    markers.addLayer(marker)
  })
  initialMap.value.addLayer(markers)

  let userLocationMarker = null

  initialMap.value.locate({ setView: true, watch: false }) /* This will return map so you can do chaining */
    .on('locationfound', function (e) {
      if (!userLocationMarker) {
        userLocationMarker = L.marker([e.latitude, e.longitude], { icon: yourLocIcon }).addTo(initialMap.value)
      } else {
        userLocationMarker.setLatLng([e.latitude, e.longitude])
      }
    })
    .on('locationerror', function (e) {
      console.log(e)
      alert('Location access denied.')
    })
})

</script>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 30px);
  height: 50px;
  color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.toggleVM {
  position: absolute;
  top: 75px;
  left: 0;
  width: 100%;
  z-index: 500;
  display: flex;
  justify-content: center;
}
#map {
  height: calc(100vh - 50.12px); /* 100% of the viewport height */
}
</style>
