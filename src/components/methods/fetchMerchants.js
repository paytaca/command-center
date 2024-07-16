import { ref, onMounted } from 'vue'
import axios from 'axios'

const merchants = ref([])
// const merchant = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchMerchants () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/map/merchants/?format=json')
    merchants.value = response.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMerchants)
setInterval(fetchMerchants, 30000)

/*
watch(merchants, (newTransactions) => {
  if (newTransactions.length > 0) {
    merchant.value = newTransactions[newTransactions.length - 1]
  } else {
    merchant.value = null
    error.value = 'No transactions found.'
  }
})
*/

export { fetchMerchants, merchants }
