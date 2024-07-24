import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const wallets = ref([])
const count = ref([])
const last7Days = ref(null)
const totalWallets = ref(null)
const yesterdayWallets = ref(null)
const totalWalletCount = ref(0)
const loading = ref(false)
const error = ref(null)
const createUserLink = 'http://127.0.0.1:8000/api/user-creation/?format=json'
const createUserCounterLink = 'http://127.0.0.1:8000/api/user-creation-counter/?format=json'

async function fetchWallets () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get(createUserLink)
    const response2 = await axios.get(createUserCounterLink)
    wallets.value = response.data
    count.value = response2.data
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
setInterval(fetchWallets, 5000)

watch(count, () => {
  computeTotalWalletCount()
}, { deep: true })

watch(count, (newWallets) => {
  if (newWallets.length > 0) {
    const lastWalletCreatedDate = new Date(newWallets[newWallets.length - 1].date)
    const currentDate = new Date('2023-07-18')
    currentDate.setHours(0, 0, 0, 0)

    // Filter wallets from the last 7 days
    const walletsLast7Days = newWallets.filter(wallet => {
      const walletDate = new Date(wallet.date)
      walletDate.setHours(0, 0, 0, 0)
      const diffTime = Math.abs(currentDate - walletDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })

    // Compute the total wallets for the last 7 days
    let totalWalletsLast7Days = 0
    walletsLast7Days.forEach(wallet => {
      totalWalletsLast7Days += wallet.count
    })

    last7Days.value = totalWalletsLast7Days

    if (lastWalletCreatedDate.setHours(0, 0, 0, 0) === currentDate.getTime()) {
      totalWallets.value = newWallets[newWallets.length - 1]
      yesterdayWallets.value = newWallets[newWallets.length - 2]
    } else {
      totalWallets.value = { date: new Date().toISOString().split('T')[0], count: 0 }
      yesterdayWallets.value = newWallets[newWallets.length - 1]
    }
  } else {
    totalWallets.value = null
    yesterdayWallets.value = null
    error.value = 'No transactions found.'
  }
})

export {
  fetchWallets,
  computeTotalWalletCount,
  totalWalletCount,
  yesterdayWallets,
  totalWallets,
  last7Days
}
