<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

const layout = computed(() => `${route.meta.layout || 'main'}`)
</script>

<template>
  <MainLayout v-if="layout === 'main'">
    <RouterView />
  </MainLayout>
  <LoginLayout v-else>
    <RouterView />
  </LoginLayout>
</template>
