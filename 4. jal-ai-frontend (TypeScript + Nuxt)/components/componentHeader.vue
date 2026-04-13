<script setup lang="ts">
import LogoIcon from '@/assets/images/logo.svg'
import ArrowIcon from '@/assets/images/arrow.svg'
import BurgerIcon from '@/assets/images/burger.svg'
import ArrowIconPath from '@/assets/images/arrowPath.svg'
import { Consts } from '@/consts'
import { useMessagesStore } from '@/stores/messages'
import ComponentBurger from '@/components/componentBurger.vue'

const messagesStore = useMessagesStore()
const route = useRoute()

const isOpenMenuBurger = ref(false)
const isOpenConsultingMenu = ref(false)

const closeMenus = () => {
  isOpenMenuBurger.value = false
  isOpenConsultingMenu.value = false
}

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
  closeMenus()
}

const resolveSectionLink = (link: string) => (route.path === Consts.Routes.home ? link.slice(1) : link)

watch(() => route.fullPath, closeMenus)
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container__main">
      <NuxtLink class="site-header__brand" to="/" aria-label="JAL Consulting" @click="closeMenus">
        <LogoIcon class="site-header__logo" />
        <h1 class="site-header__brand-name">JAL Consulting</h1>
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Hauptnavigation">
        <div
          class="site-header__dropdown"
          :class="{ 'site-header__dropdown--open': isOpenConsultingMenu }"
        >
          <button
            class="site-header__dropdown-toggle"
            type="button"
            :aria-expanded="isOpenConsultingMenu"
            aria-haspopup="true"
            @click="isOpenConsultingMenu = !isOpenConsultingMenu"
          >
            <span>Beratungsrichtungen</span>
            <ArrowIconPath class="site-header__dropdown-icon" />
          </button>
          <div class="site-header__dropdown-menu">
            <NuxtLink
              class="site-header__dropdown-link"
              :class="{ 'site-header__dropdown-link--active': route.path === Consts.Routes.consultingBusiness }"
              :to="Consts.Routes.consultingBusiness"
              @click="closeMenus"
            >
              Unternehmensberatung
            </NuxtLink>
            <NuxtLink
              class="site-header__dropdown-link"
              :class="{ 'site-header__dropdown-link--active': route.path === Consts.Routes.consultingDigitalTransformation }"
              :to="Consts.Routes.consultingDigitalTransformation"
              @click="closeMenus"
            >
              Digitalisierungsberatung
            </NuxtLink>
            <NuxtLink
              class="site-header__dropdown-link"
              :class="{ 'site-header__dropdown-link--active': route.path === Consts.Routes.consultingEconomic }"
              :to="Consts.Routes.consultingEconomic"
              @click="closeMenus"
            >
              Wirtschaftsberatung
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          class="site-header__nav-link"
          :to="resolveSectionLink(Consts.Routes.homeUs)"
          @click="closeMenus"
        >
          Wir
        </NuxtLink>
        <NuxtLink
          class="site-header__nav-link"
          :to="resolveSectionLink(Consts.Routes.homeProjects)"
          @click="closeMenus"
        >
          Projekte
        </NuxtLink>
      </nav>

      <button
        v-if="route.path === Consts.Routes.consultingEconomic"
        class="site-header__cta site-header__cta--wide baseButton__w270 baseButton__primaryGreen"
        type="button"
        @click="closeMenus"
      >
        Kostenloses Erstgespräch vereinbaren
        <ArrowIcon />
      </button>
      <button
        v-else
        class="site-header__cta baseButton__w270 baseButton__primaryGreen"
        type="button"
        @click="openDialog"
      >
        Fördermittel check
        <ArrowIcon />
      </button>

      <button
        class="site-header__burger"
        type="button"
        aria-label="Navigation öffnen"
        @click="isOpenMenuBurger = true"
      >
        <BurgerIcon />
      </button>
    </div>

    <ComponentBurger
      :style="{ right: isOpenMenuBurger ? '0' : '-415px' }"
      @close-menu-burger="closeMenus"
    />
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  width: 100%;
  padding-top: 20px;

  &__inner {
    position: relative;
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__brand {
    text-decoration: none;
    max-width: 160px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    width: 32px;
    height: 32px;
  }

  &__brand-name {
    font-weight: 500;
    font-family: $Inter-Medium;
    font-size: 16px;
    color: $default-white;
  }

  &__nav {
    max-width: 395px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__dropdown {
    position: relative;
  }

  &__dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
    font-family: $Inter-Medium;
    font-size: 16px;
    color: $default-white;
  }

  &__dropdown-icon {
    transform: rotate(90deg) scale(1.3);
    transition: transform 0.3s ease;
  }

  &__dropdown-menu {
    position: absolute;
    z-index: 2;
    top: calc(100% - 2px);
    left: 0;
    width: 100%;
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: $primary-radius;
    background-color: $default-black;
    clip-path: inset(0 0 100% 0);
    transition: clip-path 0.3s ease;
  }

  &__dropdown-link {
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    font-family: $Inter-Medium;
    color: $default-white;
    transition: color 0.3s ease;

    &:hover,
    &--active {
      color: $primary-green;
    }
  }

  &__nav-link {
    padding: 10px 0;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 500;
    font-family: $Inter-Medium;
    font-size: 16px;
    color: $default-white;
    transition: color 0.3s ease;

    &:hover {
      color: $primary-green;
    }
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;

    &--wide {
      width: max-content;
      max-width: none !important;
    }

    svg {
      width: 24px;
      height: 24px;
      margin-left: 8px;

      * {
        fill: $default-white;
      }
    }
  }

  &__burger {
    width: 24px;
    aspect-ratio: 1 / 1;
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.site-header__dropdown:hover .site-header__dropdown-menu,
.site-header__dropdown:focus-within .site-header__dropdown-menu,
.site-header__dropdown--open .site-header__dropdown-menu {
  clip-path: inset(0 0 0 0);
}

@media (width < 1140px) {
  .site-header {
    &__cta {
      &--wide {
        max-width: 326px !important;
      }
    }
  }
}

@media (width < 980px) {
  .site-header {
    padding-top: 6px;

    &__nav,
    &__cta {
      display: none;
    }

    &__burger {
      display: flex;
    }
  }
}

@media (width < 560px) {
  .site-header {
    &__brand-name {
      display: none;
    }
  }
}
</style>
