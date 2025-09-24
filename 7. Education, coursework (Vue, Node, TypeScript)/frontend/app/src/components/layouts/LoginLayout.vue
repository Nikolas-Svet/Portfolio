<template>
<div class="LoginLayout">
  <div class="LoginLayout__wrap"></div>
  <main class="LoginLayout__content container__auth">
    <RouterView />
  </main>
</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.LoginLayout {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &__content {
  }

  &__wrap {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
