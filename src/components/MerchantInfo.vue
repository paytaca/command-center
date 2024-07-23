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
                <!-- Town Filter -->
                <q-select
                  filled dense v-model="selectedTown"
                  input-debounce="0" dark label="Town"
                  :options="townOptions" color="white"
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
              <!--
              <div style="width: 150px;">
                Date Filter
                <q-select
                  filled dense v-model="selectedDate"
                  input-debounce="0" dark label="Last Transaction"
                  :options="dateOptions" color="white"
                  class="col q-ma-xs bg-secondary rounded-borders"
                  behavior="menu" style="font-size: 12px;"
                />
              </div> -->
            </template>
          </q-fab>
          <!-- Search Filter -->
          <q-input dense debounce="300" v-model="searchTerm" placeholder="Search" class="q-ml-md q-mr-none">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-for="merchant in filteredMerchants" :key="merchant.id">
            <q-card bordered flat>
              <q-card-section class="row justify-between items-center bg-grey-3">
                <q-card-section class="q-pt-xs col">
                  <div class="text-overline">{{ merchant.location.city ? merchant.location.city : merchant.location.town }}</div>
                  <div class="text-h6 q-mt-sm q-mb-xs text-bold">{{ merchant.name }}</div>
                  <div class="text-caption text-grey">
                    <div>
                      Category: <span v-if="merchant.category">{{ merchant.category.category }}</span> <span v-else>Not specified</span>
                    </div>
                    <div>Last Transaction: {{ new Date(merchant.last_transaction_date).toLocaleString() }} </div>
                  </div>
                  <q-separator class="q-my-sm"/>
                  <q-btn flat round icon="map">
                    <q-tooltip class="bg-accent">View on Paytaca Map</q-tooltip>
                  </q-btn>

                  <q-btn flat round icon="location_on" @click="openMapLink(merchant.gmap_business_link)" :disable="!merchant.gmap_business_link">
                    <q-tooltip v-if="merchant.gmap_business_link" class="bg-green">View on Google Maps</q-tooltip>
                  </q-btn>
                </q-card-section>
                <q-card-section class="col-3">
                  <q-img
                    key="scale-down" width="100" height="100"
                    fit="scale-down" class="rounded-borders"
                    :src="merchant.logo.url ? merchant.logo.url : 'src/assets/sari_sari_store_120.png'"
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
import { fetchMerchants, merchants, getUniqueCities, getUniqueTowns, getUniqueCategories } from 'src/components/methods/fetchMerchants'

onMounted(fetchMerchants)

const searchTerm = ref('')
const itemsPerPage = ref(9)
const currentPage = ref(1)

const selectedCity = ref({ label: 'Default', value: 'all' }) // Represents the selected city
const cityOptions = ref([
  { label: 'Default', value: 'all' }
]) // Represents the available city options

// Fetches unique cities and transforms them into options for the city filter
onMounted(async () => {
  const uniqueCities = await getUniqueCities()
  const transformedCities = uniqueCities
    .filter(city => city != null) // Filter out null or undefined cities
    .map(city => ({
      label: city, // The city itself can be used as the label
      value: String(city).toLowerCase().replace(/\s+/g, '') // Ensure city is a string and transform it
    }))
  // Prepend the default option and update cityOptions
  cityOptions.value = [{ label: 'Default', value: 'all' }, ...transformedCities]
})

const selectedTown = ref({ label: 'Default', value: 'all' }) // Represents the selected town
const townOptions = ref([
  { label: 'Default', value: 'all' }
]) // Represents the available town options

// Fetches unique towns and transforms them into options for the town filter
onMounted(async () => {
  const uniqueTowns = await getUniqueTowns()
  const transformedTowns = uniqueTowns
    .filter(town => town != null) // Filter out null or undefined cities
    .map(town => ({
      label: town, // The city itself can be used as the label
      value: String(town).toLowerCase().replace(/\s+/g, '') // Ensure city is a string and transform it
    }))
  // Prepend the default option and update cityOptions
  townOptions.value = [{ label: 'Default', value: 'all' }, ...transformedTowns]
})

const selectedCategory = ref({ label: 'Default', value: 'all' }) // Represents the selected town
const categoryOptions = ref([
  { label: 'Default', value: 'all' }
]) // Represents the available category options

// Fetches unique categories and transforms them into options for the vateogry filter
onMounted(async () => {
  const uniqueCategories = await getUniqueCategories()
  const transformedCategories = uniqueCategories
    .filter(category => category != null) // Filter out null or undefined categories
    .map(category => ({
      label: category, // The category itself can be used as the label
      value: String(category).toLowerCase().replace(/\s+/g, '') // Ensure category is a string and transform it
    }))
  // Prepend the default option and update categoryOptions
  categoryOptions.value = [{ label: 'Default', value: 'all' }, ...transformedCategories]
})

// Opens a map link in a new tab.
const openMapLink = (link) => {
  if (link) {
    window.open(link, '_blank')
  }
}

// Filtering merchants based on search term and other criteria
const filteredInnerMerchants = computed(() => {
  return merchants.value.filter((merchant) => {
    const matchesSearchTerm = merchant.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const location = merchant.location.city || merchant.location.town
    const matchesLocation = location.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCity = selectedCity.value.value === 'all' || location.toLowerCase() === selectedCity.value.label.toLowerCase()
    const matchesTown = selectedTown.value.value === 'all' || location.toLowerCase() === selectedTown.value.label.toLowerCase()
    // Check if merchant.category is not null before accessing merchant.category.category
    const matchesCategory = selectedCategory.value.value === 'all' ||
      (merchant.category && merchant.category.category && selectedCategory.value.label &&
      merchant.category.category.toLowerCase() === selectedCategory.value.label.toLowerCase())
    return (matchesSearchTerm || matchesLocation) && matchesCity && matchesTown && matchesCategory
  })
})

// Applying pagination to the filtered list of merchants
const filteredMerchants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInnerMerchants.value.slice(start, end)
})

//  Computes the total number of pages based on the length of the filtered inner
//  merchants array and the number of items per page.
const totalPages = computed(() => Math.ceil(filteredInnerMerchants.value.length / itemsPerPage.value))

</script>
