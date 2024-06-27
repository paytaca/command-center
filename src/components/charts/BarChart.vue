<template>
  <div class="text-primary">
    <q-card class="no-shadow" bordered>
      <q-card-section class="text-h6">
        Bar Chart
        <div class="float-right">
          <q-btn icon="download" @click="SaveImage" flat dense>
            <q-tooltip>Download PNG</q-tooltip>
          </q-btn>
          <q-btn icon="cancel" flat dense/>
        </div>
      </q-card-section>
      <q-card-section>
        <ECharts ref="barchart"  :option="options"
                 class="q-mt-md"
                 :resizable="true"
                 autoresize style="height: 300px;"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ECharts from 'vue-echarts'
import 'echarts'

const options = {
  legend: {
    bottom: 10
  },
  tooltip: {},
  dataset: {
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '20%',
    top: '5%',
    containLabel: true
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [
    { type: 'bar' },
    { type: 'bar' },
    { type: 'bar' }
  ]
}

const barchart = ref(null)

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
/* Add your styles here */
</style>
