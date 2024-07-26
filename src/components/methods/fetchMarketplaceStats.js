import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'

// Stats for orders
const ordersDays = ref({ dates: [], count: [] })
const ordersMonths = ref({ months: [], count: [] })
const ordersYears = ref({ years: [], count: [] })

// Stats for revenue
const revenueDays = ref({ dates: [], count: [] })
const revenueMonths = ref({ months: [], count: [] })
const revenueYears = ref({ years: [], count: [] })

// const sinceBeginningOfYear = ref({ dates: [], values: [] })
const loading = ref(false)
const error = ref(null)

async function fetchMarketplaceStats () {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/marketplace/orders?format=json')
    processMarketplaceData(response.data) // Process the data
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function processMarketplaceData (data) {
  // Reset stats for orders
  ordersDays.value = { dates: [], count: [] }
  ordersMonths.value = { dates: [], count: [] }
  ordersYears.value = { dates: [], count: [] }

  // Reset stats for revenue
  revenueDays.value = { dates: [], values: [] }
  revenueMonths.value = { dates: [], values: [] }
  revenueYears.value = { dates: [], values: [] }

  // Function to format date into a string
  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  // Define an array of month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // Process the data statistics
  data.forEach((item) => {
    const date = new Date(item.created_at)
    const dayKey = date.toISOString().split('T')[0] // 'YYYY-MM-DD'
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // 'YYYY-MM'
    const yearKey = date.getFullYear().toString() // 'YYYY'
    const monthName = monthNames[parseInt(monthKey, 10)]

    // Aggregate days
    const dayIndex = ordersDays.value.dates.indexOf(dayKey)
    if (dayIndex === -1) {
      ordersDays.value.dates.push(dayKey)
      ordersDays.value.count.push(1)
      revenueDays.value.dates.push(dayKey)
      revenueDays.value.values.push(item.revenue)
    } else {
      ordersDays.value.count[dayIndex] += 1
      revenueDays.value.valyes[dayIndex] += item.revenue
    }

    // Aggregate months
    const monthIndex = ordersMonths.value.dates.indexOf(monthName + ' ' + yearKey)
    if (monthIndex === -1) {
      ordersMonths.value.months.push(monthName + ' ' + yearKey)
      ordersMonths.value.count.push(1)
      revenueMonths.value.months.push(monthName + ' ' + yearKey)
      revenueMonths.value.values.push(item.revenue)
    } else {
      ordersMonths.value.count[monthIndex] += 1
      revenueMonths.value.values[monthIndex] += item.revenue
    }

    // Aggregate years
    const yearIndex = ordersYears.value.dates.indexOf(yearKey)
    if (yearIndex === -1) {
      ordersYears.value.years.push(yearKey)
      ordersYears.value.count.push(1)
      revenueYears.value.years.push(yearKey)
      revenueYears.value.values.push(item.revenue)
    } else {
      ordersYears.value.count[yearIndex] += 1
      revenueYears.value.values[yearIndex] += item.revenue
    }
  })
  const now = moment().tz('Asia/Manila').toDate()
  const formattedToday = formatDate(now)
  const todayIndex = ordersDays.value.dates.indexOf(formattedToday)
  if (todayIndex === -1) {
    ordersDays.value.dates.push(formattedToday)
    ordersDays.value.values.push(0)
  }
}

export { ordersDays, ordersMonths, ordersYears, revenueDays, revenueMonths, revenueYears, fetchMarketplaceStats }

setInterval(fetchMarketplaceStats, 3000)
