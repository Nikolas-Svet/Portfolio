<script setup lang="ts">

</script>

<template>
  <div class="mainLayout">
    <Header/>
    <main class="mainLayout__content container__main">
      <RouterView />
    </main>
    <Footer/>
  </div>
</template>

<style scoped lang="scss">
.mainLayout {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: $primary-green;

  &__content {

  }
}
</style>
