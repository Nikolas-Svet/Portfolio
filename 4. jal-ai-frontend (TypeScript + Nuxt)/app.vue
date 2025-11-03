<template>
  <NuxtRouteAnnouncer/>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <cookie-app/>
</template>
<script lang="ts" setup>
import CookieApp from "@/components/ui/cookieApp.vue";
</script>