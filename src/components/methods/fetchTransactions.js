import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const transactions = ref([])
const count = ref([])
const totalLast7Days = ref(null)
const latestTransaction = ref(null)
const totalTransaction = ref(null)
const yesterdayTransaction = ref(null)
const totalCount = ref(0)
const loading = ref(false)
const error = ref(null)
const transactionsLink = 'http://127.0.0.1:8000/api/transactions/?format=json'
const txCountersLink = 'http://127.0.0.1:8000/api/tx_counters/?format=json'

async function fetchTransactions () {
  loading.value = true
  // console.log('Fetching data...')
  try {
    const response = await axios.get(transactionsLink)
    const response2 = await axios.get(txCountersLink)
    transactions.value = response.data
    count.value = response2.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const computeTotalCount = () => {
  totalCount.value = count.value.reduce((sum, item) => sum + item.count, 0)
}

onMounted(fetchTransactions, computeTotalCount)
setInterval(fetchTransactions, 5000)

watch(count, () => {
  computeTotalCount()
}, { deep: true })

watch(transactions, (newTransactions) => {
  if (newTransactions.length > 0) {
    const newLatestTransaction = newTransactions[newTransactions.length - 1]
    if (!latestTransaction.value || newLatestTransaction.id !== latestTransaction.value.id) {
      latestTransaction.value = newLatestTransaction
    }
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

    // Filter transactions from the last 7 days
    const transactionsLast7Days = newTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      transactionDate.setHours(0, 0, 0, 0)
      const diffTime = Math.abs(currentDate - transactionDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })

    // Compute the total transactions for the last 7 days
    let totalTransactionsLast7Days = 0
    transactionsLast7Days.forEach(transaction => {
      totalTransactionsLast7Days += transaction.count
    })

    totalLast7Days.value = totalTransactionsLast7Days

    if (lastTransactionDate.setHours(0, 0, 0, 0) === currentDate.getTime()) {
      totalTransaction.value = newTransactions[newTransactions.length - 1] // Today's transaction
      yesterdayTransaction.value = newTransactions[newTransactions.length - 2] // Yesterday's transaction
    } else {
      totalTransaction.value = { date: new Date().toISOString().split('T')[0], count: 0 }
      yesterdayTransaction.value = newTransactions[newTransactions.length - 1]
    }
  } else {
    totalTransaction.value = null
    yesterdayTransaction.value = null
    error.value = 'No transactions found.'
  }
})

export {
  fetchTransactions,
  computeTotalCount,
  totalCount,
  latestTransaction,
  yesterdayTransaction,
  totalTransaction,
  totalLast7Days
}
