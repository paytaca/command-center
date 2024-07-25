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
                  filled dense v-model=selectedLocation
                  input-debounce="0" dark label="Location"
                  :options=locationOptions color="white"
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
            </template>
          </q-fab>

          <!-- Search Filter -->
          <q-input dark dense standout v-model="searchTerm" input-class="text-left" class="">
            <template v-slot:append>
              <q-icon v-if="searchTerm === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="searchTerm = ''" />
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
import { onMounted, ref, computed, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import youIcon from '../assets/you_pin.png'
import merchIcon from '../assets/merchant_pin.png'

import { fetchMerchants, merchants, getUniqueLocations, getUniqueCategories } from 'src/components/methods/fetchMerchants'
onMounted(fetchMerchants)

// Filter text for search
const searchTerm = ref('')

// If true, show vending machines. If false, show merchants.
const vendingMachine = ref(false)

const selectedLocation = ref({ label: 'Default', value: 'all' })
const locationOptions = ref([{ label: 'Default', value: 'all' }])
const selectedCategory = ref({ label: 'Default', value: 'all' })
const categoryOptions = ref([{ label: 'Default', value: 'all' }])

async function fetchAndTransform (fetchFunction, optionsRef) {
  try {
    const uniqueItems = await fetchFunction()
    const transformedItems = uniqueItems
      .filter(item => item != null)
      .map(item => ({
        label: item,
        value: String(item).toLowerCase().replace(/\s+/g, '')
      }))
    optionsRef.value = [{ label: 'Default', value: 'all' }, ...transformedItems]
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

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

// Filtering merchants based on search term and other criteria
const filteredInnerMerchants = computed(() => {
  return merchants.value.filter((merchant) => {
    const matchesSearchTerm = merchant.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const location = merchant.location.city || merchant.location.town
    const matchesLocation = location.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesLoc = selectedLocation.value.value === 'all' ||
      location.toLowerCase() === selectedLocation.value.label.toLowerCase()
    const matchesCategory = selectedCategory.value.value === 'all' ||
      (merchant.category && merchant.category.category && selectedCategory.value.label &&
      merchant.category.category.toLowerCase() === selectedCategory.value.label.toLowerCase())

    return (matchesSearchTerm || matchesLocation) && matchesLoc && matchesCategory
  })
})

const markers = L.markerClusterGroup()

const updateMarkers = async (filteredMerchant) => {
  markers.clearLayers()

  console.log(filteredMerchant)
  const merchantInfo = filteredMerchant.value.map(merchant => merchant)
  console.log(merchantInfo)

  // Add markers to the map
  merchantInfo.forEach((merchant) => {
    // eslint-disable-next-line new-cap
    const marker = new L.marker([merchant.location.latitude, merchant.location.longitude], { icon: merchLocIcon })

    const transactionDate = new Date(merchant.last_transaction_date)
    const currentDate = new Date()
    const timeDifference = currentDate - transactionDate
    let timeText = ''

    // Convert milliseconds to years, months, weeks, days, hours, and minutes
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30))
    const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7))
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    const minutes = Math.floor(timeDifference / (1000 * 60))

    // Choose the appropriate time unit based on the duration
    if (years > 0) {
      timeText = years === 1 ? '1 year ago' : `${years} years ago`
    } else if (months > 0) {
      timeText = months === 1 ? '1 month ago' : `${months} months ago`
    } else if (weeks > 0) {
      timeText = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    } else if (days > 0) {
      timeText = days === 1 ? '1 day ago' : `${days} days ago`
    } else if (hours > 0) {
      timeText = hours === 1 ? '1 hour ago' : `${hours} hours ago`
    } else {
      timeText = minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
    }

    let popupContent = `<div class="sm:w-full rounded-lg q-py-md" style="width: 300px;">
                          <div class="flex row items-center justify-between">
                            <h6 class="col-8 text-bold q-ma-none q-pr-sm">${merchant.name}</h6>`

    popupContent += `<img src="${merchant.logo.url ? merchant.logo.url : 'src/assets/sari_sari_store_120.png'}" alt="${merchant.name} Logo"
                          class="col-4 rounded" style="width:"100px"; max-height:"100px";">`
    popupContent += '</div><div>'
    popupContent += `<p>${merchant.location.city ? merchant.location.city : merchant.location.town}, ${merchant.location.country}</p>`
    // Include last transaction time if available
    if (timeText) {
      popupContent += `<p>Last transaction: ${new Date(merchant.last_transaction_date).toLocaleDateString()} (${timeText})</p>`
    }
    // Include Google Maps link if available
    if (merchant.gmap_business_link) {
      popupContent += `<a href="${merchant.gmap_business_link}" target="_blank">View in Google Map</a>`
    }
    popupContent += '</div></div></div>'

    marker.bindPopup(popupContent)
    markers.addLayer(marker)
  })
  initialMap.value.addLayer(markers)
}

onMounted(async () => {
  initialMap.value = L.map('map', { zoomControl: true, zoom: 1, zoomAnimation: false, fadeAnimation: true, markerZoomAnimation: true }).setView([10.8, 124.387370], 9)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(initialMap.value)

  // Fetch merchants and update merchants.location
  await fetchMerchants()
  await fetchAndTransform(getUniqueLocations, locationOptions)
  await fetchAndTransform(getUniqueCategories, categoryOptions)

  console.log(filteredInnerMerchants)
  updateMarkers(filteredInnerMerchants)

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

watch(searchTerm, async () => {
  updateMarkers(filteredInnerMerchants)
})
watch(selectedLocation, async () => {
  updateMarkers(filteredInnerMerchants)
})
watch(selectedCategory, async () => {
  updateMarkers(filteredInnerMerchants)
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
