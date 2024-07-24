<template>
  <div>
    <q-card class="no-shadow bg-secondary text-white" bordered>
      <q-card-section class="row text-h6 q-px-md q-pb-none">
        <div v-if="transactionType == 'transaction'">
          Transactions Statistics
        </div>
        <div v-else-if="transactionType == 'walletCreation'">
          Wallet Creation Statistics
        </div>
        <div v-else-if="transactionType == 'marketplaceTransaction'">
          Marketplace Statistics
        </div>
        <q-space />
        <div>
          <q-btn icon="download" @click="SaveImage" flat dense round>
            <q-tooltip>Download PNG</q-tooltip>
          </q-btn>
          <q-btn icon="article" flat dense round>
            <q-tooltip>View details</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="text-h6 q-px-md q-pt-none">
        <q-select
          filled
          v-model="selectedRange" dense
          input-debounce="0"
          dark
          label="Filter"
          :options="['1D','5D','1M', '6M', 'Months', 'Years']"
          @change="updateChart"
          color="white"
          style="width: 120px;"
          behavior="menu"
        />
        <ECharts :option="options" ref="barchart"
                  class="q-mt-md" :resizable="true"
                  autoresize style="height: 400px;" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { fetchTransactionsStats, today, last5Days, last30Days, last6Months, months, years } from 'src/components/methods/fetchTransactionsStats'
import { fetchUserCreationsStats, days, months, years } from 'src/components/methods/fetchWalletCreationStats'
const props = defineProps({
  transactionType: {
    type: String,
    required: true
  }
})

// Define the options object
const options = ref({
  color: ['#f05456', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#f05456',
        precision: 0
      }
    }
  },
  textStyle: {
    color: '#fff'
  },
  legend: {
    data: ['Transactions Completed'],
    bottom: 2,
    textStyle: {
      color: '#fff', // Change legend text color here
      FontFace: 'Roboto'
    }
  },
  grid: {
    left: '7%',
    right: '7%',
    bottom: '10%',
    top: '4%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: 'Transactions Completed',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 2
      },
      showSymbol: true,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#f05456'
        }, {
          offset: 1,
          color: '#4871b8'
        }])
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
})

// Define the selected range and update function
const selectedRange = ref('1D')

const updateChart = () => {
  if (props.transactionType === 'transaction') {
    fetchTransactionsStats()
    if (selectedRange.value === '1D') {
      options.value.xAxis[0].data = today.value.times
      options.value.series[0].data = today.value.count
    } else if (selectedRange.value === '5D') {
      options.value.xAxis[0].data = last5Days.value.dates
      options.value.series[0].data = last5Days.value.count
    } else if (selectedRange.value === '1M') {
      options.value.xAxis[0].data = last30Days.value.dates
      options.value.series[0].data = last30Days.value.count
    } else if (selectedRange.value === '6M') {
      options.value.xAxis[0].data = last6Months.value.dates
      options.value.series[0].data = last6Months.value.count
    } else if (selectedRange.value === 'Months') {
      options.value.xAxis[0].data = months.value.months
      options.value.series[0].data = months.value.count
    } else if (selectedRange.value === 'Years') {
      options.value.xAxis[0].data = years.value.years
      options.value.series[0].data = years.value.count
    }
  } else if (props.transactionType === 'walletCreation') {
    fetchUserCreationsStats()
    if (selectedRange.value === 'days') {
      // Assuming days.value.dates and days.value.values are arrays with equal lengths
      if (days.value.dates.length < 7) {
        options.value.xAxis[0].data = days.value.dates
        options.value.series[0].data = days.value.values
      } else {
        const last7DaysIndexes = days.value.dates.length - 7
        // Get only the last 7 days' dates and value
        options.value.xAxis[0].data = days.value.dates.slice(last7DaysIndexes)
        options.value.series[0].data = days.value.values.slice(last7DaysIndexes)
      }
    } else if (selectedRange.value === 'months') {
      options.value.xAxis[0].data = months.value.dates
      options.value.series[0].data = months.value.values
    } else if (selectedRange.value === 'years') {
      options.value.xAxis[0].data = years.value.dates
      options.value.series[0].data = years.value.values
    }
  }
}

// Watch for changes in selectedRange and update the chart accordingly
watch(selectedRange, updateChart)

// Initial chart setup
updateChart()

let intervalId
onMounted(() => {
  intervalId = setInterval(updateChart, 5000) // Update data every 5 seconds
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

const barchart = ref(null)
const SaveImage = () => {
  if (barchart.value) {
    const linkSource = barchart.value.getDataURL()
    const downloadLink = document.createElement('a')
    document.body.appendChild(downloadLink)
    downloadLink.href = linkSource
    downloadLink.target = '_self'
    downloadLink.download = 'line_graph.png'
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
}

</script>
