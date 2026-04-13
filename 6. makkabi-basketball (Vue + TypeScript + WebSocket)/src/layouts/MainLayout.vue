<script setup lang="ts">

</script>

<template>
  <section class="main-layout">
    <RouterView/>
  </section>
</template>

<style scoped lang="scss">
.main-layout {
  background-color: $primary-background;
  width: 100%;
  min-height: 100dvh;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>