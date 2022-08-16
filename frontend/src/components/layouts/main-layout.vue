<script lang="ts" setup>
import { watchEffect } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import useTheme from '../../composables/core/use-theme'

const theme = useTheme()

watchEffect(() => {
  if (theme.themeColor.value === 'dark') {
    const nightThemeCssLink = document.createElement('link')
    nightThemeCssLink.setAttribute('rel', 'stylesheet')
    nightThemeCssLink.setAttribute('href', '/frontend/css/bootstrap-night.min.css')
    nightThemeCssLink.setAttribute('id', 'bootstrapNightCssLink')

    document.head.appendChild(nightThemeCssLink)
  } else {
    document.querySelector('#bootstrapNightCssLink')?.remove()
  }
})

</script>

<template>
  <div class="main">
    <slot></slot>
  </div>
</template>
