<template>
  <q-scroll-area class="fit text-white">
    <q-list padding>
        <q-item v-for="link in links1" :key="link.text" :to="{ name: link.link }" v-ripple clickable class="text-white">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="unselectable">{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>

      <q-separator class="q-my-md" />

      <q-item v-for="link in links2" :key="link.text" :to="{ name: link.link }" v-ripple clickable class="text-white">
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="unselectable">{{ link.text }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md" />

      <q-item v-for="link in links3" :key="link.text" :to="{ name: link.link }" v-ripple clickable class="text-white">
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="unselectable">{{ link.text }}</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref } from 'vue'

const links1 = ref([
  { icon: 'home', text: 'Home', link: 'Home' },
  { icon: 'info', text: 'About', link: 'Home' }
])

const links2 = ref([
  { icon: 'bar_chart', text: 'Analytics', link: 'Analytics' },
  { icon: 'storefront', text: 'Merchants', link: 'Merchants' },
  { icon: 'coffee_maker', text: 'Vending Machines', link: 'Home' }
])

const links3 = ref([
  { icon: 'admin_panel_settings', text: 'Admin mode' }
])

defineOptions({
  name: 'EssentialLink'
})
</script>

<style scoped>
.unselectable {
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
