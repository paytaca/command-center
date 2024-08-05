<template>
  <q-layout view="lHh Lpr fff">
    <q-page-container
      class="window-height window-width row justify-center items-center"
      style="background: linear-gradient(#4871b8, #1e293b);"
    >
      <q-card square class="shadow-24" style="width: 350px; height: 540px;">

        <!-- Card Header -->
        <q-card-section class="bg-primary">
          <div class="row items-center">
            <q-img
              key='scale-down'
              src="../assets/logo.png"
              fit='scale-down'
              class="col logo_header"
            />
            <h4 class="col text-h5 text-white q-my-md">{{ title}}</h4>
          </div>
        </q-card-section>

        <q-card-section>

          <!-- Switch Type (Login/Reg) Button -->
          <q-fab
            color="secondary" @click="switchTypeForm"
            icon="add"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <q-form class="q-px-sm" @submit.prevent = "submitForm">

            <!-- Email Input -->
            <q-input
              v-if="register"
              square
              clearable
              v-model='email'
              type="email"
              lazy-rules
              :rules="[required,isEmail]"
              label="Email">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <!-- Username Input -->
            <q-input
              square
              clearable
              v-model="username"
              lazy-rules
              :rules="[required]"
              type="username" label="Username">
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Password Input -->
            <q-input
              square
              clearable
              v-model="password" :type="passwordFieldType"
              lazy-rules
              :rules="[required,short]"
              label="Password">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
              </template>
            </q-input>

            <!-- Re-enter Password Input -->
            <q-input
              v-if="register"
              square
              clearable
              v-model="repassword" :type="passwordFieldType"
              lazy-rules
              :rules="[required,short,diffPassword]"
              label="Re-enter Password">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
              <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
              </template>
            </q-input>

            <!-- Submit Button -->
            <q-card-actions class="q-px-lg">
              <q-btn
                unelevated
                size="lg"
                color="primary"
                type="submit"
                class="full-width text-white" :label="btnLabel"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>

        <!-- Forgot Password Button -->
        <q-card-section
            v-if="!register"
            class="text-center q-pa-sm">
          <p class="text-grey-6">Forgot password?</p>
        </q-card-section>
      </q-card>

      <!-- Sticky Copyright -->
      <q-page-sticky position="bottom-left" :offset="[0,0]" class="q-pa-xs bg-primary text-white text-caption">
        <q-item-label>© Paytaca Inc. 2024</q-item-label>
      </q-page-sticky>

    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { axiosInstance } from 'boot/axios'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// Variables
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const store = useStore()
const title = ref('Log in')
const email = ref('')
const username = ref('')
const password = ref('')
const repassword = ref('')
const register = ref(false)
const passwordFieldType = ref('password')
const btnLabel = ref('Log in')
const visibility = ref(false)
const visibilityIcon = ref('visibility')

// Validation for Login and Registration
const required = (val) => {
  return (val && val.length > 0) ? true : 'Required'
}
const diffPassword = (val) => {
  const val2 = password.value
  return (val && (val === val2)) ? true : 'Password does not match'
}
const short = (val) => {
  return (val && val.length > 8) ? true : 'Password is too short'
}
const isEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return (emailPattern.test(val)) ? true : 'Invalid email'
}

// Switch Login/Register Form
const switchTypeForm = () => {
  register.value = !register.value
  title.value = register.value ? 'Register' : 'Log in'
  btnLabel.value = register.value ? 'Register' : 'Log in'
}

// Switch password visibility
const switchVisibility = () => {
  visibility.value = !visibility.value
  passwordFieldType.value = visibility.value ? 'text' : 'password'
  visibilityIcon.value = visibility.value ? 'visibility_off' : 'visibility'
}

// Submit Form to database
const submitForm = async () => {
  // Register
  if (register.value) {
    const formData = {
      email: email.value,
      username: username.value,
      password: password.value
    }
    try {
      await axiosInstance.post('/api/v1/users/', formData)
      $q.notify({
        message: 'Account was created, please log in',
        color: 'positive',
        icon: 'info',
        position: 'bottom-right',
        timeout: 2000
      })
      switchTypeForm() // Switch to login after successful registration
    } catch (error) {
      console.error('Registration error:', error)
      $q.notify({
        message: 'There was a problem with your submission. Please check your data and try again.',
        color: 'negative',
        icon: 'error',
        position: 'bottom-right',
        timeout: 5000
      })
    }
  } else {
    // Login
    const loginData = {
      username: username.value,
      password: password.value
    }
    try {
      await store.dispatch('auth/doLogin', loginData)
      const toPath = route.query.to || '/'
      router.push(toPath)
    } catch (err) {
      console.error('Login error:', err)
      $q.notify({
        color: 'negative',
        icon: 'error',
        position: 'bottom-right',
        timeout: 5000,
        message: 'Login failed. Please check your credentials and try again.'
      })
    }
  }
}

defineOptions({
  name: 'LoginPage'
})
</script>

<style scoped>
.logo_header {
  min-height: 40px;
  max-height: 40px;
  min-width: 40px;
  max-width: 60px;
}
</style>
