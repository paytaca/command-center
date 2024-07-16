import { ref, onMounted } from 'vue'
import axios from 'axios'

const merchants = ref([])
const locations = ref([])
// const merchant = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchMerchants () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/map/merchants/?format=json')
    const responseLoc = await axios.get('http://127.0.0.1:8000/api/map/locations/?format=json')
    merchants.value = response.data
    locations.value = responseLoc.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMerchants)
setInterval(fetchMerchants, 30000)

export { fetchMerchants, merchants, locations }
