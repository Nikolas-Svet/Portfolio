<script setup lang="ts">
import ComponentBot from "@/components/bot/componentBot.vue";

const isIpad = ref(false)
const isMobile = ref(false)

const updateDeviceClass = () => {
  isIpad.value = window.innerWidth < 1200 && window.innerWidth >= 768
  isMobile.value = window.innerWidth < 768
}

const deviceClass = computed(() => (isMobile.value ? 'mobile' : isIpad.value ? 'ipad' : 'desktop'))

onMounted(() => {
  updateDeviceClass()
  window.addEventListener('resize', updateDeviceClass)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceClass)
})
</script>

<template>
  <componentHeader />
  <main :class="['container__main', deviceClass]">
    <slot />
  </main>
  <componentFooter :class="deviceClass" />
  <component-bot />
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
