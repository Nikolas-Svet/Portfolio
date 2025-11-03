<script lang="ts" setup>
import LogoIcon from '@/assets/images/logo.svg';
import ArrowUpIcon from '@/assets/images/arrowUp.svg';
import {Consts} from "@/consts";

const route = useRoute()
</script>

<template>
  <footer class="container__main">
    <div class="content">
      <div class="content__left">
        <LogoIcon/>
        <div class="content__line"></div>
        <nav class="content__nav">
          <router-link
              :to="route.path === Consts.Routes.home ? Consts.Routes.homeBeratungsrichtungen.split('/')[1] : Consts.Routes.homeBeratungsrichtungen">
            Beratungsrichtungen
          </router-link>
          <router-link
              :to="route.path === Consts.Routes.home ? Consts.Routes.homeUs.split('/')[1] : Consts.Routes.homeUs">Wir
          </router-link>
          <router-link
              :to="route.path === Consts.Routes.home ? Consts.Routes.homeProjects.split('/')[1] : Consts.Routes.homeProjects">
            Projekte
          </router-link>
        </nav>
      </div>
      <a class="content__right" href="#main">
        <ArrowUpIcon/>
      </a>
    </div>
    <div class="contentMobile">
      <div>
        <LogoIcon/>
        <p>Gemeinsam entwickeln wir Strategien, die echte wirtschaftliche Ergebnisse <span>liefern — effizient, nachhaltig und individuell.</span>
        </p>
      </div>
    </div>
    <div class="content2">
      <div class="content2__left">
        <span>© 2025 JAL Consulting GmbH</span>
        <p>Gemeinsam entwickeln wir Strategien, die echte wirtschaftliche Ergebnisse <span>liefern — effizient, nachhaltig und individuell.</span>
        </p>
      </div>
      <nav class="content2__right">
        <NuxtLink to="/data-protection/">
          Datenschutzerklärung
        </NuxtLink>
        <NuxtLink to="/imprint/">
          Impressum
        </NuxtLink>
      </nav>
    </div>
    <p class="logo">
      JAL Consulting
    </p>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  padding-top: 80px;
  padding-bottom: 120px;
  overflow: hidden;
  width: 100%;
  position: relative;
  text-wrap: nowrap;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__line {
      height: 50px;
      width: 32%;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 1px;
        width: 100%;
        background-color: $primary-gray-number;
      }
    }

    &__nav {
      width: 52%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      a {
        font-family: $Inter-Medium;
        font-weight: 500;
        font-size: 16px;
        text-transform: uppercase;
        color: $default-white;
        text-decoration: none;
      }
    }

    &__left {
      max-width: 756px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      svg {
        width: 50px;
        height: 50px;
      }
    }

    &__right {
      position: relative;
      height: 50px;
      min-width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: $primary-radius;
        border: 1px solid $primary-light-gray;
        opacity: 0.1;
      }
    }
  }

  .contentMobile {
    display: none;
    width: 100%;
    padding-top: 24px;
    border-top: 1px solid $primary-gray-number;
    span, p {
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 16px;
      line-height: 1;
      color: $default-white;
    }

    p {
      text-wrap: wrap;
      max-width: 325px;
      width: 100%;

      span {
        display: contents;
        color: $primary-green !important;
      }
    }

    svg {
      width: 50px;
      height: 50px;
    }

    div {
      gap: 16px;
      max-width: 400px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .content2 {
    position: relative;
    z-index: 1;
    margin-top: calc(0.5 * $primary-margin-sections);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    &__left {
      text-transform: uppercase;
      max-width: 685px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      opacity: 0.8;

      span, p {
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 16px;
        line-height: 1;
        color: $default-white;
      }

      p {
        text-wrap: wrap;
        max-width: 325px;
        width: 100%;

        span {
          display: contents;
          color: $primary-green !important;
        }
      }
    }

    &__right {
      max-width: 268px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      opacity: 0.8;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        left: 64%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1px;
        height: 100%;
        background-color: $default-white;
      }

      a {
        text-decoration: none;
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 16px;
        line-height: 1;
        color: $default-white;
      }
    }
  }

  .logo {
    position: absolute;
    font-family: $Inter-Medium;
    font-weight: 500;
    width: 100%;
    font-size: clamp(16px, 11.3vw, 160px);;
    line-height: 1;
    bottom: -11%;
    left: 20px;
    color: $primary-light-gray;
    opacity: 0.05;
    text-transform: uppercase;
  }

}

@media (width < 1000px) {
  footer {
    padding-top: 60px;
    padding-bottom: 90px;
  }
  .contentMobile {
    display: flex !important;
  }
  .content {
    margin-bottom: 24px;
    &__left {
      svg {
        display: none;
      }
    }

    &__nav {
      max-width: 400px;
      width: 100% !important;
    }

    &__line {
      display: none;
    }
  }
  .content2 {
    &__left {
      p {
        display: none;
      }
    }
  }

  .logo {
    bottom: -5% !important;
  }
}

@media (width < 560px) {
  footer {
    padding-top: 40px;
    padding-bottom: 70px;
  }
  .logo {
    bottom: -3% !important;
  }
  .content {
    &__nav {
      flex-direction: column;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 8px;

      a {
        &:nth-child(2) {
          order: 2;
        }
      }
    }
  }
  .content2 {
    &__left {
      width: max-content !important;
      span {
        font-size: 10px !important;
      }
    }
  }
}

@media (width < 460px) {
  footer {
    padding-bottom: 50px;
  }
  .content2 {
    flex-direction: column;
    align-items: center !important;
    justify-content: center !important;
    gap: 16px;
    &__left {
      order: 2;
      span {
        font-size: 16px !important;
      }
    }
  }
}
</style>