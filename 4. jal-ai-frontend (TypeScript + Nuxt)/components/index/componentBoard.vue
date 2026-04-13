<script setup lang="ts">
import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <section class="cta-board">
    <div class="cta-board__content">
      <h2 class="cta-board__title">
        Bereit für mehr
        <span>Effizienz</span>
        <br />
        und nachhaltiges Wachstum?
      </h2>

      <p class="cta-board__subtitle">
        Wir unterstützen Unternehmen dabei, Prozesse zu optimieren, die Rentabilität zu steigern und die Digitalisierung voranzutreiben.
      </p>

      <div class="cta-board__actions">
        <button class="baseButton__w240 baseButton__primaryGreen" @click="openDialog">
          Fördermittel check
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta-board {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  margin-top: $primary-margin-sections;
  padding-top: $primary-margin-sections;
  padding-bottom: $primary-margin-sections;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  &__content {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: calc(0.75 * $primary-margin-sections) calc(0.5 * $primary-margin-sections);
    border-radius: $primary-radius;
    background-color: $default-white;

    &::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: clamp(300px, 28vw, 360px);
      aspect-ratio: 5 / 6;
      background-image: url("@/assets/images/index/board/img.webp");
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  &__title {
    max-width: 740px;
    margin-bottom: clamp(72px, 7vw, 86px);
    font-family: $Manrope-Medium;
    font-size: clamp(44px, 4vw, 52px);
    font-weight: 500;
    line-height: 1;
    color: $default-black;

    span {
      display: contents;
      color: $primary-green;
    }
  }

  &__subtitle {
    max-width: 720px;
    margin-bottom: 24px;
    font-family: $Manrope-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.5;
    color: $default-black;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

@media (width < 970px) {
  .cta-board {
    &__content::after {
      display: none;
    }

    &__title,
    &__subtitle,
    button {
      max-width: none !important;
    }

    &__actions {
      flex-direction: column;
    }
  }
}

@media (width < 768px) {
  .cta-board {
    &__content {
      padding: clamp(16px, 3vw, 24px);
    }

    &__title {
      font-size: clamp(29px, 5vw, 40px);
      margin-bottom: 32px;
    }

    &__subtitle {
      font-size: clamp(16px, 2.6vw, 20px);
    }
  }
}
</style>
