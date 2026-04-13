<script setup lang="ts">
import {computed, onBeforeUnmount, provide, ref} from "vue";
import { useRoute } from "vue-router";
import LoginLayout from '@/layouts/LoginLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

import { onMounted } from "vue";

const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);

const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
  console.log("Обновление ориентации:", isPortrait.value);
};

provide("isPortrait", isPortrait);

onMounted(() => {
  updateOrientation();

  window.addEventListener("resize", updateOrientation);
  window.addEventListener("orientationchange", updateOrientation); // ✅ Теперь ориентация обновляется на телефоне
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateOrientation);
  window.removeEventListener("orientationchange", updateOrientation);
});

const layouts = {
  login: LoginLayout,
  main: MainLayout
};

const route = useRoute();
const layout = computed(() => layouts[route.meta.layout as keyof typeof layouts] || MainLayout);
</script>

<template>
  <component class="App" :is="layout">
    <RouterView />
  </component>
</template>


<style scoped lang="scss">
</style>
