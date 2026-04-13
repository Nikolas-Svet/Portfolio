<script lang="ts" setup>
import ArrowIcon from "@/assets/images/arrow.svg";
import {useMessagesStore} from "@/stores/messages";

const blocks = [
  {
    title: "Gespräch mit dem virtuellen Assistenten",
    number: "01",
    subtitle: "Starten Sie die Beratung direkt auf der Website. Der Assistent stellt Ihnen gezielte Fragen und analysiert Ihre Angaben und Dokumente.",
  },
  {
    title: "Individuelle Auswertung und Report",
    number: "02",
    subtitle: "Auf Basis Ihrer Antworten erstellt das System einen strukturierten Analysebericht mit Problemen, Empfehlungen und passenden Förderprogrammen.",
  },
  {
    title: "Persönliches Gespräch & Umsetzung",
    number: "03",
    subtitle: "Sie erhalten einen Link zum Online-Termin mit dem Berater. Dort besprechen wir gemeinsam nächste Schritte, Maßnahmen und Lösungen.",
  },
]

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <div class="steps-blocks">
    <div v-for="(block, index) in blocks" :key="index" class="steps-blocks__block">
      <h3 class="steps-blocks__title">{{ block.title }}</h3>
      <span class="steps-blocks__subtitle">{{ block.subtitle }}</span>
      <span class="steps-blocks__number">{{ block.number }}</span>
    </div>
  </div>
  <button @click="openDialog" class="baseButton__primaryGreen baseButton__w270 steps-blocks__action">
    Fördermittel check
    <ArrowIcon/>
  </button>
</template>

<style lang="scss" scoped>
.steps-blocks {
  width: 100%;
  padding-top: calc(0.75 * $primary-margin-sections);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;

  &__block {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 20px;
    background-color: $primary-gray-block;
    border: 1px solid $primary-gray-number;
    width: calc(33% - 5.4px);
    border-radius: $primary-radius;
  }

  &__title {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(19px, 2vw, 28px);
    line-height: 1;
    color: $default-white;
    text-transform: uppercase;
  }

  &__number {
    display: flex;
    font-family: $Manrope-Regular;
    font-weight: 400;
    font-size: 70px;
    line-height: 1;
    margin-top: 20px;
    color: $primary-gray-number;
  }

  &__subtitle {
    flex: 1;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $default-white;
    opacity: 0.8;
    margin-top: 24px;
    padding-bottom: 72px;
    display: flex;
    border-bottom: 1px solid $primary-gray-number;
  }

  &__action {
    margin-top: calc(0.5 * $primary-margin-sections);
    max-width: none !important;

    svg {
      margin-left: 12px;
    }
  }
}

@media (width < 950px) {
  .steps-blocks {
    &__block {
      width: calc(50% - 4px);
    }
  }
}

@media (max-width: 630px) {
  .steps-blocks {
    &__block {
      width: 100%;
    }
    &__title {
      font-size: 21px;
    }
    &__subtitle {
      padding-bottom: 40px;
    }

    &__number {
      font-size: 42px;
    }

    &__action {
      margin-top: 32px;
    }
  }
}
</style>