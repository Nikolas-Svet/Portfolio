<script setup lang="ts">
import {useMessagesStore} from "@/stores/messages";

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
<section class="board">
  <div class="board__content">
      <p class="board__question">
        Bereit für mehr
        <span>Effizienz</span> <br>
        und nachhaltiges Wachstum?
      </p>
      <span class="board__subtitle">
        Wir unterstützen Unternehmen dabei, Prozesse zu optimieren, die Rentabilität zu steigern und die Digitalisierung voranzutreiben.
      </span>
      <div class="board__actions">
        <button @click="openDialog" class="baseButton__w240 baseButton__primaryGreen">Fördermittel check</button>
      </div>
  </div>
</section>
</template>

<style scoped lang="scss">
.board {
  width: 100%;
  margin-top: $primary-margin-sections;
  padding-top: $primary-margin-sections;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;

  padding-bottom: $primary-margin-sections;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }

  &__content {
    overflow: hidden;
    width: 100%;
    border-radius: $primary-radius;
    background-color: $default-white;
    padding: calc(0.75 * $primary-margin-sections) calc(0.5 * $primary-margin-sections);
    position: relative;

    &:after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: clamp(300px, 28vw, 360px);
      aspect-ratio: 5/6;
      background-size: cover;
      background-image: url("@/assets/images/index/board/img.webp");
      background-repeat: no-repeat;
    }
  }


  &__question {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(44px, 4vw, 52px);
    line-height: 1;
    max-width: 740px;
    margin-bottom: clamp(72px, 7vw, 86px);
    color: $default-black;

    span {
      display: contents;
      color: $primary-green;
    }
  }

  &__subtitle {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: 20px;
    max-width: 720px;
    display: flex;
    line-height: 1.5;
    margin-bottom: 24px;
    color: $default-black;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

@media (width < 970px) {
  .board {
    &__content {
      &:after {
        display: none;
      }
    }

    &__question, &__subtitle, button {
      max-width: none !important;
    }

    &__actions {
      flex-direction: column;
    }

  }
}

@media (width < 768px) {
  .board {
    &__content {
      padding: clamp(16px, 3vw, 24px);
    }
    &__question {
      font-size: clamp(29px, 5vw, 40px);
      margin-bottom: 32px;
    }
    &__subtitle {
      font-size: clamp(16px, 2.6vw, 20px);
    }
  }
}
</style>