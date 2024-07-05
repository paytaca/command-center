<template>
  <q-page style="background: linear-gradient(#1e293b,#44566e);">
    <div class="waves">
      <svg class="waves__svg" preserveAspectRatio="none" shape-rendering="auto" viewBox="0 24 150 28"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
        </defs>
        <g class="parallax">
          <use :style="{ animationDuration: waveSpeed + 's' }" fill="rgba(72, 114, 184,0.75)" x="48" xlink:href="#gentle-wave" y="0"></use>
          <use :style="{ animationDuration: waveSpeed + 's' }" fill="rgba(72, 114, 184,0.5)" x="48" xlink:href="#gentle-wave" y="3"></use>
          <use :style="{ animationDuration: waveSpeed + 's' }" fill="rgba(72, 114, 184,0.25)" x="48" xlink:href="#gentle-wave" y="5"></use>
          <use :style="{ animationDuration: waveSpeed + 's' }" fill="rgba(72, 114, 184,1)" x="48" xlink:href="#gentle-wave" y="7"></use>
        </g>
      </svg>
    </div>

    <div class="column justify-center items-center content-center">
      <q-img src="../assets/title.png" style="max-height: 40vh; max-width: 50%;" class="row q-mt-xl"/>
      <p style="font-size: 3vw;" class="text-white q-ma-none self-end">Company Dashboard</p>
    </div>

    <q-separator class="q-ma-lg bg-white"/>

    <p style="font-size: 15px; opacity: 50%;" class="row justify-start content-start q-ma-none text-white q-ml-xl">Navigation</p>
    <div class="q-ma-lg">
      <div class="row q-col-gutter-x-xl q-col-gutter-y-lg justify-center">
        <div class="col-lg-2 col-md-3 col-sm-5 col-xs-10">
          <q-btn label="Analytics" icon="bar_chart" no-wrap stack dense class="fit text-white bg-secondary" @click="$router.push({ name: 'Analytics' })"/>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-5 col-xs-10">
          <q-btn label="Merchants" icon="bar_chart" no-wrap stack dense class="fit text-white bg-secondary" @click="$router.push({ name: 'Merchants' })"/>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-5 col-xs-10">
          <q-btn label="Vending Machines" icon="bar_chart" no-wrap stack dense class="fit text-white bg-secondary" @click="$router.push({ name: 'Vending Machines' })"/>
        </div>
      </div>
    </div>

      <!-- <div dense class="row justify-center items-center text-center text-bold q-mx-md">
        <div class="col">
          <q-btn label="Analytics" icon="bar_chart" no-wrap stack dense class="text-white bg-secondary q-mt-none q-ma-sm" padding="1vh 3vh" @click="$router.push({ name: 'Analytics' })"/>
          <q-btn label="Merchants" icon="storefront" no-wrap stack dense class="text-white bg-secondary q-mt-none q-ma-sm" padding="1vh 3vh" @click="$router.push({ name: 'Home' })"/>
          <q-btn label="Vending Machines" icon="coffee_maker" no-wrap stack dense class="text-white bg-secondary q-mt-none q-ma-sm" padding="1vh 3vh" @click="$router.push({ name: 'Home' })"/>
        </div>
      </div> -->

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const waveSpeed = ref(10)

defineOptions({
  name: 'IndexPage'
})
</script>

<style scoped>
.waves {
  position: absolute;
  width: 100%;
  height: 20%;
  overflow: hidden;
  bottom: 0;
}

.waves__svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.parallax > use {
  animation: moveWave 10s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

@keyframes moveWave {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

</style>
