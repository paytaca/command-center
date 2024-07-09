<template>
  <router-view/>
</template>

<script setup>
import { axiosInstance } from 'boot/axios'

defineOptions({
  name: 'App',
  beforeCreate () {
    this.$store.dispatch('auth/init')
    const token = this.$store.getters.getToken
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = 'JWT ' + token.access
    } else {
      axiosInstance.defaults.headers.common.Authorization = ''
    }
  }
})
</script>
