<script lang="ts" setup>
import LogoIcon from '@/assets/images/logo.svg';
import ArrowIcon from '@/assets/images/arrow.svg';
import BurgerIcon from '@/assets/images/burger.svg';
import ArrowIconPath from "@/assets/images/arrowPath.svg";
import {useMessagesStore} from "@/stores/messages";
import {Consts} from "@/consts";
import ComponentBurger from "@/components/componentBurger.vue";

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}

onMounted(async () => {
  await nextTick()
  const container = document.querySelectorAll('.icon__')
  for (const item of container) {
    item.classList.remove('icon__');
  }
})

const route = useRoute()

const isOpenMenuBurger = ref<boolean>(false)
</script>

<template>
  <header id="main" class="container__main">
    <div class="content">
      <NuxtLink class="content__left" to="/">
        <LogoIcon class="content__logo"/>
        <h1>JAL Consulting</h1>
      </NuxtLink>
      <div class="content__center">
      <span class="content__links">
        <div>
            beratungsrichtunger
            <ArrowIconPath/>
        </div>
        <div class="content__links--block">
          <router-link
              :class="{ 'content__links--active': route.path === Consts.Routes.consultingBusiness }"
              :disabled="route.path === Consts.Routes.consultingBusiness"
              :to="Consts.Routes.consultingBusiness"
          >Unternehmensberatung</router-link>
          <router-link
              :class="{ 'content__links--active': route.path === Consts.Routes.consultingDigitalTransformation }"
              :disabled="route.path === Consts.Routes.consultingDigitalTransformation"
              :to="Consts.Routes.consultingDigitalTransformation">
            Digitalisierungsberatung</router-link>
          <router-link
              :class="{ 'content__links--active': route.path === Consts.Routes.consultingEconomic }"
              :disabled="route.path === Consts.Routes.consultingEconomic"
              :to="Consts.Routes.consultingEconomic">
            Wirtschaftsberatung</router-link>
        </div>
      </span>
        <router-link :to="route.path === Consts.Routes.home ? Consts.Routes.homeUs.split('/')[1] : Consts.Routes.homeUs"
                     class="content__links">Wir
        </router-link>
        <router-link
            :to="route.path === Consts.Routes.home ? Consts.Routes.homeProjects.split('/')[1] : Consts.Routes.homeProjects"
            class="content__links">Projekte
        </router-link>
      </div>
      <button v-if="route.path === Consts.Routes.consultingEconomic" class="content__right content__right--economic baseButton__w270 baseButton__primaryGreen">
        Kostenloses Erstgespräch vereinbaren
        <ArrowIcon/>
      </button>
      <button v-else class="content__right baseButton__w270 baseButton__primaryGreen" @click="openDialog">
        Fördermittel check
        <ArrowIcon/>
      </button>
      <button class="content__burger" @click="isOpenMenuBurger = true">
        <BurgerIcon @click="isOpenMenuBurger = true"/>
      </button>
    </div>
  </header>
  <component-burger :style="{right: isOpenMenuBurger ? '0' : '-415px'}" @close-menu-burger="isOpenMenuBurger = false"/>
</template>

<style lang="scss" scoped>
header {
  width: 100%;
  padding-top: 20px;
}

.content {
  position: relative;
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__left {
    text-decoration: none;
    max-width: 160px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      height: 32px;
      width: 32px;
    }

    h1 {
      font-weight: 500;
      font-family: $Inter-Medium;
      font-size: 16px;
      color: $default-white;
    }
  }

  &__burger {
    width: 24px;
    aspect-ratio: 1/1;
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

  &__center {
    //position: absolute;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%, -50%);
    max-width: 395px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  a {
    cursor: pointer;
  }

  &__links {
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 500;
    font-family: $Inter-Medium;
    font-size: 16px;
    color: $default-white;
    position: relative;
    transition: all 0.3s ease;
    cursor: default;
    padding: 10px 0;

    div {
      &:first-child {
        display: flex;

        svg {
          margin-left: 16px;
          transform: rotate(90deg) scale(1.3);
          transition: all 0.3s ease;

          * {
            transition: all 0.3s ease;
          }

        }
      }
    }

    &:hover {
      color: $primary-green;

      svg {
        transform: rotate(270deg) scale(1.3) !important;

        * {
          fill: $primary-green;
        }
      }

      div {
        clip-path: inset(0 0 0 0) !important;
      }
    }

    &--active {
      color: $primary-green !important;
    }

    &--block {
      clip-path: inset(0 0 100% 0);
      border-radius: $primary-radius;
      background-color: $default-black;
      padding: 20px 16px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: absolute;
      z-index: 1;
      top: 100%;
      left: 0;
      width: 100%;
      transition: all 0.3s ease;

      a {
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        text-transform: none !important;
        font-family: $Inter-Medium;
        color: $default-white;
        transition: all 0.3s ease;

        &:hover {
          color: $primary-green;
        }
      }
    }
  }

  &__right {
    &--economic {
      width: max-content !important;
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
}

@media (width < 1140px) {
  .content {
    &__right {
      &--economic {
        max-width: 326px !important;
      }
    }
  }
}

@media (width < 980px) {
  header {
    padding-top: 6px;
  }
  .content__center {
    display: none;
  }
  .content__right {
    display: none;
  }
  .content__burger {
    display: flex;
  }

}

@media (width < 560px) {
  h1 {
    display: none;
  }
}
</style>