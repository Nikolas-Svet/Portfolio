<script setup lang="ts">
import ArrowIcon from '@/assets/images/arrow.svg';
import {useMessagesStore} from "@/stores/messages";
const blocks = [
  {
    title: "Subventionen",
    number: "01",
    subtitle: "Unsere Dienstleistungen werden durch BAFA und andere staatliche Förderprogramme unterstützt. Wir begleiten Sie bei jedem Schritt – von der Antragstellung bis zur Auszahlung.",
  },
  {
    title: "Ganzheitlicher Ansatz",
    number: "02",
    subtitle: "Wir kombinieren Prozessoptimierung, Digitalisierung und Finanzmanagement zu einer maßgeschneiderten Lösung für Ihr Unternehmen.",
  },
  {
    title: "Geschwindigkeit",
    number: "03",
    subtitle: "Unsere Projekte sind auf Effizienz ausgelegt: Vom ersten Analyse bis zur Umsetzung vergehen maximal 90 Tage, damit Sie schnell von den Verbesserungen profitieren.",
  },
  {
    title: "Erfolgsgarantie",
    number: "03",
    subtitle: "Wir sichern nachhaltiges Wachstum Ihrer Rentabilität ab mindestens 10 % — andernfalls erstatten wir 20 % unseres Honorars zurück.",
  },
]

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
 <div class="us-blocks">
   <div v-for="(block, index) in blocks" :key="index" class="us-blocks__block">
     <span class="us-blocks__number">{{ block.number }}</span>
     <h3 class="us-blocks__title">{{ block.title }}</h3>
     <p class="us-blocks__subtitle">{{ block.subtitle }}</p>
   </div>
 </div>
  <div class="us-blocks__action">
    <button @click="openDialog" class="baseButton__w270 baseButton__primaryGreen">
      Fördermittel check
      <ArrowIcon/>
    </button>
  </div>
</template>

<style scoped lang="scss">
.us-blocks {
  margin-top: calc( 0.75 * $primary-margin-sections);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;


  &__block {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 0 1px 0 0;
      width: 1px;
      height: calc(100% - clamp(32px, 2.75vw, 40px));
      background-color: $primary-light-gray;
    }
  }

  &__number {
    width: clamp(64px, 5.5vw, 80px);
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 1px solid $primary-light-gray;
    color: $default-white;
    font-family: $Manrope-Regular;
    font-size: 24px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: clamp(70px, 6vw, 90px);
  }

  &__title {
    padding-left: 20px;
    padding-right: 4px;
    font-family: $Roboto-Regular;
    color: $primary-green;
    font-size: clamp(21px, 2.2vw, 32px);
    font-weight: 400;
    line-height: 1;
    margin-bottom: 8px;
  }

  &__subtitle {
    padding-left: 20px;
    padding-right: 8px;
    font-family: $Inter-Regular;
    color: $default-white;
    font-size: 14px;
    font-weight: 400;
  }

  &__action {
    max-width: 73.5%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: calc(0.5 * $primary-margin-sections);

    button {

      svg {
        margin-left: 8px;
        * {
          fill: $default-white;
        }
      }
    }
  }
}

@media (width < 1024px) {
  .us-blocks {
    &__block {
      width: 50%;

      &:nth-last-child(2) {
        margin-top: 20px;
      }
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

@media (width < 700px) {
  .us-blocks {
    gap: 16px;
    justify-content: center;
    &__block {
      width: 100%;
      max-width: 550px;

      &:nth-last-child(2) {
        margin-top: 0;
      }
      &:last-child {
        margin-top: 0;
      }

      &:after {
        height: calc(100% - 22.5px);
      }
    }

    &__action {
      width: 100%;
      max-width: none;
      button {
        max-width: none !important;
      }
    }

    &__number {
      width: 45px;
      font-size: 18px;
      margin-bottom: 40px;
    }
  }
}
</style>