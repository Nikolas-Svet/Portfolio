<script lang="ts" setup>
import ArrowIcon from '@/assets/images/arrow.svg';
import {Consts} from "@/consts";

const blocks = [
  {
    link: Consts.Routes.consultingBusiness,
    title: "Unternehmensberatung",
    number: "01",
    subtitle: "Optimierung von Prozessen und Strukturen zur nachhaltigen Stärkung Ihrer Wettbewerbsfähigkeit.",
    button: "Mehr erfahren",
    img: "/images/index/counseling/img1.webp",
  },
  {
    link: Consts.Routes.consultingDigitalTransformation,
    title: "Digitalisierungsberatung",
    number: "02",
    subtitle: "Digitale Lösungen und Automatisierung – mit bis zu 50% Kostenerstattung durch Förderprogramme.",
    button: "Mehr erfahren",
    img: "/images/index/counseling/img2.webp",
  },
  {
    link: Consts.Routes.consultingEconomic,
    title: "Wirtschaftsberatung",
    number: "03",
    subtitle: "Effiziente Finanzprozesse und digitale Dokumentation – mit Experten an Ihrer Seite.",
    button: "Mehr erfahren",
    img: "/images/index/counseling/img3.webp",
  },
]
</script>

<template>
  <div class="counseling-blocks">
    <router-link v-for="(block, index) in blocks" :key="index" :to="block.link" class="counseling-blocks__block">
      <div class="counseling-blocks__title">
        <h3>{{ block.title }}</h3>
        <span class="counseling-blocks__number">{{ block.number }}</span>
      </div>
      <span class="counseling-blocks__subtitle">{{ block.subtitle }}</span>
      <div class="counseling-blocks__image"></div>
      <button class="counseling-blocks__action">
        <span>{{ block.button }}</span>
        <ArrowIcon/>
      </button>
    </router-link>
  </div>
</template>


<style lang="scss" scoped>
.counseling-blocks {
  width: 100%;
  padding-top: calc(0.75 * $primary-margin-sections);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;

  &__block {
    text-decoration: none;
    cursor: pointer;
    position: relative;
    padding: 20px;
    background-color: $primary-gray-block;
    width: calc(33% - 6px);
    border-radius: $primary-radius;

    svg {
      transition: all 0.3s ease;
    }

    &:hover {
      svg {
        transform: translateX(6px) !important;
      }
    }

    &:first-child {
      .counseling-blocks__image {
        background-image: url('@/assets/images/index/counseling/img1.webp');
        background-size: cover;
        background-position-y: 20%;
      }
    }

    &:nth-child(2) {
      .counseling-blocks__subtitle {
        padding-right: 42px !important;
      }
      .counseling-blocks__image {
        background-image: url('@/assets/images/index/counseling/img2.webp');
        background-size: cover;
        background-position-y: 85%;
      }
    }

    &:last-child {
      .counseling-blocks__subtitle {
        padding-right: 42px !important;
      }
      .counseling-blocks__image {
        background-image: url('@/assets/images/index/counseling/img3.webp');
        background-size: cover;
        background-position-y: 55%;
      }
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-family: $Manrope-Medium;
      font-weight: 500;
      font-size: 24px;
      color: $default-white;
    }
  }

  &__number {
    font-family: $Manrope-Regular;
    font-weight: 400;
    font-size: 24px;
    color: $primary-gray-number;
  }

  &__subtitle {
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $primary-light-gray;
    display: flex;
    margin: 12px 0;
  }

  &__image {
    width: 100%;
    border-radius: 2px;
    aspect-ratio: 8/3;
    margin-bottom: calc(0.25 * $primary-margin-sections);
  }

  &__action {
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-right: 8px;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 18px;
      color: $primary-green;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: $primary-green;
      }
    }

    svg {
      width: 24px;
      height: 24px;

      * {
        fill: $primary-green;
      }
    }
  }
}


@media (width < 1160px) {
  .counseling-blocks {
    &__title {
      h3 {
        font-size: 21px;
      }
    }

    &__number {
      font-size: 21px;
    }

    &__action {
      span {
        font-size: 16px;
      }
    }
  }
}

@media (width < 1024px) {
  .counseling-blocks {
    &__block {
      width: calc(50% - 4px);
    }
    &__subtitle {
      font-size: 15px;
    }
  }
}

@media (width < 740px) {
  .counseling-blocks {
    &__block {
      max-width: 550px;
      width: 100%;
    }
    &__subtitle {
      font-size: 16px;
    }
  }
}
</style>