import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const transactions = ref([])
const count = ref([])
const latestTransaction = ref(null)
const totalTransaction = ref(null)
const yesterdayTransaction = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchTransactions () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get('http://127.0.0.1:8000/transactions/?format=json')
    const response2 = await axios.get('http://127.0.0.1:8000/tx_counters/?format=json')
    transactions.value = response.data
    count.value = response2.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTransactions)
setInterval(fetchTransactions, 30000)

watch(transactions, (newTransactions) => {
  if (newTransactions.length > 0) {
    latestTransaction.value = newTransactions[newTransactions.length - 1] // Get the latest
  } else {
    latestTransaction.value = null
    error.value = 'No transactions found.'
  }
})

watch(count, (newTransactions) => {
  if (newTransactions.length > 0) {
    totalTransaction.value = newTransactions[newTransactions.length - 1] // Get the transactions for today
    yesterdayTransaction.value = newTransactions[newTransactions.length - 2] // Get the transactions for yesterday
  } else {
    totalTransaction.value = null
    yesterdayTransaction.value = null
    error.value = 'No transactions found.'
  }
})

export { fetchTransactions, latestTransaction, yesterdayTransaction, totalTransaction }
