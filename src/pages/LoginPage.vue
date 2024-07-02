<template>
 <q-layout view="lHh Lpr fff">
  <q-page-container
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#4871b8, #1e293b);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width: 400px; height: 540px;">
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
          <q-fab
            color="secondary" @click="switchTypeForm"
            icon="add"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />
            <q-form class="q-px-sm">
              <q-input
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

              <q-input
                v-if="register"
                square
                clearable
                v-model="username"
                lazy-rules
                :rules="[required,short]"
                type="username" label="Username">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

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
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="primary"
              to="/"
              class="full-width text-white" :label="btnLabel"
            />
          </q-card-actions>
          <q-card-section
              v-if="!register"
              class="text-center q-pa-sm">
            <p class="text-grey-6">Forgot password?</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-left" :offset="[0,0]" class="q-pa-xs bg-primary text-white text-caption">
      <q-item-label>© Paytaca Inc. 2024</q-item-label>
    </q-page-sticky>

    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
// import { useQuasar } from 'quasar'

// const $q = useQuasar
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

const required = (val) => {
  return (val && val.length > 0) ? true : 'Required'
}

const diffPassword = (val) => {
  const val2 = password.value
  return (val && (val === val2)) ? true : 'Password does not match'
}
const short = (val) => {
  return (val && val.length > 3) ? true : 'Password is too short'
}

const isEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return (emailPattern.test(val)) ? true : 'Invalid email'
}

// const submit = () => {
//   if (register.value) {
//     email.value.validate()
//     username.value.validate()
//     password.value.validate()
//     repassword.value.validate()
//   } else {
//     email.value.validate()
//     password.value.validate()
//   }

// if (!register.value) {
//   if (!email.value.hasError && (!password.value.hasError)) {
//     $q.notify({
//       icon: 'done',
//       color: 'positive',
//       message: 'Авторизация'
//     })
//   }
// }

const switchTypeForm = () => {
  register.value = !register.value
  title.value = register.value ? 'Register' : 'Log in'
  btnLabel.value = register.value ? 'Register' : 'Log in'
}

const switchVisibility = () => {
  visibility.value = !visibility.value
  passwordFieldType.value = visibility.value ? 'text' : 'password'
  visibilityIcon.value = visibility.value ? 'visibility_off' : 'visibility'
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
