<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-btn flat :to="{ name: 'Home' }">
          <q-img
            key='scale-down'
            src="../assets/logo_white.png"
            fit='scale-down'
            class="row cursor-pointer logo_header"
          />
        </q-btn>

        <q-space />

        <div class=" row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="toggleFullscreen"
            v-if="$q.screen.gt.sm">
          </q-btn>
        </div>

        <div class=" row items-center no-wrap">
          <q-btn round flat icon="logout" :to="{ name: 'Login' }">
            <q-tooltip>Log out</q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer overlay v-model="leftDrawerOpen" side="left" class="bg-secondary drawer-content">
      <Menu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-page-sticky position="bottom-left" :offset="[0,0]" class="q-pa-xs bg-primary text-white text-caption">
      <q-item-label>© Paytaca Inc. 2024</q-item-label>
    </q-page-sticky>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import Menu from 'src/components/Menu.vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch((err) => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`)
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch((err) => {
      console.error(`Error attempting to disable fullscreen mode: ${err.message} (${err.name})`)
    })
  }
}

defineOptions({
  name: 'MainLayout'
})
</script>

<style scoped>
.logo_header {
  min-height: 30px;
  max-height: 30px;
  min-width: 130px;
  max-width: 130px;
}
.drawer-content {
  height: 100%;
  overflow-y: auto;
}
.drawer-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
</style>

<!-- <style>
/* Hide scrollbar for all major browsers */
html, body {
  overflow: hidden;
}
html, body {
  scrollbar-width: none; /* Firefox */
}
html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style> -->
