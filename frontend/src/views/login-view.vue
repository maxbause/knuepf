<script setup lang="ts">
import router from '@/router'
import useUser from '@/api/composables/use-user'
import { ref, watchEffect } from 'vue'
import CombinedApiError from '@/core/errors/combined-api-error'
import i18n from '@/i18n'

const user = useUser()
const formState = ref({
  username: '',
  password: '',
})
const submitBlocked = ref<boolean>(false)
const invalidCredentials = ref<boolean>(false)
const customErrorMessage = ref<string | undefined>()

const handleCombinedApiError = (error: CombinedApiError): void => {
  const message = error.firstError.data?.message
  if (!message) return

  let translatedMessage = message
  if (message === 'error.api.banned') {
    translatedMessage = i18n.global.t(message)
  }

  customErrorMessage.value = translatedMessage
}

const onSubmit = async () => {
  submitBlocked.value = true

  try {
    await user.login(formState.value.username, formState.value.password)
    router.push({ name: 'home' })
  } catch (error) {
    if (error instanceof CombinedApiError) {
      handleCombinedApiError(error)
    }

    formState.value.password = ''
    invalidCredentials.value = true
  } finally {
    submitBlocked.value = true
  }
}

watchEffect(() => {
  if (!formState.value.username.trim() || !formState.value.password.trim()) {
    submitBlocked.value = true
  } else {
    submitBlocked.value = false
  }
})
</script>

<style lang="scss">
  .login {
    position: relative;
    width: 100vw;
    height: 100vh;

    &__background {
      position: absolute;
      width: 100vw;
      height: 100vh;
      background-color: var(--bs-light);
      opacity: 0.16;
      background-image: radial-gradient(var(--bs-dark) 1px, var(--bs-light) 1px);
      background-size: 14px 14px;
      z-index: -1;
    }

    &__card {
      width: 100%;
      max-width: 24rem;
    }
  }
</style>

<template>
  <div class="login d-flex justify-content-center align-items-center flex-column">
    <div class="login__background"></div>
    <h4 class="card-title mb-3 text-center">{{$t("views.login.header")}}</h4>
    <div class="login__card card d-inline-flex">
      <div class="card-body">
        <form @submit.prevent="onSubmit()">
          <div class="mb-3">
            <label for="inputUsername" class="form-label">{{$t("views.login.form.username")}}</label>
            <input type="text" class="form-control" id="inputUsername" autocomplete="username" v-model="formState.username">
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">{{$t("views.login.form.password")}}</label>
            <input type="password" class="form-control" id="inputPassword" autocomplete="current-password" v-model="formState.password">
          </div>

          <p v-if="invalidCredentials" class="text-center text-danger mt-3 mb- danger">
            {{customErrorMessage || $t("views.login.invalidCredentials")}}
          </p>

          <div class="d-grid gap-2">
            <button class="btn btn-primary" type="submit" :disabled="submitBlocked">
              {{$t("views.login.loginButton")}}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
