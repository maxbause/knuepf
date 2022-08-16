<script lang="ts" setup>
import MainLayout from './components/layouts/main-layout.vue'
</script>

<template>
  <MainLayout>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </MainLayout>
</template>
