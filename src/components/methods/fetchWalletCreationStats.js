import { ref, onMounted } from 'vue'
import axios from 'axios'

const days = ref({ dates: [], values: [] })
const months = ref({ dates: [], values: [] })
const years = ref({ dates: [], values: [] })
const loading = ref(false)
const error = ref(null)
const createUserCounterLink = 'http://127.0.0.1:8000/api/wallets/?format=json'

async function fetchUserCreationsStats () {
  loading.value = true
  try {
    const response = await axios.get(createUserCounterLink)
    processTransactionsData(response.data)
  } catch (err) {
    error.value = err.message || 'Error fetching data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function processTransactionsData (data) {
  // Reset current data
  days.value = { dates: [], values: [] }
  months.value = { dates: [], values: [] }
  years.value = { dates: [], values: [] }

  data.forEach((item) => {
    const date = new Date(item.created_at)
    const dayKey = date.toISOString().split('T')[0] // 'YYYY-MM-DD'
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // 'YYYY-MM'
    const yearKey = date.getFullYear().toString() // 'YYYY'

    // Aggregate days
    const dayIndex = days.value.dates.indexOf(dayKey)
    if (dayIndex === -1) {
      days.value.dates.push(dayKey)
      days.value.values.push(1)
    } else {
      days.value.values[dayIndex] += 1
    }

    // Aggregate months
    const monthIndex = months.value.dates.indexOf(monthKey)
    if (monthIndex === -1) {
      months.value.dates.push(monthKey)
      months.value.values.push(1)
    } else {
      months.value.values[monthIndex] += 1
    }

    // Aggregate years
    const yearIndex = years.value.dates.indexOf(yearKey)
    if (yearIndex === -1) {
      years.value.dates.push(yearKey)
      years.value.values.push(1)
    } else {
      years.value.values[yearIndex] += 1
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = today.toISOString().split('T')[0]
  const todayIndex = days.value.dates.indexOf(todayKey)
  if (todayIndex === -1) {
    days.value.dates.push(todayKey)
    days.value.values.push(0)
  }
}

console.log('Days: ' + days.value.dates)

onMounted(fetchUserCreationsStats)
setInterval(fetchUserCreationsStats, 3000)

export {
  fetchUserCreationsStats,
  days,
  months,
  years
}
