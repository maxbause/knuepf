<script lang="ts" setup>
import { unref } from 'vue'
import useTheme from '../composables/core/use-theme'

const theme = useTheme()
</script>

<template>
  <div class="home">
    <h1>Current theme: {{theme.themeColor}}</h1>
    <button class="btn btn-primary"
            @click="theme.setThemeColor(unref(theme.themeColor) === 'light' ? 'dark' : 'light')">
      Change theme
    </button>
  </div>
</template>
