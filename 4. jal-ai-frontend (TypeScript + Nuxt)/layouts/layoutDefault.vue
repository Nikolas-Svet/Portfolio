<script setup lang="ts">
import ComponentBot from "@/components/bot/componentBot.vue";

const isIpad = ref(false)
const isMobile = ref(false)

const updateDeviceClass = () => {
  isIpad.value = window.innerWidth < 1200 && window.innerWidth >= 768
  isMobile.value = window.innerWidth < 768
}

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
  <main :class="['container__main', isIpad ? 'ipad' : 'desktop', {'mobile': isMobile}]">
    <slot />
  </main>
  <componentFooter :class="['container__main', isIpad ? 'ipad' : 'desktop', {'mobile': isMobile}]" />
  <component-bot/>
</template>


<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
