import { ref, onMounted } from 'vue'
import axios from 'axios'

const transDays = ref({ dates: [], values: [] })
const transMonths = ref({ dates: [], values: [] })
const transYears = ref({ dates: [], values: [] })
const loading = ref(false)
const error = ref(null)

async function fetchTransactionsStats () {
  loading.value = true
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
  transDays.value = { dates: [], values: [] }
  transMonths.value = { dates: [], values: [] }
  transYears.value = { dates: [], values: [] }

  data.forEach((item) => {
    const date = new Date(item.date)
    const dayKey = date.toISOString().split('T')[0] // 'YYYY-MM-DD'
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // 'YYYY-MM'
    const yearKey = date.getFullYear().toString() // 'YYYY'

    // Aggregate days
    const transDayIndex = transDays.value.dates.indexOf(dayKey)
    if (transDayIndex === -1) {
      transDays.value.dates.push(dayKey)
      transDays.value.values.push(item.count)
    } else {
      transDays.value.values[transDayIndex] += item.count
    }

    // Aggregate months
    const transMonthIndex = transMonths.value.dates.indexOf(monthKey)
    if (transMonthIndex === -1) {
      transMonths.value.dates.push(monthKey)
      transMonths.value.values.push(item.count)
    } else {
      transMonths.value.values[transMonthIndex] += item.count
    }

    // Aggregate years
    const transYearIndex = transYears.value.dates.indexOf(yearKey)
    if (transYearIndex === -1) {
      transYears.value.dates.push(yearKey)
      transYears.value.values.push(item.count)
    } else {
      transYears.value.values[transYearIndex] += item.count
    }
  })
}

export { fetchTransactionsStats, transDays, transMonths, transYears }

onMounted(fetchTransactionsStats)
setInterval(fetchTransactionsStats, 5000)
