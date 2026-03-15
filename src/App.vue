<template>
  <Header v-if="!$route.meta.hideHeader"/>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import Header from './views/Header.vue';
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>