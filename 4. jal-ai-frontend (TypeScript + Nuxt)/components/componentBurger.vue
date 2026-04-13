<script setup lang="ts">
import LogoIcon from '@/assets/images/logo.svg'
import CloseIcon from '@/assets/images/close.svg'
import ArrowIcon from '@/assets/images/arrowPath.svg'
import { Consts } from '@/consts'

const emit = defineEmits<{
  (e: 'close-menu-burger'): void
}>()

const route = useRoute()
const isOpenConsulting = ref(false)

const resolveSectionLink = (link: string) => (route.path === Consts.Routes.home ? link.slice(1) : link)

const closeMenu = () => {
  isOpenConsulting.value = false
  emit('close-menu-burger')
}
</script>

<template>
  <section class="mobile-menu">
    <div class="mobile-menu__header">
      <NuxtLink class="mobile-menu__logo" :to="Consts.Routes.home" @click="closeMenu">
        <LogoIcon />
      </NuxtLink>
      <button class="mobile-menu__close" type="button" aria-label="Navigation schließen" @click="closeMenu">
        <CloseIcon />
      </button>
    </div>

    <nav class="mobile-menu__links" aria-label="Mobile navigation">
      <div class="mobile-menu__group" :class="{ 'mobile-menu__group--open': isOpenConsulting }">
        <button class="mobile-menu__group-toggle" type="button" @click="isOpenConsulting = !isOpenConsulting">
          <span>Beratungsrichtungen</span>
          <ArrowIcon class="mobile-menu__group-icon" />
        </button>
        <div class="mobile-menu__group-content">
          <NuxtLink
            class="mobile-menu__link mobile-menu__link--nested"
            :class="{ 'mobile-menu__link--active': route.path === Consts.Routes.consultingBusiness }"
            :to="Consts.Routes.consultingBusiness"
            @click="closeMenu"
          >
            Unternehmensberatung
          </NuxtLink>
          <NuxtLink
            class="mobile-menu__link mobile-menu__link--nested"
            :class="{ 'mobile-menu__link--active': route.path === Consts.Routes.consultingDigitalTransformation }"
            :to="Consts.Routes.consultingDigitalTransformation"
            @click="closeMenu"
          >
            Digitalisierungsberatung
          </NuxtLink>
          <NuxtLink
            class="mobile-menu__link mobile-menu__link--nested"
            :class="{ 'mobile-menu__link--active': route.path === Consts.Routes.consultingEconomic }"
            :to="Consts.Routes.consultingEconomic"
            @click="closeMenu"
          >
            Wirtschaftsberatung
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        class="mobile-menu__link"
        :to="resolveSectionLink(Consts.Routes.homeUs)"
        @click="closeMenu"
      >
        Wir
      </NuxtLink>
      <NuxtLink
        class="mobile-menu__link"
        :to="resolveSectionLink(Consts.Routes.homeProjects)"
        @click="closeMenu"
      >
        Projekte
      </NuxtLink>
      <NuxtLink class="mobile-menu__link" :to="Consts.Routes.dataProtection" @click="closeMenu">
        Datenschutzerklärung
      </NuxtLink>
      <NuxtLink class="mobile-menu__link" :to="Consts.Routes.imprint" @click="closeMenu">
        Impressum
      </NuxtLink>
    </nav>
  </section>
</template>

<style scoped lang="scss">
.mobile-menu {
  z-index: 10;
  max-width: 410px;
  width: 100%;
  position: fixed;
  top: 0;
  right: -415px;
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
    width: 34px;
    height: 34px;
    text-decoration: none;

    svg {
      width: 34px;
      height: 34px;
    }
  }

  &__close {
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__links {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__group {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $color-border;
  }

  &__group-toggle {
    width: 100%;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 18px;
    font-family: $Inter-Medium;
    font-weight: 500;
    color: $default-white;
  }

  &__group-icon {
    transition: transform 0.3s ease;
    transform: scale(1.4) rotate(90deg);
  }

  &__group-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    clip-path: inset(0 0 100% 0);
    transition: clip-path 0.3s ease, max-height 0.3s ease;
  }

  &__group--open {
    .mobile-menu__group-content {
      max-height: 108px;
      clip-path: inset(0 0 0 0);
    }

    .mobile-menu__group-icon {
      transform: scale(1.4) rotate(-90deg);
    }
  }

  &__link {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 54px;
    border-bottom: 1px solid $color-border;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 18px;
    font-family: $Inter-Medium;
    font-weight: 500;
    color: $default-white;

    &--nested {
      min-height: 36px;
      border-bottom: none;
      text-transform: none;
      font-size: 16px;
      font-family: $Inter-Regular;
      font-weight: 400;
      padding-left: 0;
    }

    &--active {
      color: $primary-green;
    }
  }
}
</style>
