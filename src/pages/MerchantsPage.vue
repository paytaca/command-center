<template>
  <div class="q-mb-xl" style="position: relative;">
    <!-- Floating Header -->
    <div class="header q-ma-md justify-center">
        <div class="q-gutter-y-md column" style="width: 270px; max-width: 100%">
          <q-toolbar class="bg-primary text-white rounded-borders justify-center q-px-none q-mr-none">
            <!-- <q-btn round dense flat icon="tune" @click="toggleLeftDrawer" class="q-mr-md"/> -->
            <q-fab padding="sm" flat icon="tune" class="q-mr-sm" direction="down">
              <template v-slot:icon="{ opened }">
                <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="tune" />
              </template>

              <template v-slot:active-icon="{ opened }">
                <q-icon :class="{ 'example-fab-animate': opened === true }" name="close" />
              </template>

              <q-fab-action color="secondary" padding="0px" square dense >
                <template v-slot:default >
                    <q-select
                      filled dense v-model=selectedCurrency
                      input-debounce="0" dark label="Country"
                      :options=currencyOptions class="col q-ma-xs"
                      @change=selectedCurrency color="white"
                      behavior="menu" style="width: 150px;"
                    />
                    <q-select
                      filled dense v-model=selectedCurrency
                      input-debounce="0" dark label="Category"
                      :options=currencyOptions class="col q-ma-xs"
                      @change=selectedCurrency color="white"
                      behavior="menu" style="width: 200px;"
                    />
                    <q-select
                      filled dense v-model=selectedDate
                      input-debounce="0" dark label="Last Transaction"
                      :options=dateOptions class="col q-ma-xs"
                      @change=selectedCurrency color="white"
                      behavior="menu" style="width: 200px;"
                    />
                </template>
              </q-fab-action>
            </q-fab>

            <q-input dark dense standout v-model="text" input-class="text-left" class="">
              <template v-slot:append>
                <q-icon v-if="text === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
              </template>
            </q-input>
          </q-toolbar>
      </div>
    </div>

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

const map = ref(null)
const text = ref('')
// const leftDrawerOpen = ref(false)

// const toggleLeftDrawer = () => {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }

const selectedCurrency = ref({ label: 'Philippines', value: 'php' })
const currencyOptions = ref([
  { label: 'Philippines', value: 'php' },
  { label: 'Japan', value: 'jpn' }
])

const selectedDate = ref({ label: 'Default', value: 'all' })
const dateOptions = ref([
  { label: 'Default', value: 'all' },
  { label: 'Last 24 hours', value: '1d' },
  { label: 'Last week', value: '1w' },
  { label: 'Last month', value: '1m' },
  { label: 'Last 3 months', value: '3m' },
  { label: '3+ months ago', value: '1w' }
])

// const markers = L.markerClusterGroup()

// const addressPoints = ref(null)

// addressPoints.value.forEach((element, index) => {
//   const each_marker = new L.marker([element.latitude, element.longitude])
//   markers.addLayer(each_marker)
// })

// map.value.addLayer(markers)

onMounted(() => {
  map.value = L.map('map', { zoomControl: false }).setView([10.8, 124.387370], 9)

  // Add a new zoom control in the bottom right corner
  // L.control.zoom({
  //   position: 'bottomright'
  // }).addTo(map.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)

  map.value.locate({ setView: true, watch: true }) /* This will return map so you can do chaining */
    .on('locationfound', function (e) {
      const marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)')
      map.value.addLayer(marker)
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
#map {
  height: calc(100vh - 50.12px); /* 100% of the viewport height */
}
</style>
