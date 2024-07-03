<template>
  <div class="map-container q-mb-xl">
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
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)
})
</script>

<style scoped>
#map {
  position: absolute;
  height: calc(100vh - 50.1px); /* 100% of the viewport height */
  width: 100vw; /* 100% of the viewport width */
}
</style>
