<script lang="ts" setup>
import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <section class="hero">
    <div class="hero__background"></div>

    <div class="hero__content">
      <h2 class="hero__title">
        Eine
        <span>erfolgreiche Wirtschaft</span>
        basiert darauf,
        wirtschaftlich und effizient zu handeln.
      </h2>

      <p class="hero__subtitle hero__subtitle--intro">
        Getreu diesem Leitsatz unterstützen wir Unternehmen dabei, Prozesse zu optimieren, die Rentabilität nachhaltig zu steigern und die Digitalisierung für den zukünftigen Erfolg voranzutreiben.
      </p>

      <p class="hero__subtitle">
        Jetzt Förderfähigkeit prüfen - in 2 Minuten zum Ergebnis.
        Finden Sie heraus, ob Ihr Unternehmen Anspruch auf staatliche Zuschüsse oder Fördermittel hat - einfach, schnell und kostenlos.
      </p>

      <div class="hero__actions">
        <button
          class="baseButton__w240 baseButton__primaryGreen"
          aria-label="Fördermittel check"
          @click="openDialog"
        >
          Fördermittel check
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$size-title: clamp(28px, 4.5vw, 67px);

.hero {
  position: relative;
  min-height: clamp(418px, 41vw, 520px);
  padding-top: clamp(30px, 8vw, 66px);
  overflow: hidden;

  &__background {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100dvw;
    transform: translateX(-50%);
    height: clamp(500px, 47vw, 592px);
    background-image: url("assets/images/index/background.webp");
    background-size: cover;
    background-position: center;
    z-index: -1;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__title {
    margin-bottom: 8px;
    font-family: $Manrope-Regular;
    font-size: $size-title;
    font-weight: 400;
    line-height: 1.1;
    color: $default-white;

    span {
      display: contents;
      font-family: $Manrope-Regular;
      font-size: $size-title;
      font-weight: 400;
      color: $primary-green;
    }
  }

  &__subtitle {
    max-width: 640px;
    margin-bottom: clamp(28px, 4.5vw, 67px);
    font-family: $Inter-Regular;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: $primary-light-gray;

    &--intro {
      margin-bottom: 16px;
    }
  }

  &__actions {
    max-width: 240px;
    width: 100%;
    display: flex;

    button {
      width: 100%;
    }
  }
}

@media (width < 1160px) {
  .hero__subtitle {
    margin-bottom: clamp(42px, 6vw, 84px);
  }
}

@media (width < 620px) {
  .hero {
    &__background {
      background-position-x: 50%;
    }
  }
}

@media (width < 580px) {
  .hero {
    &__actions {
      max-width: none;

      button {
        max-width: none !important;
      }
    }
  }
}
</style>
