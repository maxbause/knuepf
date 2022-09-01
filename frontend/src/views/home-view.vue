<script lang="ts" setup>
import { unref } from 'vue'
import useUser from '@/api/composables/use-user'
import router from '@/router'
import useTheme from '../core/composables/use-theme'

const theme = useTheme()
const user = useUser()
const { me } = user

const onLogoutClick = async () => {
  try {
    await user.logout()
  } finally {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="home">
    <h1>Welcome back {{me!.username}}!</h1>
    <p>Current theme: {{theme.themeColor}}</p>
    <button class="btn btn-primary"
            @click="theme.setThemeColor(unref(theme.themeColor) === 'light' ? 'dark' : 'light')">
      Change theme
    </button>
    <button class="btn btn-danger" @click="onLogoutClick">
      Logout
    </button>
  </div>
</template>
