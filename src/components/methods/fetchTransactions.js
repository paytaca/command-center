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
    const response = await axios.get('http://127.0.0.1:8000/api/transactions/?format=json')
    const response2 = await axios.get('http://127.0.0.1:8000/api/tx_counters/?format=json')
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
    // const newLatestTransaction = newTransactions[newTransactions.length - 1] // Get the latest
    // if (!latestTransaction.value || newLatestTransaction.id !== latestTransaction.value.id) {
    //   // If it's the first time setting latestTransaction or the ID has changed
    //   alert('Latest transaction has changed: ' + JSON.stringify(newLatestTransaction))
    //   latestTransaction.value = newLatestTransaction // Update the latest transaction
    //   // Play sound
    //   const audio = new Audio('') // Replace 'path/to/sound.mp3' with the actual path to your sound file
    //   audio.muted = true
    //   audio.play().catch(error => console.error('Error playing sound:', error))
    // }
  } else {
    latestTransaction.value = null
    error.value = 'No transactions found.'
  }
})

watch(count, (newTransactions) => {
  if (newTransactions.length > 0) {
    const lastTransactionDate = new Date(newTransactions[newTransactions.length - 1].date)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    // Compare the last transaction date to the current date
    if (lastTransactionDate.setHours(0, 0, 0, 0) === currentDate.getTime()) {
      // Last transaction is from today
      totalTransaction.value = newTransactions[newTransactions.length - 1] // Today's transaction
      yesterdayTransaction.value = newTransactions[newTransactions.length - 2] // Yesterday's transaction
    } else {
      // Last transaction is not from today
      totalTransaction.value = { date: new Date().toISOString().split('T')[0], count: 0 }
      yesterdayTransaction.value = newTransactions[newTransactions.length - 1]
    }
  } else {
    totalTransaction.value = null
    yesterdayTransaction.value = null
    error.value = 'No transactions found.'
  }
})

export { fetchTransactions, latestTransaction, yesterdayTransaction, totalTransaction }
