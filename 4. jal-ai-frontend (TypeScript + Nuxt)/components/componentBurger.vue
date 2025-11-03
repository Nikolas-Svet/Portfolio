<script setup lang="ts">
import LogoIcon from "@/assets/images/logo.svg";
import CloseIcon from "@/assets/images/close.svg";
import {Consts} from "@/consts";
import ArrowIcon from "@/assets/images/arrowPath.svg";

const route = useRoute()

const isOpenConsulting = ref<boolean>(false);
</script>

<template>
<section class="burger">
  <div class="burger__header">
    <router-link @click.native="$emit('close-menu-burger')" class="burger__logo" :to="Consts.Routes.home"><LogoIcon/></router-link>
    <CloseIcon class="burger__close" @click.native="$emit('close-menu-burger')" />
  </div>
  <div class="burger__links">
    <div class="burger__consulting">
      <p @click="isOpenConsulting = !isOpenConsulting" class="burger__consulting--title">
        beratungsrichtunger
        <ArrowIcon :style="{transform: isOpenConsulting ? 'scale(1.4) rotate(-90deg)' : 'scale(1.4) rotate(90deg)'}"/>
      </p>
      <div :style="{height: isOpenConsulting ? '108px' : '0', clipPath: isOpenConsulting ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'}" class="burger__consulting--content">
        <router-link
            @click.native="$emit('close-menu-burger')"
            :class="{ 'burger__consulting--active': route.path === Consts.Routes.consultingBusiness }"
            :to="Consts.Routes.consultingBusiness"
            :disabled="route.path === Consts.Routes.consultingBusiness"
        >Unternehmensberatung</router-link>
        <router-link
            @click.native="$emit('close-menu-burger')"
            :class="{ 'burger__consulting--active': route.path === Consts.Routes.consultingDigitalTransformation }"
            :to="Consts.Routes.consultingDigitalTransformation"
            :disabled="route.path === Consts.Routes.consultingDigitalTransformation">
          Digitalisierungsberatung</router-link>
        <router-link
            @click.native="$emit('close-menu-burger')"
            :class="{ 'burger__consulting--active': route.path === Consts.Routes.consultingEconomic }"
            :to="Consts.Routes.consultingEconomic"
            :disabled="route.path === Consts.Routes.consultingEconomic">
          Wirtschaftsberatung</router-link>
      </div>
    </div>
    <router-link @click.native="$emit('close-menu-burger')" :to="route.path === Consts.Routes.home ? Consts.Routes.homeUs.split('/')[1] : Consts.Routes.homeUs" class="burger__link">Wir</router-link>
    <router-link @click.native="$emit('close-menu-burger')" :to="route.path === Consts.Routes.home ? Consts.Routes.homeProjects.split('/')[1] : Consts.Routes.homeProjects" class="burger__link">Projekte</router-link>
    <router-link @click.native="$emit('close-menu-burger')" :to="Consts.Routes.dataProtection" class="burger__link">Datenschutzerklärung</router-link>
    <router-link @click.native="$emit('close-menu-burger')" :to="Consts.Routes.imprint" class="burger__link">IMPRESSUM</router-link>
  </div>
</section>
</template>

<style scoped lang="scss">
.burger {
  z-index: 10;
  max-width: 410px;
  width: 100%;
  position: fixed;
  top: 0;
  height: 100dvh;
  background-color: $primary-black;
  padding: 16px;
  transition: right 0.3s ease;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  &__logo {
    text-decoration: none;
    width: 34px;
    height: 34px;
    svg {
      width: 34px;
      height: 34px;
    }
  }

  &__close {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__links {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__consulting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid $color-border;
    p {
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 54px;
      text-transform: uppercase;
      font-size: 18px;
      font-family: $Inter-Medium;
      font-weight: 500;
      color: $default-white;
      svg {
        transition: all 0.3s ease;
      }
    }

    &--content {
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      width: 100%;

      a {
        width: 100%;
        color: $default-white;
        height: 36px;
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 16px;
        text-decoration: none;
      }
    }

    &--active {
      color: $primary-green !important;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    width: 100%;
    height: 54px;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 18px;
    font-family: $Inter-Medium;
    font-weight: 500;
    color: $default-white;
    border-bottom: 1px solid $color-border;
  }
}
</style>