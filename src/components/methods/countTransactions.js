import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const transactions = ref([])
const totalTransaction = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchTransactionsCount () {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:8000/tx_counters/?format=json')
    transactions.value = response.data
    console.log('test: ' + transactions.value)
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTransactionsCount)
setInterval(fetchTransactionsCount, 30000)

watch(transactions, (newTransactions) => {
  if (newTransactions.length > 0) {
    totalTransaction.value = newTransactions[newTransactions.length - 1] // Get the latest transaction
  } else {
    totalTransaction.value = null
    error.value = 'No transactions found.'
  }
})

export { fetchTransactionsCount, totalTransaction }

// // Fetch total transactions
// const transactions2 = ref([])
// const totalTransaction = ref(null)
// const loading2 = ref(true)
// const error2 = ref(null)

// const recentTransactions2 = async () => {
//   loading2.value = true
//   try {
//     const response = await axios.get('http://127.0.0.1:8000/tx_counters/?format=json')
//     transactions2.value = response.data
//   } catch (err) {
//     error2.value = err.message || 'Error recentTransactionsing data'
//     console.error(err)
//   } finally {
//     loading2.value = false
//   }
// }

// // Watch for changes in 'transactions2' to update 'totalTransaction'
// watch(transactions2, (newTransactions2) => {
//   if (newTransactions2.length > 0) {
//     totalTransaction.value = newTransactions2[newTransactions2.length - 1] // Get the transactions today
//   } else {
//     totalTransaction.value = null
//     error2.value = 'No transactions found.'
//   }
// })

// onMounted(recentTransactions2) // recentTransactions data on component mount

// // Periodically rerecentTransactions data for updates
// setInterval(recentTransactions2, 30000) // recentTransactions every 30 seconds
