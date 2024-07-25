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
        <q-select v-if="transactionType == 'transaction'"
          filled
          v-model="selectedTransaction" dense
          input-debounce="0"
          dark
          label="Filter"
          :options="['1D','5D','1M', '6M', 'Months', 'Years']"
          @change="updateChart"
          color="white"
          style="width: 120px;"
          behavior="menu"
        />
        <q-select v-if="transactionType == 'walletCreation'"
          filled
          v-model="selectedWallet" dense
          input-debounce="0"
          dark
          label="Filter"
          :options="['Days', 'Months', 'Years']"
          @change="updateChart"
          color="white"
          style="width: 120px;"
          behavior="menu"
        />

        <q-select v-if="transactionType == 'marketplaceTransaction'"
          filled
          v-model="selectedWallet" dense
          input-debounce="0"
          dark
          label="Filter"
          :options="['Days', 'Months', 'Years']"
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
import { fetchTransactionsStats, today, last5Days, last30Days, last6Months, transMonths, transYears } from 'src/components/methods/fetchTransactionsStats'
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
    bottom: '15%',
    top: '4%',
    containLabel: false
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
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
      type: 'bar',
      stack: 'Total',
      barWidth: '80%',
      smooth: false,
      showSymbol: true,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#f05456'
          }, {
            offset: 1,
            color: '#4871b8'
          }])
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
})

// Define the selected range and update function
const selectedTransaction = ref('1D')
const selectedWallet = ref('Days')

const setChartData = (xData, seriesData) => {
  options.value.xAxis[0].data = xData
  options.value.series[0].data = seriesData
}

const updateChart = () => {
  if (props.transactionType === 'transaction') {
    fetchTransactionsStats()
    const transactionMapping = {
      '1D': { data: 'times', count: 'count', source: today.value },
      '5D': { data: 'desc', count: 'count', source: last5Days.value },
      '1M': { data: 'dates', count: 'count', source: last30Days.value },
      '6M': { data: 'dates', count: 'count', source: last6Months.value },
      Months: { data: 'months', count: 'count', source: transMonths.value },
      Years: { data: 'years', count: 'count', source: transYears.value }
    }

    const selected = transactionMapping[selectedTransaction.value]
    if (selected) {
      setChartData(selected.source[selected.data], selected.source[selected.count])
    }
  } else if (props.transactionType === 'walletCreation') {
    fetchUserCreationsStats()
    const walletCreationMapping = {
      Days: () => {
        const sliceIndex = Math.max(days.value.dates.length - 7, 0)
        setChartData(days.value.dates.slice(sliceIndex), days.value.values.slice(sliceIndex))
      },
      Months: () => setChartData(months.value.dates, months.value.values),
      Years: () => setChartData(years.value.dates, years.value.values)
    }

    const updateFunction = walletCreationMapping[selectedWallet.value]
    if (updateFunction) {
      updateFunction()
    }
  }
}

// Watch for changes in selectedTransaction and update the chart accordingly
watch(selectedTransaction, updateChart)

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
