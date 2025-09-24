<script setup lang="ts">

</script>

<template>
  <section class="login-layout">
    <div class="login-layout__content container__auth">
      <RouterView/>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-layout {
  width: 100%;
  min-height: 100vh;
  background-color: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>