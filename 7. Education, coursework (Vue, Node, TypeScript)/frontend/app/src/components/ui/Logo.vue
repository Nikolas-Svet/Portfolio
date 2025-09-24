<script setup lang="ts">
import {Routes} from "@/utils/consts.ts";
import LogoIcon from "@/assets/images/logo.svg";
</script>

<template>
  <router-link class="logo" :to="Routes.main">
    <div class="logo__images">
      <LogoIcon></LogoIcon>
    </div>
    <h1>NikCourse</h1>
  </router-link>
</template>

<style scoped lang="scss">
.logo {
  text-decoration: none;
  max-width: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-family: $Golos_Text_Medium;
    font-weight: 500;
    font-size: 20px;
    color: $primary-text-color;
  }
}
</style>
