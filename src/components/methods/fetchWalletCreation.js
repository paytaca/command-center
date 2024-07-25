import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const wallets = ref([])
const count = ref([])
const latestWallet = ref(null)
const last7Days = ref(null)
const totalWallets = ref(null)
const yesterdayWallets = ref(null)
const totalWalletCount = ref(null)
const loading = ref(false)
const error = ref(null)
const createWalletLink = 'http://127.0.0.1:8000/api/wallets/?format=json'

async function fetchWallets () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get(createWalletLink)
    wallets.value = response.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const computeTotalWalletCount = () => {
  totalWalletCount.value = count.value.reduce((sum, item) => sum + item.count, 0)
}

onMounted(fetchWallets, computeTotalWalletCount)
setInterval(fetchWallets, 3000)

watch(count, () => {
  computeTotalWalletCount()
}, { deep: true })

watch(wallets, (newWallets) => {
  if (newWallets.length > 0) {
    const newLatestWallet = newWallets[newWallets.length - 1]
    if (!latestWallet.value || newLatestWallet.id !== latestWallet.value.id) {
      latestWallet.value = newLatestWallet
    }
  } else {
    latestWallet.value = null
    error.value = 'No transactions found.'
  }
})

watch(wallets, (newWallets) => {
  last7Days.value = 0
  totalWallets.value = 0
  yesterdayWallets.value = 0
  totalWalletCount.value = 0

  if (newWallets.length > 0) {
    const formatDate = (input) => input.toISOString().split('T')[0]
    const now = new Date('2024-07-25')
    console.log('DATE NOW: ' + now)
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
    const yesterday = new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000))
    const formattedToday = formatDate(now) // Use 'now' to get the start of today formatted
    const formattedSevenDaysAgo = formatDate(sevenDaysAgo) // Format 'sevenDaysAgo' for consistency
    const formattedYesterday = formatDate(yesterday) // Format 'yesterday' for consistency

    newWallets.forEach(wallet => {
      const createdAt = wallet.created_at
      if (createdAt === formattedToday) {
        totalWallets.value += 1
      }

      if (createdAt === formattedYesterday) {
        yesterdayWallets.value += 1
      }

      if (createdAt > formattedSevenDaysAgo) {
        last7Days.value += 1
      }
      totalWalletCount.value += 1
    })
  } else {
    totalWallets.value = null
    yesterdayWallets.value = null
    error.value = 'No transactions found.'
  }
})

export {
  fetchWallets,
  computeTotalWalletCount,
  latestWallet,
  totalWalletCount,
  yesterdayWallets,
  totalWallets,
  last7Days
}
