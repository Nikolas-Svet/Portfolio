<template>
  <v-app>
    <RouterView />
    <ToastHost />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import ToastHost from "./components/ToastHost.vue";
</script>
