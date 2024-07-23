import { ref, onMounted } from 'vue'
import axios from 'axios'

const merchants = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchMerchants () {
  loading.value = true
  try {
    const urls = [
      'http://127.0.0.1:8000/api/map/merchants/?format=json',
      'http://127.0.0.1:8000/api/map/locations/?format=json',
      'http://127.0.0.1:8000/api/map/logos/?format=json',
      'http://127.0.0.1:8000/api/map/categories/?format=json'
    ]
    const [merchantApi, locationApi, logoApi, categoryApi] = await Promise.all(urls.map(url => axios.get(url)))
    merchants.value = merchantApi.data.map(merchant => ({
      ...merchant,
      location: locationApi.data.find(location => merchant.id === location.merchant),
      logo: logoApi.data.find(logo => merchant.id === logo.merchant),
      category: categoryApi.data.find(category => merchant.id === category.merchant) ?? null
    }))
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function getUniqueCities () {
  try {
    const { data: locations } = await axios.get('http://127.0.0.1:8000/api/map/locations/?format=json')
    return [...new Set(locations.map(location => location.city))]
  } catch (err) {
    console.error('Error fetching unique cities:', err)
    return []
  }
}

async function getUniqueTowns () {
  try {
    const { data: locations } = await axios.get('http://127.0.0.1:8000/api/map/locations/?format=json')
    return [...new Set(locations.map(location => location.town))]
  } catch (err) {
    console.error('Error fetching unique cities:', err)
    return []
  }
}

async function getUniqueCategories () {
  try {
    const { data: categories } = await axios.get('http://127.0.0.1:8000/api/map/categories/?format=json')
    return [...new Set(categories.map(category => category.category))]
  } catch (err) {
    console.error('Error fetching unique category:', err)
    return []
  }
}

onMounted(fetchMerchants)
setInterval(fetchMerchants, 2000)

export { fetchMerchants, merchants, getUniqueCities, getUniqueTowns, getUniqueCategories }
