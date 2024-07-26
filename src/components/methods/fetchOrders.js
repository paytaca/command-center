import { ref, watch } from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'

const orders = ref([])
const count = ref([])
const latestOrder = ref(null)
const orderLast7Days = ref(null)
const totalOrders = ref(null)
const yesterdayOrders = ref(null)
const totalOrderCount = ref(null)
const revenueToday = ref(null)
const yesterdayRevenue = ref(null)
const totalRevenue = ref(null)
const sortedOrders = ref([])
const loading = ref(false)
const error = ref(null)
const orderLink = 'http://127.0.0.1:8000/api/marketplace/orders/?format=json'

async function fetchOrders () {
  loading.value = true
  try {
    const response = await axios.get(orderLink)
    orders.value = response.data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const computeTotalOrderCount = () => {
  totalOrderCount.value = count.value.reduce((sum, item) => sum + item.count, 0)
}

setInterval(fetchOrders, 3000)

watch(count, () => {
  computeTotalOrderCount()
}, { deep: true })

// sortedOrders.value = JSON.parse(JSON.stringify(orders.value))
// sortedOrders.value.sort((a, b) => new Date(b.date) - new Date(a.date))

// console.log('WATCH HERE: ' + sortedOrders.value)

watch(sortedOrders, (newOrders) => {
  if (newOrders.length > 0) {
    const newLatestOrder = newOrders[newOrders.length - 1]
    if (!latestOrder.value || newLatestOrder.order_id !== latestOrder.value.order_id) {
      latestOrder.value = newLatestOrder
    }
  } else {
    latestOrder.value = null
    error.value = 'No transactions found.'
  }
})

watch(orders, (newOrders) => {
  orderLast7Days.value = 0
  totalOrders.value = 0
  yesterdayOrders.value = 0
  totalOrderCount.value = 0
  revenueToday.value = 0
  yesterdayRevenue.value = 0
  totalRevenue.value = 0

  if (newOrders.length > 0) {
    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }
    const now = moment().tz('Asia/Manila').toDate()
    const formattedToday = formatDate(now) // Format 'now' for consistency
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
    const yesterday = new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000))
    const formattedSevenDaysAgo = formatDate(sevenDaysAgo) // Format 'sevenDaysAgo' for consistency
    const formattedYesterday = formatDate(yesterday) // Format 'yesterday' for consistency

    newOrders.forEach(order => {
      const orderDate = order.date
      if (orderDate === formattedToday) {
        totalOrders.value += 1
        revenueToday.value += parseFloat(order.revenue)
      }

      if (orderDate === formattedYesterday) {
        yesterdayOrders.value += 1
        yesterdayRevenue.value += parseFloat(order.revenue)
      }

      if (orderDate > formattedSevenDaysAgo) {
        orderLast7Days.value += 1
      }
      totalOrderCount.value += 1
      totalRevenue.value += parseFloat(order.revenue)
    })

    newOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
    latestOrder.value = newOrders[0]
    console.log('Latest Order:', latestOrder.value) // Log the latest order to inspect it
  } else {
    totalOrders.value = null
    yesterdayOrders.value = null
    error.value = 'No transactions found.'
  }
})

export {
  fetchOrders,
  computeTotalOrderCount,
  latestOrder,
  totalOrderCount,
  yesterdayOrders,
  totalOrders,
  orderLast7Days,
  totalRevenue,
  revenueToday,
  yesterdayRevenue
}
