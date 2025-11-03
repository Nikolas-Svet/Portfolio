<script lang="ts" setup>
import ArrowIcon from '@/assets/images/arrow.svg';
import ArrowUpIcon from '@/assets/images/arrowUp.svg';

const blocks = [
  {
    link: '/projects/online-shops/',
    title: "Optimierung eines Online-Shops",
    number: "01",
    info1: "Vertrieb über bekannte Plattformen, 40 unrentable Produkte im Sortiment.",
    info2: "Neue Plattform eingebunden, Sortiment gestrafft, Lager optimiert.",
    info3: "+312 % Umsatz, bessere Auslastung, höhere Rentabilität ohne Zusatzkosten.",
  },
  {
    link: '/projects/pizzeria/',
    title: "Optimierung einer Pizzeria",
    number: "02",
    info1: "Telefonische Bestellungen, keine Website.",
    info2: "Online-Bestellungen über Website und QR-Codes.",
    info3: "Umsatzsteigerung um 38 %, Entlastung der Mitarbeiter.",
  },
  {
    link: '/projects/crm-system/',
    title: "Implementierung eines CRM-Systems für einen Energiebroker",
    number: "03",
    info1: "Verwaltung über Excel-Tabellen.",
    info2: "Automatisierung durch CRM-System.",
    info3: "Wachstum des Kundenstamms um 20 % ohne Personalerweiterung",
  },
]

const currentIndex = ref<number>(1)

const isMobile = ref<boolean>(false)

const updateDeviceClass = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateDeviceClass()
  window.addEventListener('resize', updateDeviceClass)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceClass)
})
</script>

