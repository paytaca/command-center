import { ref, onMounted } from 'vue'
import axios from 'axios'

const days = ref({ dates: [], values: [] })
const months = ref({ dates: [], values: [] })
const years = ref({ dates: [], values: [] })
const loading = ref(false)
const error = ref(null)

async function fetchTransactionsStats () {
  loading.value = true
  console.log('Fetching data...')
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tx_counters/?format=json')
    processTransactionsData(response.data) // Process the data
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
    const date = new Date(item.date)
    const dayKey = date.toISOString().split('T')[0] // 'YYYY-MM-DD'
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // 'YYYY-MM'
    const yearKey = date.getFullYear().toString() // 'YYYY'

    // Aggregate days
    const dayIndex = days.value.dates.indexOf(dayKey)
    if (dayIndex === -1) {
      days.value.dates.push(dayKey)
      days.value.values.push(item.count)
    } else {
      days.value.values[dayIndex] += item.count
    }

    // Aggregate months
    const monthIndex = months.value.dates.indexOf(monthKey)
    if (monthIndex === -1) {
      months.value.dates.push(monthKey)
      months.value.values.push(item.count)
    } else {
      months.value.values[monthIndex] += item.count
    }

    // Aggregate years
    const yearIndex = years.value.dates.indexOf(yearKey)
    if (yearIndex === -1) {
      years.value.dates.push(yearKey)
      years.value.values.push(item.count)
    } else {
      years.value.values[yearIndex] += item.count
    }
  })
}

export { fetchTransactionsStats, days, months, years }

onMounted(fetchTransactionsStats)
setInterval(fetchTransactionsStats, 2000)
