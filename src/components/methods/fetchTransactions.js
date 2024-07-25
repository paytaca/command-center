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
setInterval(fetchTransactions, 3000)

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
  totalTransaction.value = 0
  yesterdayTransaction.value = 0
  totalLast7Days.value = 0
  totalCount.value = 0
  if (newTransactions.length > 0) {
    const formatDate = (input) => input.toISOString().split('T')[0]
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
    const yesterday = new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000))
    const formattedToday = formatDate(now) // Use 'now' to get the start of today formatted
    const formattedSevenDaysAgo = formatDate(sevenDaysAgo) // Format 'sevenDaysAgo' for consistency
    const formattedYesterday = formatDate(yesterday) // Format 'yesterday' for consistency

    newTransactions.forEach(transaction => {
      const receivedAt = transaction.date
      if (receivedAt === formattedToday) {
        totalTransaction.value += transaction.count
      }

      if (receivedAt === formattedYesterday) {
        yesterdayTransaction.value += transaction.count
      }

      if (receivedAt >= formattedSevenDaysAgo) {
        totalLast7Days.value += transaction.count
      }
      totalCount.value += transaction.count
    })
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