<template>
  <div v-if="isMobile" class="projects-blocks__actions">
    <div>
      <button
          :class="{'projects-blocks__actions--default': currentIndex !== 0, 'projects-blocks__actions--last': currentIndex === 0}"
          @click="currentIndex === 0 ? null : currentIndex -= 1"
      >
        <ArrowUpIcon/>
      </button>
      <button
          :class="{'projects-blocks__actions--default': currentIndex !== 2, 'projects-blocks__actions--last': currentIndex === 2}"
          @click="currentIndex === 2 ? null : currentIndex += 1"
      >
        <ArrowUpIcon/>
      </button>
    </div>
  </div>
  <div class="projects-blocks">
    <div class="projects-blocks__left">
      <div :style="{opacity: currentIndex === 0 ? '1' : 0}"></div>
      <div :style="{opacity: currentIndex === 1 ? '1' : 0}"></div>
      <div :style="{opacity: currentIndex === 2 ? '1' : 0}"></div>
    </div>
    <div class="projects-blocks__right">
      <template v-for="(block, index) in blocks">
        <router-link v-if="!isMobile || (isMobile && currentIndex === index)" :key="index"
                     :class="{block__active: currentIndex === 1 && index === 1 && !isMobile}" :to="block.link"
                     class="block" @mouseleave="!isMobile ? currentIndex = 1 : null" @mousemove="currentIndex = index">
          <div class="block__content">
            <div class="block__left">
              <span class="block__number">{{ block.number }}</span>
              <p class="block__title">{{ block.title }}</p>
            </div>
            <div class="block__right">
              <div class="block__info">
                <span>Vorher:</span>
                <p>{{ block.info1 }}</p>
              </div>
              <div class="block__info">
                <span>Nachher:</span>
                <p>{{ block.info2 }}</p>
              </div>
              <div class="block__info">
                <span>Ergebnis:</span>
                <p>{{ block.info3 }}</p>
              </div>
              <span class="block__action">
                Projekt ansehen
                <ArrowIcon/>
              </span>
            </div>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.projects-blocks {
  margin-top: calc(0.75 * $primary-margin-sections);
  width: 100%;
  display: flex;

  &__actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    div {
      display: flex;
      align-items: center;
      gap: 8px;

      button {
        height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $primary-green;
        border-radius: $primary-radius;

        &:first-child {
          svg {
            transform: rotate(-90deg);
          }
        }

        &:last-child {
          svg {
            transform: rotate(90deg);
          }
        }
      }
    }

    &--default {
      background-color: $primary-green;

      * {
        stroke: $default-white;
      }
    }

    &--last {
      background-color: transparent;
      * {
        stroke: $primary-green;
      }
    }
  }

  &__left {
    min-width: 360px;
    display: flex;
    position: relative;

    div {
      height: 100%;
      width: 360px;
      transition: all 0.3s ease;
      position: absolute;
      inset: 0;
      background-size: cover;

      &:first-child {
        background-image: url(@/assets/images/index/projects/img.webp);
      }

      &:nth-child(2) {
        background-image: url(@/assets/images/index/projects/img2.webp);
      }

      &:last-child {
        background-image: url(@/assets/images/index/projects/img3.webp);
      }
    }
  }

  &__right {
    width: 100%;
    border-top: 1px solid $primary-gray-number;
  }

  .block {
    text-decoration: none;
    padding: 30px 20px;
    width: 100%;
    display: flex;
    border-bottom: 1px solid $primary-gray-number;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: $primary-gray-block;

      svg {
        transform: translateX(6px) !important;
      }
    }

    svg {
      transition: all 0.3s ease;
    }

    &__active {
      background-color: $primary-gray-block;
    }

    &__content {
      max-width: 870px;
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    &__left {
      width: 36%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    &__right {
      width: 60%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
    }

    &__info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 7px;

      span {
        min-width: 66px;
        font-size: 16px;
        font-family: $Inter-Regular;
        font-weight: 400;
        line-height: 1;
        width: max-content;
        margin-right: 20px;
        color: $primary-light-gray;
      }

      p {
        max-width: 327px;
        font-size: 16px;
        font-family: $Inter-Regular;
        font-weight: 400;
        line-height: 1;
        width: 100%;
        color: $primary-gray;
      }
    }

    &__action {
      margin-top: 27px;
      width: max-content;
      font-size: 18px;
      font-family: $Inter-Regular;
      font-weight: 400;
      line-height: 1;
      display: flex;
      align-items: center;
      position: relative;
      color: $primary-green;

      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(100% - 32px);
        height: 1px;
        background-color: $primary-green;
      }

      svg {
        height: 24px;
        width: 24px;
        margin-left: 8px;

        * {
          fill: $primary-green;
        }
      }
    }

    &__number {
      font-size: 16px;
      font-weight: 400;
      color: $primary-light-gray;
      font-family: $Inter-Regular;
    }

    &__title {
      width: 66%;
      font-family: $Manrope-Regular;
      font-weight: 400;
      font-size: 22px;
      line-height: 1;
      color: $default-white;
    }
  }
}

@media (width < 1200px) {
  .block {
    &__left {
      width: 46% !important;
    }

    &__right {
      width: 50% !important;
    }

    &__title {
      width: 80% !important;
    }
  }
}

@media (width < 960px) {
  .block {

    &__content {
      flex-direction: column;
      gap: 16px;
    }

    &__left, &__right {
      width: 100% !important;
      max-width: none;
    }
  }
}

@media (width < 768px) {
  .projects-blocks {
    margin-top: 16px;
    flex-direction: column;

    &__left {
      min-width: 0;
      aspect-ratio: 360/160;

      div {
        width: 100%;
        height: 100%;

        &:first-child {
          background-position-y: 35%;
        }

        &:nth-child(2) {
          background-position-y: 50%;
        }

        &:last-child {
          background-position-y: 58%;
        }
      }
    }
  }
  .projects-blocks__actions {
    margin-top: 32px;
  }

  .block {
    border-left: 1px solid $primary-gray-number;
    border-right: 1px solid $primary-gray-number;
    &__left {
      justify-content: flex-start !important;
      margin-bottom: 40px;
    }
    &__number {
      min-width: 66px;
      margin-right: 20px;
    }
    &__info {
      p {
        line-height: 1.1 !important;
      }
    }
  }
}
</style>