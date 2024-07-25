<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round icon="menu" @click="toggleLeftDrawer"/>

        <!-- Logo to Home Button -->
        <q-btn flat :to="{ name: 'Home' }">
          <q-img key='scale-down' src="../assets/logo_white.png"
                 fit='scale-down' class="row cursor-pointer logo_header"
          />
        </q-btn>

        <q-space />

        <!-- Volume Control Button -->
        <div class="row items-center no-wrap">
          <q-toggle v-model="volume" color="white"
                    checked-icon="volume_up" unchecked-icon="volume_off"
                    size="lg" dense keep-color
                    class="q-mr-sm" icon-color="primary"
          />
        </div>

        <!-- Fullscreen Control Button -->
        <div class="row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="toggleFullscreen"
            v-if="$q.screen.gt.sm">
          </q-btn>
        </div>

        <!-- Logout Button -->
        <div class="row items-center no-wrap">
          <q-btn round flat icon="logout" @click="logout">
            <q-tooltip>Log out</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer for navigation -->
    <q-drawer overlay v-model="leftDrawerOpen" side="left" class="bg-secondary drawer-content">
      <Menu />
    </q-drawer>

    <!-- Main content area -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import Menu from 'src/components/Menu.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { latestTransaction } from 'src/components/methods/fetchTransactions'

// Left drawer variable and function
const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Logout function
const store = useStore()
const router = useRouter()
const logout = async () => {
  await store.dispatch('auth/signOut')
  router.push('/login')
}

// Fullscreen variable and function
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

// Volume variable and function
const volume = ref(false)
const playSound = () => {
  if (volume.value === true) { // Check if volume is enabled
    const audio = new Audio('src/assets/videoplayback.wav') // Ensure this path is correct
    audio.play().catch(error => console.error('Error playing sound:', error))
  }
}

// Watch for changes in the latestTransaction ref
watch(latestTransaction, (newVal, oldVal) => {
  if (newVal && (!oldVal || newVal.id !== oldVal.id)) {
    playSound()
  }
})

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
