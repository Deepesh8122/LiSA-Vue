<template>
  <router-view />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
@import './assets/main.css';

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
