import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const transactions = ref([])
const latestTransaction = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchTransactions () {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:8000/transactions/?format=json')
    transactions.value = response.data
    console.log('test: ' + transactions.value)
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

export { fetchTransactions, latestTransaction, transactions, error }

// Uncomment the following line to periodically refetch data
// setInterval(fetchTransactions, 30000); // Fetch every 30 seconds

// /* eslint-disable no-unused-vars */
// <script setup>
// import { ref, onMounted, watch } from 'vue'
// import axios from 'axios'

// // Fetch latest transaction data
// const transactions = ref([]) // Store all transactions
// const latestTransaction = ref(null)
// const loading = ref(true)
// const error = ref(null)

// const formatTimestamp = (timestamp) => {
//   const date = new Date(timestamp)
//   return date.toLocaleString() // Adjust format as needed
// }

// const fetchTransactions = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get('http://127.0.0.1:8000/transactions/?format=json')
//     transactions.value = response.data
//   } catch (err) {
//     error.value = err.message || 'Error fetching data'
//     console.error(err)
//   } finally {
//     loading.value = false
//   }
// }

// // Watch for changes in 'transactions' to update 'latestTransaction'
// watch(transactions, (newTransactions) => {
//   if (newTransactions.length > 0) {
//     latestTransaction.value = newTransactions[newTransactions.length - 1] // Get the latest
//   } else {
//     latestTransaction.value = null
//     error.value = 'No transactions found.'
//   }
// })

// onMounted(fetchTransactions) // Fetch data on component mount
// </script>
// // Periodically refetch data for updates
// // setInterval(fetchTransactions, 30000) // Fetch every 60 seconds
