<script lang="ts" setup>
import {useMessagesStore} from "@/stores/messages";

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <div class="main__wrap"></div>
  <section class="main">
    <h2 class="main__title">
      Eine
      <span>erfolgreiche Wirtschaft</span>
      basiert darauf,
      wirtschaftlich und effizient zu handeln.
    </h2>
    <h3 style="margin-bottom: 16px" class="main__subtitle">
      Getreu diesem Leitsatz unterstützen wir Unternehmen dabei, Prozesse zu optimieren, die Rentabilität nachhaltig zu steigern und die Digitalisierung für den zukünftigen Erfolg voranzutreiben.
    </h3>
    <h3 class="main__subtitle">
      Jetzt Förderfähigkeit prüfen – in 2 Minuten zum Ergebnis!“
      Finden Sie heraus, ob Ihr Unternehmen Anspruch auf staatliche Zuschüsse oder Fördermittel hat – einfach, schnell und kostenlos.
    </h3>
    <div class="main__actions">
      <button
          @click="openDialog"
          aria-label="Fördermittel check"
          class="baseButton__w240 baseButton__primaryGreen">Fördermittel check</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>

$size-title: clamp(28px, 4.5vw, 67px);

.main {
  padding-top: clamp(30px, 8vw, 66px);
  min-height: clamp(418px, 41vw, 520px);
  &__wrap {
    position: absolute;
    top: 0;
    left: 0;
    height: clamp(500px, 47vw, 592px);
    width: 100dvw;
    background-image: url("assets/images/index/background.webp");
    background-size: cover;
    z-index: -1;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 0;
    }
  }

  &__title {
    font-size: $size-title;
    font-family: $Manrope-Regular;
    color: $default-white;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 8px;

    span {
      display: contents;
      font-size: $size-title;
      font-family: $Manrope-Regular;
      color: $primary-green;
      font-weight: 400;
    }
  }

  &__subtitle {
    max-width: 640px;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $primary-light-gray;
    margin-bottom: clamp(28px, 4.5vw, 67px);
    //margin-bottom: clamp(32px, 7.5vw, 110px);

  }
  
  &__actions {
    max-width: 490px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      width: calc(50% - 4px);
    }
  }
}

@media (width < 1160px) {
  .main__subtitle {
    margin-bottom: clamp(42px, 6vw, 84px);
  }
}

@media (width < 1024px) {
  .main__subtitle {
    //font-size: 15px;
  }

  .main__actions {
    max-width: 410px;
  }
}

@media (width < 620px) {
  .main {
    &__wrap {
      background-position-x: 50%;
    }
  }
}

@media (width < 580px) {
  .main__actions {
    max-width: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    button {
      max-width: none !important;
      width: 100%;
    }
  }
}

</style>