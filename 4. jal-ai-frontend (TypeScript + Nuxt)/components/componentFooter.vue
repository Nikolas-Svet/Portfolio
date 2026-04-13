<script setup lang="ts">
import LogoIcon from '@/assets/images/logo.svg'
import ArrowUpIcon from '@/assets/images/arrowUp.svg'
import { Consts } from '@/consts'

const route = useRoute()

const resolveSectionLink = (link: string) => (route.path === Consts.Routes.home ? link.slice(1) : link)
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner container__main">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <LogoIcon class="site-footer__logo" />
          <div class="site-footer__divider"></div>
          <nav class="site-footer__nav" aria-label="Schnellnavigation">
            <NuxtLink :to="resolveSectionLink(Consts.Routes.homeBeratungsrichtungen)">
              Beratungsrichtungen
            </NuxtLink>
            <NuxtLink :to="resolveSectionLink(Consts.Routes.homeUs)">
              Wir
            </NuxtLink>
            <NuxtLink :to="resolveSectionLink(Consts.Routes.homeProjects)">
              Projekte
            </NuxtLink>
          </nav>
        </div>

        <a class="site-footer__scroll-top" href="#main" aria-label="Nach oben">
          <ArrowUpIcon />
        </a>
      </div>

      <div class="site-footer__mobile">
        <LogoIcon class="site-footer__logo" />
        <p class="site-footer__mobile-text">
          Gemeinsam entwickeln wir Strategien, die echte wirtschaftliche Ergebnisse
          <span>liefern - effizient, nachhaltig und individuell.</span>
        </p>
      </div>

      <div class="site-footer__bottom">
        <div class="site-footer__meta">
          <span>© 2025 JAL Consulting GmbH</span>
          <p>
            Gemeinsam entwickeln wir Strategien, die echte wirtschaftliche Ergebnisse
            <span>liefern - effizient, nachhaltig und individuell.</span>
          </p>
        </div>
        <nav class="site-footer__legal" aria-label="Rechtliche Hinweise">
          <NuxtLink :to="Consts.Routes.dataProtection">
            Datenschutzerklärung
          </NuxtLink>
          <NuxtLink :to="Consts.Routes.imprint">
            Impressum
          </NuxtLink>
        </nav>
      </div>

      <p class="site-footer__watermark">JAL Consulting</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.site-footer {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 80px 0 120px;

  &__inner {
    position: relative;
    width: 100%;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__brand {
    max-width: 756px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    width: 50px;
    height: 50px;
    flex: 0 0 auto;
  }

  &__divider {
    height: 50px;
    width: 32%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 1px;
      background-color: $primary-gray-number;
    }
  }

  &__nav {
    width: 52%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      text-decoration: none;
      text-transform: uppercase;
      font-family: $Inter-Medium;
      font-weight: 500;
      font-size: 16px;
      color: $default-white;
    }
  }

  &__scroll-top {
    position: relative;
    min-width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $primary-radius;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: $primary-radius;
      border: 1px solid $primary-light-gray;
      opacity: 0.1;
    }
  }

  &__mobile {
    display: none;
    width: 100%;
    padding-top: 24px;
    border-top: 1px solid $primary-gray-number;
    gap: 16px;
    align-items: center;

    &-text {
      max-width: 325px;
      width: 100%;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 16px;
      line-height: 1;
      color: $default-white;
      text-wrap: wrap;

      span {
        display: contents;
        color: $primary-green;
      }
    }
  }

  &__bottom {
    position: relative;
    z-index: 1;
    margin-top: calc(0.5 * $primary-margin-sections);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__meta {
    max-width: 685px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    text-transform: uppercase;
    opacity: 0.8;

    span,
    p {
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 16px;
      line-height: 1;
      color: $default-white;
    }

    p {
      max-width: 325px;
      width: 100%;
      text-wrap: wrap;

      span {
        display: contents;
        color: $primary-green;
      }
    }
  }

  &__legal {
    max-width: 268px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: 0.8;
    position: relative;

    &::after {
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

  &__watermark {
    position: absolute;
    left: 20px;
    bottom: -11%;
    width: 100%;
    color: $primary-light-gray;
    opacity: 0.05;
    text-transform: uppercase;
    font-family: $Inter-Medium;
    font-weight: 500;
    font-size: clamp(16px, 11.3vw, 160px);
    line-height: 1;
    white-space: nowrap;
  }
}

@media (width < 1000px) {
  .site-footer {
    padding: 60px 0 90px;

    &__top {
      margin-bottom: 24px;
    }

    &__brand {
      svg {
        display: none;
      }
    }

    &__divider {
      display: none;
    }

    &__nav {
      max-width: 400px;
      width: 100%;
    }

    &__mobile {
      display: flex;
    }

    &__bottom {
      align-items: flex-end;
    }

    &__meta {
      p {
        display: none;
      }
    }

    &__watermark {
      bottom: -5%;
    }
  }
}

@media (width < 560px) {
  .site-footer {
    padding: 40px 0 70px;

    &__watermark {
      bottom: -3%;
    }

    &__nav {
      flex-direction: column;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 8px;
    }

    &__meta {
      width: max-content !important;

      span {
        font-size: 10px !important;
      }
    }
  }
}

@media (width < 460px) {
  .site-footer {
    padding-bottom: 50px;

    &__bottom {
      flex-direction: column;
      align-items: center !important;
      justify-content: center !important;
      gap: 16px;
    }

    &__meta {
      order: 2;

      span {
        font-size: 16px !important;
      }
    }
  }
}
</style>
