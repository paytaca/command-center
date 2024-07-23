import { ref, onMounted } from 'vue'
import axios from 'axios'

const merchants = ref([])
// const merchant = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchMerchants () {
  loading.value = true
  try {
    const merchantApi = await axios.get('http://127.0.0.1:8000/api/map/merchants/?format=json')
    const locationApi = await axios.get('http://127.0.0.1:8000/api/map/locations/?format=json')
    const logoApi = await axios.get('http://127.0.0.1:8000/api/map/logos/?format=json')
    const categoryApi = await axios.get('http://127.0.0.1:8000/api/map/categories/?format=json')
    merchants.value = merchantApi.data
    merchants.value.forEach((merchant) => {
      merchant.location = locationApi.data.find((location) => merchant.id === location.merchant)
      merchant.logo = logoApi.data.find((logo) => merchant.id === logo.merchant)
      merchant.category = categoryApi.data.find((category) => merchant.id === category.merchant) ?? null
    })
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function mainFilter (selectedCity) {
  console.log(merchants.value)
  console.log(selectedCity)
  console.log('Before filtering')
  const filteredData = merchants.value.filter((merchant) => {
    return merchant.location.city === selectedCity
  })
  console.log('YAHOOO')
  console.log(filteredData)
  return filteredData
}

onMounted(fetchMerchants)
setInterval(fetchMerchants, 2000)

export { fetchMerchants, merchants, mainFilter }
