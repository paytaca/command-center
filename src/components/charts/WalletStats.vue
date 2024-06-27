<template>
  <div>
    <q-card class="no-shadow bg-secondary text-white" bordered>
      <q-card-section class="row text-h6 q-px-md q-pb-none">
        <div>
          Transactions Statistics
        </div>
        <q-space />
        <div>
          <q-btn icon="download" @click="SaveImage" flat dense round>
            <q-tooltip>Download PNG</q-tooltip>
          </q-btn>
          <q-btn icon="cancel" flat dense round/>
        </div>
      </q-card-section>
      <q-card-section class="text-h6 q-px-md q-pt-none">
        <q-select
          filled
          v-model="selectedRange" dense
          input-debounce="0"
          dark
          label="Filter"
          :options="['days', 'months', 'years']"
          @change="updateChart"
          color="white"
          style="width: 120px;"
          behavior="menu"
        />
        <ECharts :option="options"
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

const generateRandomData = (length, max) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max))
}

// Define the data for different ranges
const data = ref({
  days: {
    dates: ['2024-06-01', '2024-06-02', '2024-06-03', '2024-06-04', '2024-06-05', '2024-06-06', '2024-06-07'],
    values: generateRandomData(7, 200)
  },
  months: {
    dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
    values: generateRandomData(6, 3000)
  },
  years: {
    dates: ['2020', '2021', '2022', '2023', '2024'],
    values: generateRandomData(5, 10000)
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
        backgroundColor: '#f05456'
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
      type: 'value'
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
      showSymbol: false,
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
const selectedRange = ref('days')

const updateChart = () => {
  options.value.xAxis[0].data = data.value[selectedRange.value].dates
  options.value.series[0].data = data.value[selectedRange.value].values
}

// Watch for changes in selectedRange and update the chart accordingly
watch(selectedRange, updateChart)

// Initial chart setup
updateChart()

// Function to simulate real-time data updates
const updateData = () => {
  const range = selectedRange.value
  const newData = data.value[range].values.map(value => {
    const newValue = value + Math.floor(Math.random() * 10 - 5)
    return newValue < 0 ? 0 : newValue // Ensure no negative values
  })
  data.value[range].values = newData
  updateChart()
}

let intervalId

onMounted(() => {
  intervalId = setInterval(updateData, 2000) // Update data every second
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

// const SaveImage = () => {
//   if (barchart.value) {
//     const linkSource = barchart.value.getDataURL()
//     const downloadLink = document.createElement('a')
//     document.body.appendChild(downloadLink)
//     downloadLink.href = linkSource
//     downloadLink.target = '_self'
//     downloadLink.download = 'BarChart.png'
//     downloadLink.click()
//     document.body.removeChild(downloadLink)
//   }
// }

</script>

<style scoped>

</style>
